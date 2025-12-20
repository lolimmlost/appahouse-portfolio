---
title: "App Map - Building a Modern Homelab Dashboard with TanStack Start"
date: "2025-12-18"
excerpt: "A deep dive into building App Map, a self-hosted homelab dashboard for managing and monitoring all your self-hosted applications with health checks, categories, and Uptime Kuma integration."
tags: ["React 19", "TanStack Start", "PostgreSQL", "Drizzle ORM", "Better Auth", "Homelab", "Self-Hosted", "Uptime Kuma"]
author: "Juan"
category: "Case Study"
featuredImage: ""
published: true
readTime: "8 min read"
---

# App Map - Building a Modern Homelab Dashboard with TanStack Start

## Introduction

As homelabs grow from a few Docker containers to dozens of self-hosted services, keeping track of everything becomes a challenge. Bookmarks get scattered across browsers, services go down without notice, and remembering what each application does requires digging through old notes.

App Map solves this by providing a single, modern dashboard for cataloging all homelab applications with real-time health monitoring, categories, and integration with existing monitoring tools like Uptime Kuma.

## Table of Contents

- [Introduction](#introduction)
- [The Problem](#the-problem)
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
- [Database Schema](#database-schema)
- [Health Check System](#health-check-system)
- [Uptime Kuma Integration](#uptime-kuma-integration)
- [Lessons Learned](#lessons-learned)
- [Conclusion](#conclusion)

## The Problem

### Homelab Growing Pains

A typical homelab might include:

- **Media**: Plex, Jellyfin, Navidrome
- **Automation**: Home Assistant, Node-RED
- **Infrastructure**: Portainer, Proxmox, TrueNAS
- **Networking**: Pi-hole, Nginx Proxy Manager
- **Development**: Gitea, code-server, various dev servers
- **Utilities**: Paperless, Vaultwarden, Nextcloud

That's easily 20+ services, each with its own URL, port, and purpose. Managing this becomes problematic:

- **Discovery**: "What's running on port 8384 again?"
- **Health**: "Is Plex down or did I misconfigure something?"
- **Documentation**: "Why did I set up this service?"
- **Access**: Different URLs for local vs remote access

### Existing Solutions Fall Short

Homer and similar dashboard tools are static - you edit YAML files and rebuild. No health checks, no notes, no dynamic management. Uptime Kuma handles monitoring but not organization. I needed both in one place.

## Architecture Overview

App Map uses TanStack Start for a full-stack React application with server functions:

```
app-map/
├── src/
│   ├── components/       # UI components (shadcn/ui based)
│   │   ├── apps/         # App-specific components
│   │   ├── ui/           # Base UI components
│   │   └── widgets/      # Dashboard widgets
│   ├── database/
│   │   └── schema/       # Drizzle ORM schemas
│   ├── hooks/            # Custom React hooks
│   ├── lib/
│   │   ├── auth/         # Better Auth setup
│   │   └── server/       # Server functions
│   └── routes/           # File-based routing
├── drizzle/              # Migrations
└── public/               # Static assets
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start |
| Frontend | React 19 + React Compiler |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | PostgreSQL |
| ORM | Drizzle |
| Auth | Better Auth |
| State | TanStack Query |
| Monitoring | Uptime Kuma (optional) |

### Why TanStack Start?

TanStack Start provides the perfect balance of simplicity and power:

- **Server Functions**: Type-safe RPC without API boilerplate
- **File-based Routing**: Intuitive route organization
- **React 19**: Latest React features including the compiler
- **Full-stack**: Frontend and backend in one project

## Key Features

### 1. App Management

Each app in the dashboard includes:

```typescript
interface App {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;           // URL or emoji
  localUrl: string | null;       // Internal network URL
  remoteUrl: string | null;      // External/tunnel URL
  categoryId: string;
  healthCheckEnabled: boolean;
  healthCheckType: 'http' | 'tcp' | 'uptime_kuma';
  healthCheckUrl: string | null;
  uptimeKumaMonitorId: string | null;
  notes: string | null;          // Markdown documentation
  createdAt: Date;
  updatedAt: Date;
}
```

The dual URL system is crucial for homelabs - local URLs work on the network, remote URLs work through Cloudflare Tunnels or VPN.

### 2. Category Organization

Apps are grouped by category for easy navigation:

```typescript
const defaultCategories = [
  { name: 'Media', icon: '🎬', color: '#ef4444' },
  { name: 'Infrastructure', icon: '🏗️', color: '#3b82f6' },
  { name: 'Development', icon: '💻', color: '#22c55e' },
  { name: 'Networking', icon: '🌐', color: '#f59e0b' },
  { name: 'Utilities', icon: '🔧', color: '#8b5cf6' },
];
```

### 3. View Modes

Toggle between grid and list views based on preference:

```tsx
<div className="flex items-center border rounded-md">
  <Button
    variant={viewMode === "grid" ? "secondary" : "ghost"}
    onClick={() => setViewMode("grid")}
  >
    <LayoutGrid className="h-4 w-4" />
  </Button>
  <Button
    variant={viewMode === "list" ? "secondary" : "ghost"}
    onClick={() => setViewMode("list")}
  >
    <List className="h-4 w-4" />
  </Button>
</div>
```

### 4. Widgets

Quick-glance status information without scrolling:

- **Health Summary**: X of Y apps healthy
- **Recent Activity**: Last added/updated apps
- **Quick Actions**: Fast access to common tasks

## Database Schema

Drizzle ORM provides type-safe database access:

```typescript
// schema/apps.ts
export const apps = pgTable('apps', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  icon: varchar('icon', { length: 500 }),
  localUrl: varchar('local_url', { length: 500 }),
  remoteUrl: varchar('remote_url', { length: 500 }),
  categoryId: uuid('category_id')
    .references(() => categories.id)
    .notNull(),
  healthCheckEnabled: boolean('health_check_enabled').default(false),
  healthCheckType: varchar('health_check_type', { length: 20 }),
  healthCheckUrl: varchar('health_check_url', { length: 500 }),
  uptimeKumaMonitorId: varchar('uptime_kuma_monitor_id', { length: 50 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  icon: varchar('icon', { length: 50 }),
  color: varchar('color', { length: 20 }),
  sortOrder: integer('sort_order').default(0),
});
```

## Health Check System

### HTTP Health Checks

The simplest check - make a request and verify response:

```typescript
async function checkHttpHealth(url: string): Promise<HealthStatus> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
    });

    clearTimeout(timeout);

    return {
      status: response.ok ? 'healthy' : 'unhealthy',
      responseTime: Date.now() - startTime,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
    };
  }
}
```

### Health Status Display

Health is shown as colored dots on app cards:

```tsx
function HealthIndicator({ status }: { status: HealthStatus }) {
  const colors = {
    healthy: 'bg-green-500',
    unhealthy: 'bg-red-500',
    unknown: 'bg-gray-400',
    checking: 'bg-yellow-500 animate-pulse',
  };

  return (
    <span
      className={`w-2 h-2 rounded-full ${colors[status.status]}`}
      title={status.error || `${status.responseTime}ms`}
    />
  );
}
```

## Uptime Kuma Integration

For services already monitored by Uptime Kuma, we pull status instead of duplicating checks:

```typescript
async function getUptimeKumaStatus(
  monitorId: string
): Promise<HealthStatus> {
  const apiUrl = process.env.UPTIME_KUMA_API_URL;
  const apiKey = process.env.UPTIME_KUMA_API_KEY;

  const response = await fetch(
    `${apiUrl}/api/status-page/heartbeat/${monitorId}`,
    {
      headers: { 'X-API-Key': apiKey },
    }
  );

  const data = await response.json();

  return {
    status: data.status === 1 ? 'healthy' : 'unhealthy',
    uptime: data.uptime,
    responseTime: data.ping,
  };
}
```

This integration means:
- No duplicate monitoring
- Consistent status across tools
- Historical data available in Uptime Kuma

## Server Functions

TanStack Start's server functions eliminate API boilerplate:

```typescript
// lib/server/apps.ts
import { createServerFn } from '@tanstack/start';
import { db } from '@/database';
import { apps } from '@/database/schema/apps';

export const getApps = createServerFn('GET', async () => {
  const results = await db.query.apps.findMany({
    with: {
      category: true,
    },
    orderBy: [asc(apps.name)],
  });

  return { apps: results };
});

export const createApp = createServerFn('POST', async (ctx) => {
  const { data } = ctx;

  const [newApp] = await db.insert(apps).values(data).returning();

  return { app: newApp };
});
```

On the client, these are called like regular async functions:

```typescript
const { data } = useQuery({
  queryKey: ['apps'],
  queryFn: () => getApps(),
});

const mutation = useMutation({
  mutationFn: (data) => createApp({ data }),
});
```

## Authentication

Better Auth provides simple, secure authentication:

```typescript
// lib/auth/index.ts
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg' }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Self-hosted
  },
});
```

For a self-hosted dashboard, we can relax email verification since users manage their own instance.

## Lessons Learned

### 1. Start with Auth

Adding authentication early prevented scope creep. The dashboard is personal - multi-user support wasn't needed initially.

### 2. Integrate Don't Duplicate

Instead of building monitoring from scratch, integrating with Uptime Kuma leverages existing infrastructure and data.

### 3. Dual URLs Are Essential

The local/remote URL pattern solved real homelab needs - local access is fast, remote access works anywhere.

### 4. Notes Are Documentation

The notes field with Markdown support became invaluable for documenting why services exist and how they're configured.

### 5. Widgets Emerged from Use

The widget system wasn't planned initially but emerged from wanting quick status without scrolling through all apps.

## Tech Stack Summary

| Component | Choice | Why |
|-----------|--------|-----|
| Framework | TanStack Start | Full-stack React with server functions |
| UI | shadcn/ui | Beautiful, accessible, customizable |
| Database | PostgreSQL | Reliable, full-featured |
| ORM | Drizzle | Type-safe, great DX |
| Auth | Better Auth | Simple, self-hosted friendly |
| Monitoring | Uptime Kuma | Already deployed, excellent |

## Conclusion

App Map demonstrates that homelab dashboards don't need to be static YAML files. A modern stack with TanStack Start, Drizzle, and shadcn/ui creates a dynamic, responsive dashboard that grows with your homelab.

The key insight was integration over reinvention - connecting to Uptime Kuma instead of building monitoring, using Better Auth instead of rolling custom auth, leveraging shadcn/ui components instead of building from scratch.

For homelabbers drowning in bookmarks and wondering which services are actually running, a dedicated dashboard transforms chaos into clarity.

## Further Reading

- [TanStack Start Documentation](https://tanstack.com/start/latest)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Better Auth](https://www.better-auth.com/)
- [Uptime Kuma](https://github.com/louislam/uptime-kuma)
- [shadcn/ui](https://ui.shadcn.com/)

---

*Organize your homelab. Monitor your services. Document everything.*
