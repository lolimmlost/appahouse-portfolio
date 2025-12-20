---
title: "OmniChat - Building a Self-Hosted AI Live Chat Widget with Ollama"
date: "2025-12-17"
excerpt: "How I built a self-hosted live chat widget with AI-powered responses using Ollama, Socket.io real-time communication, and a complete admin dashboard - all without third-party tracking."
tags: ["Node.js", "Socket.io", "Ollama", "Express", "AI", "Self-Hosted", "Privacy", "Real-time"]
author: "Juan"
category: "Case Study"
featuredImage: ""
published: true
readTime: "7 min read"
---

# OmniChat - Building a Self-Hosted AI Live Chat Widget with Ollama

## Introduction

Live chat widgets are everywhere on modern websites, but they come with tradeoffs: monthly subscriptions, user tracking, data sent to third-party servers, and limited customization. What if you could have instant AI-powered responses for common questions while keeping complete control of your data?

OmniChat is my answer - a self-hosted live chat system with three components: an embeddable widget, a real-time admin dashboard, and an AI backend powered by local Ollama models.

## Table of Contents

- [Introduction](#introduction)
- [The Problem](#the-problem)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [The Chat Widget](#the-chat-widget)
- [Socket.io Server](#socketio-server)
- [Ollama Integration](#ollama-integration)
- [Admin Dashboard](#admin-dashboard)
- [Security Considerations](#security-considerations)
- [Lessons Learned](#lessons-learned)
- [Conclusion](#conclusion)

## The Problem

### Third-Party Chat Services

Popular chat widgets like Intercom, Drift, and Crisp offer great features but:

- **Cost**: $50-300+/month for reasonable features
- **Privacy**: All conversations flow through their servers
- **Tracking**: User behavior data collected and monetized
- **Lock-in**: Conversations trapped in their platform

### My Requirements

For the AppaHouse portfolio, I needed:

1. **Instant responses** for common questions
2. **Human handoff** for complex inquiries
3. **Self-hosted** to keep data private
4. **AI assistance** without cloud API costs
5. **Simple embedding** on any website

## Architecture

OmniChat has three main components:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Chat Widget    │     │  Socket Server  │     │ Admin Dashboard │
│  (Embeddable)   │────▶│  (Express/IO)   │◀────│  (React)        │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │     Ollama      │
                        │  (Local LLM)    │
                        └─────────────────┘
```

All communication happens over WebSockets via Socket.io, with the server orchestrating between visitors, admins, and the AI.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Server | Node.js + Express |
| Real-time | Socket.io |
| AI | Ollama (llama3.2) |
| Widget | Vanilla JS (lightweight) |
| Admin | Simple HTML/JS |
| Notifications | Webhooks |

### Why This Stack?

- **Socket.io**: Battle-tested real-time library with fallbacks
- **Ollama**: Free, local AI inference with streaming
- **Vanilla JS Widget**: No framework overhead, tiny bundle
- **Express**: Minimal, flexible, well-understood

## The Chat Widget

The widget needs to be lightweight and easy to embed:

```html
<!-- Single script tag to embed -->
<script
  src="https://chat.appahouse.com/widget.js"
  data-site-id="portfolio"
></script>
```

### Widget Implementation

```javascript
// widget.js (simplified)
(function() {
  const SOCKET_URL = 'https://chat.appahouse.com';

  // Create chat container
  const container = document.createElement('div');
  container.id = 'omnichat-widget';
  container.innerHTML = `
    <button class="omnichat-trigger">💬</button>
    <div class="omnichat-window hidden">
      <div class="omnichat-header">
        <span>Chat with us</span>
        <button class="omnichat-close">×</button>
      </div>
      <div class="omnichat-messages"></div>
      <div class="omnichat-input">
        <input type="text" placeholder="Type a message...">
        <button>Send</button>
      </div>
    </div>
  `;
  document.body.appendChild(container);

  // Connect to server
  const socket = io(SOCKET_URL);

  socket.on('connect', () => {
    socket.emit('visitor:join', {
      siteId: getSiteId(),
      pageUrl: window.location.href,
      pageTitle: document.title,
    });
  });

  // Handle incoming messages
  socket.on('message', (data) => {
    appendMessage(data.content, data.sender);
  });
})();
```

### Styling Considerations

The widget CSS is carefully scoped to avoid conflicts:

```css
#omnichat-widget * {
  box-sizing: border-box;
  font-family: system-ui, sans-serif;
}

.omnichat-trigger {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #2563eb;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
```

## Socket.io Server

The server handles three types of connections:

```javascript
// socket-handler.js
const visitorSockets = new Map(); // socketId -> sessionId
const adminSockets = new Set();   // authenticated admin sockets

function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    const clientIp = getClientIp(socket);

    // Rate limiting
    if (!trackConnection(clientIp, socket.id)) {
      socket.emit('error', { message: 'Too many connections' });
      socket.disconnect(true);
      return;
    }

    // Visitor events
    socket.on('visitor:join', handleVisitorJoin);
    socket.on('visitor:message', handleVisitorMessage);

    // Admin events
    socket.on('admin:auth', handleAdminAuth);
    socket.on('admin:message', handleAdminMessage);
    socket.on('admin:takeover', handleAdminTakeover);
  });
}
```

### Session Management

Each visitor gets a session that persists across page navigation:

```javascript
function createSession(siteId, visitorInfo) {
  const session = {
    id: generateId(),
    siteId,
    status: 'active', // active | waiting | closed
    mode: 'ai',       // ai | human
    visitorInfo,
    messages: [],
    createdAt: new Date(),
  };

  sessions.set(session.id, session);
  return session;
}
```

### Message Flow

```javascript
async function handleVisitorMessage(socket, data) {
  const sessionId = visitorSockets.get(socket.id);
  const session = sessions.get(sessionId);

  // Store message
  session.messages.push({
    content: data.message,
    sender: 'visitor',
    timestamp: new Date(),
  });

  // Notify admins
  io.to('admins').emit('admin:new-message', {
    sessionId,
    message: data.message,
  });

  // If AI mode, generate response
  if (session.mode === 'ai') {
    await generateAiResponse(session, data.message);
  }
}
```

## Ollama Integration

Ollama provides local LLM inference with streaming responses:

### Context Setup

```javascript
// ollama.js
const SYSTEM_PROMPT = `You are a helpful assistant for AppaHouse,
a portfolio website showcasing full-stack web applications.
Keep responses concise (1-3 sentences).
Be friendly and professional.
If asked about pricing or availability, suggest the contact form.`;

async function generateResponse(session, userMessage) {
  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.2',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...formatHistory(session.messages),
        { role: 'user', content: userMessage },
      ],
      stream: true,
    }),
  });

  return response.body; // ReadableStream
}
```

### Streaming Responses

Streaming provides better UX than waiting for complete responses:

```javascript
async function streamResponse(session, userMessage, socket) {
  const stream = await generateResponse(session, userMessage);
  const reader = stream.getReader();
  const decoder = new TextDecoder();

  let fullResponse = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (!line) continue;
      const json = JSON.parse(line);

      if (json.message?.content) {
        fullResponse += json.message.content;

        // Send partial update
        socket.emit('message:stream', {
          content: json.message.content,
          done: false,
        });
      }
    }
  }

  // Send completion
  socket.emit('message:stream', { done: true });

  // Store complete response
  session.messages.push({
    content: fullResponse,
    sender: 'ai',
    timestamp: new Date(),
  });
}
```

### Quick Replies

For common questions, suggest clickable quick replies:

```javascript
function generateQuickReplies(context) {
  const replies = [];

  if (context.isFirstMessage) {
    replies.push(
      { text: 'View projects', action: 'navigate', url: '#projects' },
      { text: 'See demos', action: 'navigate', url: '#demos' },
      { text: 'Contact', action: 'navigate', url: '#contact' },
    );
  }

  return replies;
}
```

## Admin Dashboard

A simple dashboard for monitoring and responding to chats:

```javascript
// Admin authentication
socket.on('admin:auth', async (data) => {
  const isValid = await verifyToken(data.token);

  if (isValid) {
    adminSockets.add(socket.id);
    socket.join('admins');

    // Send active sessions
    socket.emit('admin:sessions', getActiveSessions());
  } else {
    socket.emit('admin:auth-failed');
  }
});

