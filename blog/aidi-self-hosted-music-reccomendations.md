---
title: "AIDJ - Building a Self-Hosted AI Music Dashboard with Privacy-First Architecture"
date: "2025-10-04"
excerpt: "A comprehensive guide to building AIDJ, a self-hosted music dashboard that integrates Navidrome for streaming, with planned Ollama-powered AI recommendations - keeping your music data private."
tags: ["React 19", "TanStack Start", "Navidrome", "Ollama", "PostgreSQL", "Drizzle ORM", "Better Auth", "Self-Hosted", "AI", "Privacy"]
author: "Juan"
category: "Case Study"
featuredImage: ""
published: true
readTime: "10 min read"
---

# AIDJ - Building a Self-Hosted AI Music Dashboard with Privacy-First Architecture

## Introduction

In an era where streaming services track every play, skip, and pause to feed recommendation algorithms, there's a growing movement toward reclaiming control of our music libraries. AIDJ (AI-assisted DJ) was born from this philosophy: a modern web application that integrates self-hosted music services while preparing for local AI-powered recommendations.

This case study explores how we built a unified dashboard for Navidrome music streaming, with architecture designed to eventually incorporate Ollama for AI recommendations - all running on your local network for complete privacy.

## Table of Contents

- [Introduction](#introduction)
- [The Problem](#the-problem)
- [Architecture Overview](#architecture-overview)
- [Tech Stack Deep Dive](#tech-stack-deep-dive)
- [Key Features Implementation](#key-features-implementation)
- [Self-Hosted Service Integration](#self-hosted-service-integration)
- [Development Workflow](#development-workflow)
- [Challenges and Solutions](#challenges-and-solutions)
- [Future: AI Recommendations with Ollama](#future-ai-recommendations-with-ollama)
- [Lessons Learned](#lessons-learned)
- [Conclusion](#conclusion)

## The Problem

### Music Streaming Privacy Concerns

Every major streaming service collects extensive data:
- **Listening history**: Every song, skip, and replay
- **Time of day patterns**: When you listen to what genres
- **Device information**: Where and how you access music
- **Social connections**: Who you share music with

For privacy-conscious users, this data collection is unacceptable - especially when the music files already exist on their own hard drives.

### Self-Hosted Solution Gaps

Existing self-hosted solutions like Navidrome are excellent for streaming, but they lack:
- **Unified dashboard**: Configuration and status monitoring in one place
- **Modern UI**: Most interfaces feel dated compared to commercial alternatives
- **AI recommendations**: No path to intelligent music discovery without cloud services
- **Multi-service integration**: Managing multiple services (music, AI, database) separately

## Architecture Overview

AIDJ uses a modern monolithic architecture with clear separation of concerns:

```
aidj/
├── src/
│   ├── components/       # Shared UI components (shadcn/ui)
│   ├── lib/
│   │   ├── auth/         # Better Auth implementation
│   │   ├── db/           # Drizzle ORM + PostgreSQL
│   │   ├── config/       # App configuration
│   │   ├── services/     # External service integrations
│   │   └── stores/       # State management (audio player)
│   └── routes/           # TanStack Router file-based routes
├── public/               # Static assets
└── tests/                # Vitest test suites
```

### System Components

```
[AIDJ Web App]              [Self-Hosted Services]
├── TanStack Start          ├── Navidrome (Music)
├── React 19                ├── PostgreSQL (Data)
├── Better Auth             └── Ollama (AI - Planned)
├── Drizzle ORM
└── Custom Audio Player
```

## Tech Stack Deep Dive

### Frontend: React 19 + TanStack Start

We're using the cutting edge of React development:

```typescript
// TanStack Start provides file-based routing
// routes/library/artists.tsx
export const Route = createFileRoute('/library/artists')({
  component: ArtistsPage,
  loader: async () => {
    return await fetchArtists();
  },
});

function ArtistsPage() {
  const artists = Route.useLoaderData();
  return <ArtistGrid artists={artists} />;
}
```

**Key decisions:**
- **React 19 + React Compiler**: Automatic memoization, improved performance
- **TanStack Start**: Full-stack React framework with file-based routing
- **TanStack Query**: Server state management with caching
- **shadcn/ui + Tailwind v4**: Beautiful, accessible components

### Authentication: Better Auth

Better Auth provides a modern, type-safe authentication system:

```typescript
// lib/auth/index.ts
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Self-hosted, so relaxed
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session daily
  },
});
```

### Database: PostgreSQL + Drizzle ORM

Type-safe database access with excellent developer experience:

```typescript
// lib/db/schema.ts
import { pgTable, uuid, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const serviceConfigs = pgTable('service_configs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  serviceName: varchar('service_name', { length: 50 }).notNull(),
  serviceUrl: varchar('service_url', { length: 500 }),
  apiKey: varchar('api_key', { length: 500 }),
  isActive: boolean('is_active').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

## Key Features Implementation

### 1. Navidrome Integration

Navidrome provides a Subsonic-compatible API for music streaming:

```typescript
// lib/services/navidrome.ts
export class NavidromeService {
  private baseUrl: string;
  private credentials: { username: string; password: string };

  constructor(config: NavidromeConfig) {
    this.baseUrl = config.url;
    this.credentials = {
      username: config.username,
      password: config.password,
    };
  }

  async getArtists(): Promise<Artist[]> {
    const response = await this.request('/rest/getArtists');
    return response.artists.index.flatMap((idx: any) => idx.artist);
  }

  async getAlbum(id: string): Promise<Album> {
    const response = await this.request('/rest/getAlbum', { id });
    return response.album;
  }

  async stream(id: string): Promise<string> {
    // Returns a streaming URL with authentication
    const params = this.buildAuthParams();
    return `${this.baseUrl}/rest/stream?id=${id}&${params}`;
  }

  private buildAuthParams(): string {
    const salt = this.generateSalt();
    const token = md5(this.credentials.password + salt);
    return `u=${this.credentials.username}&t=${token}&s=${salt}&v=1.16.1&c=aidj`;
  }
}
```

### 2. Custom Audio Player

A responsive audio player with queue management:

```typescript
// lib/stores/player.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  volume: number;
  progress: number;

  play: (track: Track) => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  addToQueue: (track: Track) => void;
  setVolume: (volume: number) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      currentTrack: null,
      queue: [],
      isPlaying: false,
      volume: 0.8,
      progress: 0,

      play: (track) => {
        set({ currentTrack: track, isPlaying: true });
        // Audio element managed separately
      },

      next: () => {
        const { queue, currentTrack } = get();
        const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
        if (currentIndex < queue.length - 1) {
          set({ currentTrack: queue[currentIndex + 1] });
        }
      },

      // ... other methods
    }),
    { name: 'aidj-player' }
  )
);
```

### 3. Service Configuration Interface

A unified dashboard for managing all connected services:

```typescript
// routes/config/index.tsx
export default function ConfigPage() {
  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: fetchServiceConfigs,
  });

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <ServiceCard
        title="Navidrome"
        description="Music streaming server"
        status={services?.navidrome?.isActive ? 'connected' : 'disconnected'}
        onConfigure={() => openNavidromeConfig()}
      />
      <ServiceCard
        title="Ollama"
        description="Local AI for recommendations"
        status="coming-soon"
        disabled
      />
    </div>
  );
}
```

### 4. Music Library Browser

Responsive library browsing with search and filtering:

```typescript
// routes/library/index.tsx
export default function LibraryPage() {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'artists' | 'albums' | 'songs'>('artists');

  const { data: results, isLoading } = useQuery({
    queryKey: ['library', view, search],
    queryFn: () => searchLibrary(view, search),
    enabled: search.length > 0 || view !== 'songs',
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <SearchInput value={search} onChange={setSearch} />
        <ViewToggle value={view} onChange={setView} />
      </div>

      {view === 'artists' && <ArtistGrid artists={results} />}
      {view === 'albums' && <AlbumGrid albums={results} />}
      {view === 'songs' && <SongList songs={results} />}
    </div>
  );
}
```

## Self-Hosted Service Integration

### Navidrome Setup

Navidrome runs as a Docker container:

```yaml
# docker-compose.yml
services:
  navidrome:
    image: deluan/navidrome:latest
    ports:
      - "4533:4533"
    environment:
      ND_SCANSCHEDULE: 1h
      ND_LOGLEVEL: info
      ND_SESSIONTIMEOUT: 24h
      ND_ENABLETRANSCODINGCONFIG: "true"
    volumes:
      - "./data/navidrome:/data"
      - "/path/to/music:/music:ro"
    restart: unless-stopped
```

### PostgreSQL for AIDJ

```yaml
services:
  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: aidj
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: aidj
    volumes:
      - "./data/postgres:/var/lib/postgresql/data"
    restart: unless-stopped
```

### Environment Configuration

```bash
# .env
DATABASE_URL="postgresql://aidj:password@localhost:5432/aidj"
BETTER_AUTH_SECRET="your-32-character-secret-here"
NAVIDROME_URL="http://localhost:4533"
NAVIDROME_USERNAME="admin"
NAVIDROME_PASSWORD="your-navidrome-password"

# Future: Ollama configuration
# OLLAMA_URL="http://localhost:11434"
```

## Development Workflow

### CI/CD Pipeline

GitHub Actions ensures code quality on every push:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npm run check-types
      - run: npm run test:coverage
      - run: npm run build

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
```

### Testing Strategy

```typescript
// src/components/__tests__/PlayerControls.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { PlayerControls } from '../PlayerControls';

describe('PlayerControls', () => {
  it('toggles play/pause on button click', () => {
    const onToggle = vi.fn();
    render(<PlayerControls isPlaying={false} onToggle={onToggle} />);

    fireEvent.click(screen.getByRole('button', { name: /play/i }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('shows pause icon when playing', () => {
    render(<PlayerControls isPlaying={true} onToggle={() => {}} />);
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
  });
});
```

## Challenges and Solutions

### Challenge 1: Subsonic API Authentication

The Subsonic API uses a specific authentication scheme with salted tokens.

**Solution**: Implemented proper token generation:

```typescript
function buildAuthParams(username: string, password: string): string {
  const salt = crypto.randomBytes(6).toString('hex');
  const token = md5(password + salt);
  return `u=${username}&t=${token}&s=${salt}&v=1.16.1&c=aidj`;
}
```

### Challenge 2: Audio Streaming Across Devices

HTML5 audio has cross-origin restrictions that complicate streaming from Navidrome.

**Solution**: Proxy streaming through the AIDJ backend:

```typescript
// routes/api/stream/[id].ts
export async function GET(request: Request) {
  const id = request.params.id;
  const streamUrl = await navidrome.getStreamUrl(id);

  // Proxy the stream with proper headers
  const response = await fetch(streamUrl);
  return new Response(response.body, {
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'audio/mpeg',
      'Accept-Ranges': 'bytes',
    },
  });
}
```

### Challenge 3: State Persistence Across Refreshes

Users expect the player to remember their queue and progress.

**Solution**: Zustand with localStorage persistence:

```typescript
const usePlayerStore = create(
  persist(
    (set) => ({
      // ... state and actions
    }),
    {
      name: 'aidj-player',
      partialize: (state) => ({
        queue: state.queue,
        volume: state.volume,
        // Don't persist isPlaying - always start paused
      }),
    }
  )
);
```

## Future: AI Recommendations with Ollama

The architecture is designed for local AI integration:

```typescript
// Planned: lib/services/ollama.ts
export class OllamaService {
  private baseUrl: string;

  async generateRecommendations(
    recentPlays: Track[],
    mood?: string
  ): Promise<Track[]> {
    const prompt = this.buildPrompt(recentPlays, mood);

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      body: JSON.stringify({
        model: 'llama2',
        prompt,
        stream: false,
      }),
    });

    const result = await response.json();
    return this.parseRecommendations(result.response);
  }

  private buildPrompt(tracks: Track[], mood?: string): string {
    const history = tracks.map(t => `${t.artist} - ${t.title}`).join('\n');
    return `Based on these recently played songs:
${history}

${mood ? `Current mood: ${mood}` : ''}

Suggest 5 similar songs from my library that I might enjoy.
Format: Artist - Song Title`;
  }
}
```

### Why Local AI Matters

- **No data leaves your network**: Your listening habits stay private
- **No subscription fees**: One-time setup, runs forever
- **Customizable models**: Fine-tune recommendations to your taste
- **Offline capable**: Works without internet

## Lessons Learned

### 1. Start with the Core Experience

Building the audio player and Navidrome integration first validated the entire concept before investing in peripheral features.

### 2. Self-Hosted Simplifies Auth

For self-hosted apps, you can relax many auth requirements (email verification, password complexity) since the user controls their own instance.

### 3. TanStack Start is Production-Ready

Despite being relatively new, TanStack Start provides everything needed for a modern full-stack React application.

### 4. Proxy External Services

Proxying external APIs through your backend solves CORS issues and keeps credentials server-side.

### 5. Test the Integration Points

The most valuable tests are those covering the integration between AIDJ and external services like Navidrome.

## Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + TanStack Start |
| Routing | TanStack Router (file-based) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| State | Zustand + TanStack Query |
| Auth | Better Auth |
| Database | PostgreSQL |
| ORM | Drizzle |
| Music Server | Navidrome |
| AI (Planned) | Ollama |
| Testing | Vitest + React Testing Library |
| CI/CD | GitHub Actions |

## Conclusion

AIDJ demonstrates that self-hosted doesn't mean sacrificing user experience. By combining modern React with self-hosted services, we've created a music dashboard that rivals commercial alternatives while keeping all data on your local network.

The planned Ollama integration will bring AI-powered recommendations without surrendering privacy. When you can run a capable LLM on consumer hardware, there's no reason to send your listening habits to corporate servers.

For users who value both great music experiences and data privacy, self-hosted solutions like AIDJ represent the future - not a compromise, but the best of both worlds.

## Further Reading

- [Navidrome Documentation](https://www.navidrome.org/docs/)
- [TanStack Start](https://tanstack.com/start/latest)
- [Better Auth](https://www.better-auth.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Ollama](https://ollama.ai/)
- [Subsonic API](http://www.subsonic.org/pages/api.jsp)
- [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19)

---

*Your music. Your data. Your rules.*