// Human takeover
socket.on('admin:takeover', (data) => {
  const session = sessions.get(data.sessionId);

  if (session) {
    session.mode = 'human';

    // Notify visitor
    io.to(`session:${session.id}`).emit('system:message', {
      content: 'A human agent has joined the chat.',
    });
  }
});
```

## Security Considerations

### Rate Limiting

Prevent abuse with connection and message limits:

```javascript
const connectionsByIp = new Map();
const MAX_CONNECTIONS_PER_IP = 5;
const MAX_MESSAGES_PER_MINUTE = 20;

function trackConnection(ip, socketId) {
  const connections = connectionsByIp.get(ip) || [];

  if (connections.length >= MAX_CONNECTIONS_PER_IP) {
    return false; // Reject
  }

  connections.push(socketId);
  connectionsByIp.set(ip, connections);
  return true;
}
```

### Input Sanitization

All user input is sanitized before processing:

```javascript
function sanitizeText(text) {
  if (typeof text !== 'string') return '';

  return text
    .slice(0, 2000)           // Max length
    .replace(/<[^>]*>/g, '')  // Strip HTML
    .trim();
}
```

### CORS Configuration

Only allow requests from known origins:

```javascript
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (ALLOWED_ORIGINS.includes(origin) ||
          origin.endsWith('.appahouse.com')) {
        return callback(null, true);
      }

      callback(new Error('CORS not allowed'));
    },
  },
});
```

## Webhook Notifications

Get notified when new conversations start:

```javascript
async function notifyNewSession(session) {
  if (!WEBHOOK_URL) return;

  await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: 'new_session',
      session: {
        id: session.id,
        visitorInfo: session.visitorInfo,
        createdAt: session.createdAt,
      },
    }),
  });
}
```

This integrates with Discord, Slack, or any webhook-compatible service.

## Lessons Learned

### 1. Streaming Is Essential

Waiting for complete AI responses feels slow. Streaming provides immediate feedback and significantly improves perceived performance.

### 2. Context Files Should Be Concise

Long system prompts increase latency and cost. Keep context focused on what the AI needs to know for this specific use case.

### 3. Rate Limiting From Day One

Even on a small site, bots and curious users will test limits. Implement rate limiting before launching.

### 4. Socket.io Handles Edge Cases

Connection drops, reconnections, and fallback transports are all handled by Socket.io. Don't reinvent this.

### 5. Human Handoff Is Critical

AI can handle common questions, but users need to know they can reach a human for complex issues.

## Tech Stack Summary

| Component | Technology | Purpose |
|-----------|------------|---------|
| Server | Express | HTTP + static files |
| Real-time | Socket.io | WebSocket communication |
| AI | Ollama | Local LLM inference |
| Widget | Vanilla JS | Lightweight embed |
| Storage | In-memory | Session data |
| Notifications | Webhooks | External alerts |

## Conclusion

OmniChat proves that self-hosted live chat with AI doesn't require complex infrastructure or cloud services. Socket.io handles real-time communication, Ollama provides free local AI inference, and a simple widget embeds anywhere.

The result is a chat system where:
- Common questions get instant AI answers
- Humans can take over any conversation
- All data stays on your server
- No monthly fees or user tracking

For portfolio sites, documentation pages, or any low-to-medium traffic website, this approach provides professional live chat without the SaaS overhead.

## Further Reading

- [Socket.io Documentation](https://socket.io/docs/)
- [Ollama](https://ollama.ai/)
- [Express.js](https://expressjs.com/)
- [Building Chat Applications](https://socket.io/get-started/chat)

---

*Real-time chat. Local AI. Zero tracking.*
