---
title: "PaletaApp - Building a Hyperlocal Street Vendor Platform with Privacy-First Architecture"
date: "2025-12-10"
excerpt: "A deep dive into building PaletaApp, a modern mobile platform connecting street vendors with customers through fuzzy pings and demand intelligence - all while prioritizing user privacy."
tags: ["React Native", "Expo", "Hono", "Better Auth", "Drizzle ORM", "PostgreSQL", "TypeScript", "PWA", "Mobile Development", "Privacy-First"]
author: "Juan"
category: "Case Study"
featuredImage: ""
published: true
readTime: "12 min read"
---

# PaletaApp - Building a Hyperlocal Street Vendor Platform with Privacy-First Architecture

## Introduction

Street vendors have served communities for generations, yet they remain largely invisible in our digital age. PaletaApp was born from a simple observation: vendors walk their routes hoping for customers while customers wish they knew when their favorite paletero would pass by. This case study explores how we built a hyperlocal, privacy-first platform that bridges this gap using modern web technologies.

Unlike delivery apps that extract fees and track users, PaletaApp creates a trust-based ecosystem where vendors gain demand intelligence before leaving home, and customers receive "fuzzy pings" that create anticipation rather than surveillance.

## Table of Contents

- [Introduction](#introduction)
- [The Problem](#the-problem)
- [Architecture Overview](#architecture-overview)
- [Tech Stack Deep Dive](#tech-stack-deep-dive)
- [Key Features Implementation](#key-features-implementation)
- [Privacy-First Design](#privacy-first-design)
- [Challenges and Solutions](#challenges-and-solutions)
- [Lessons Learned](#lessons-learned)
- [Conclusion](#conclusion)

## The Problem

### Vendor Pain Points

Carlos, a paletero in Phoenix, represents thousands of street vendors facing daily challenges:

- **Unpredictable demand**: Walking routes blindly, hoping for customers
- **Melted inventory**: No way to know where demand exists before leaving home
- **No digital presence**: Word-of-mouth only, limited to existing customers

### Customer Pain Points

Rosa, a work-from-home mom, represents the customer side:

- **Missing vendors**: "Is the paleta man coming today?" is unanswerable
- **No anticipation**: By the time she hears the bell, it's often too late
- **Privacy concerns**: Doesn't want another app tracking her location

## Architecture Overview

PaletaApp uses a monorepo architecture with clear separation between mobile, API, and shared packages:

```
paletaapp/
├── apps/
│   ├── mobile/          # Expo + React Native
│   └── api/             # Hono API server
├── packages/
│   └── shared/          # Types, schemas, constants
└── docs/                # Architecture & sprint artifacts
```

### System Components

```
[Mobile PWA]                    [API Server]
├── Expo Router                 ├── Hono (REST API)
├── TanStack Query              ├── Better Auth
├── NativeWind (Tailwind)       ├── Drizzle ORM
├── Service Worker              └── Web Push (VAPID)
        │                              │
        └───────── PostgreSQL ─────────┘
```

## Tech Stack Deep Dive

### Frontend: Expo SDK 52 + React Native

We chose Expo for its cross-platform capabilities and PWA support. The PWA-first strategy allows frictionless onboarding - customers can browse vendor menus without installing anything.

```typescript
// Expo Router file-based routing
app/
├── (auth)/            # Login/Register flows
├── (customer)/        # Customer experience
├── (vendor)/          # Vendor dashboard
└── v/[slug].tsx       # Public vendor profiles
```

**Key decisions:**
- **NativeWind v4**: Tailwind CSS for React Native, enabling dark theme with lime/green accents
- **TanStack Query**: Server state management with offline support
- **Zustand**: Lightweight client state for UI preferences

### Backend: Hono + Better Auth

Hono provides a lightweight, Web Standard-compliant API server. Better Auth handles authentication with auto-generated schema integration.

```typescript
// API endpoint structure
/api/auth/*              → Better Auth
/api/v1/vendors          → Vendor CRUD
/api/v1/vendors/:slug/qr → QR generation
/api/v1/pings            → Ping system
/api/v1/desires          → Demand intelligence
/api/v1/push/subscribe   → Push subscriptions
```

### Database: PostgreSQL + Drizzle ORM

Drizzle provides type-safe database access with excellent DX:

```typescript
// Schema example with drizzle-zod integration
export const vendors = pgTable('vendors', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  businessName: varchar('business_name', { length: 255 }),
  slug: varchar('slug', { length: 100 }).unique(),
  verificationStatus: pgEnum('verification_status'),
  approvalStatus: pgEnum('approval_status'),
  createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

// Auto-generate Zod schemas from Drizzle
export const insertVendorSchema = createInsertSchema(vendors);
export const selectVendorSchema = createSelectSchema(vendors);
```

## Key Features Implementation

### 1. Fuzzy Pings: The Heart of the Product

The "fuzzy ping" is PaletaApp's signature feature - intentionally delayed notifications that create anticipation rather than surveillance.

```typescript
// Ping state machine
type PingStatus =
  | 'pending'    // Soft start initiated
  | 'confirmed'  // Vendor tapped "go live"
  | 'sending'    // System processing
  | 'sent'       // Delivered to followers
  | 'failed'     // Delivery error
  | 'cancelled'  // Vendor cancelled
  | 'expired';   // 30min timeout

// Fuzzy delay implementation
const FUZZY_DELAY_MIN = 5 * 60 * 1000;  // 5 minutes
const FUZZY_DELAY_MAX = 10 * 60 * 1000; // 10 minutes

function calculateFuzzyDelay(): number {
  return Math.random() * (FUZZY_DELAY_MAX - FUZZY_DELAY_MIN) + FUZZY_DELAY_MIN;
}
```

When Carlos taps "I'm out!", his followers receive notifications 5-10 minutes later. This creates the ice cream truck magic - anticipation builds, but Rosa doesn't know exactly when Carlos will arrive.

### 2. Demand Intelligence

Vendors see aggregate desires by location before leaving home:

```typescript
// Desires are stored WITHOUT user_id for privacy
interface Desire {
  id: string;
  productType: string;       // "mango", "coconut"
  zone: string;              // Zip code
  fingerprintHash: string;   // Rate limiting only
  createdAt: Date;
}

// API returns ONLY aggregates - no individual data
// GET /api/v1/desires/aggregate?zone=85033
// Response: { "mango": 8, "coconut": 3 }
```

### 3. QR Code Growth Engine

Every vendor gets a unique QR code that becomes their primary growth tool:

```typescript
// QR generation endpoint
app.get('/api/v1/vendors/:slug/qr', async (c) => {
  const { slug } = c.req.param();
  const vendor = await db.query.vendors.findFirst({
    where: eq(vendors.slug, slug)
  });

  const qrUrl = `https://paletaapp.com/v/${slug}`;
  const svg = await QRCode.toString(qrUrl, { type: 'svg' });

  return c.body(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400'
    }
  });
});
```

**QR Attribution Tracking**: We track how many customers joined via each vendor's QR code, enabling gamification ("3 people joined because of your QR!").

### 4. Photo-Based Trust System

Instead of star ratings (easily faked), trust is built through real neighbor photos:

```typescript
// Photo with product tagging
interface Photo {
  id: string;
  userId: string;
  vendorId: string;
  productId: string;     // Auto-suggested from recent purchase
  url: string;
  thumbnailUrl: string;
  createdAt: Date;
}

// Photo processing with sharp
async function processPhoto(buffer: Buffer): Promise<ProcessedPhoto> {
  const processed = await sharp(buffer)
    .resize(1200, 1200, { fit: 'inside' })
    .webp({ quality: 80 })
    .toBuffer();

  const thumbnail = await sharp(buffer)
    .resize(300, 300, { fit: 'cover' })
    .webp({ quality: 70 })
    .toBuffer();

  return { processed, thumbnail };
}
```

### 5. Web Push Notifications (VAPID)

Self-managed push notifications without vendor lock-in:

```typescript
// Push subscription management
app.post('/api/v1/push/subscribe', async (c) => {
  const { endpoint, keys } = await c.req.json();
  const session = c.get('session');

  await db.insert(pushSubscriptions).values({
    userId: session.userId,
    sessionId: session.id,
    endpoint,
    p256dh: keys.p256dh,
    auth: keys.auth,
  });

  return c.json({ success: true });
});

// Sending fuzzy pings
async function sendPing(ping: Ping) {
  const subscriptions = await db.query.pushSubscriptions.findMany({
    where: inArray(
      pushSubscriptions.userId,
      getFollowerIds(ping.vendorId)
    )
  });

  for (const sub of subscriptions) {
    await webPush.sendNotification({
      endpoint: sub.endpoint,
      keys: { p256dh: sub.p256dh, auth: sub.auth }
    }, JSON.stringify({
      title: `${ping.vendor.businessName} is heading your way!`,
      icon: '/icon-192.png',
      tag: `ping-${ping.id}`,
    }));
  }
}
```

## Privacy-First Design

Privacy isn't just policy - it's architectural:

### Anonymous Desire Aggregation

```typescript
// Desires stored WITHOUT user_id
// Individual locations never exposed
// Vendors see only aggregates by zone
```

### Device Fingerprinting for Rate Limiting Only

```typescript
// Guest desires rate-limited without tracking
// Fingerprint used for abuse prevention only
// 10 desires/IP/day as backup
```

### Data Retention Policy

| Data | Retention | Method |
|------|-----------|--------|
| Ping history | 30 days | Cron job |
| Desire aggregates | 7 days | Cron job |
| Deleted accounts | 30 days then hard delete | GDPR compliance |

### Soft Delete Pattern

```typescript
// All main tables include deleted_at
// Queries filter by default
where(isNull(table.deletedAt))

// Hard delete cron (GDPR compliance)
DELETE WHERE deleted_at < NOW() - INTERVAL '30 days'
```

## Challenges and Solutions

### Challenge 1: Safari iOS Web Push Limitations

Safari requires Add-to-Home-Screen before web push works.

**Solution**: Clear onboarding flow after first vendor follow:
```typescript
// Full-screen modal with A2HS instructions
// Only shown on iOS Safari
// Graceful degradation if dismissed
```

### Challenge 2: Cold Start Problem

No vendors = no value for customers. No customers = no value for vendors.

**Solution**: Multi-pronged approach:
1. **Vendor-first launch**: Onboard 5-10 vendors before public launch
2. **QR as growth engine**: Each vendor interaction spreads the network
3. **Honest empty states**: No fake data, clear guidance on network building
4. **Hyperlocal density**: Start in ONE neighborhood, achieve density before breadth

### Challenge 3: Offline Support for Vendors

Vendors often have spotty coverage while walking routes.

**Solution**: IndexedDB action queue with background sync:
```typescript
// Queue actions when offline
const offlineQueue = useOfflineQueue();

const handlePing = async () => {
  if (navigator.onLine) {
    await sendPing();
  } else {
    offlineQueue.add({ type: 'SEND_PING', data: pingData });
  }
};

// Sync when back online
useEffect(() => {
  const handleOnline = () => offlineQueue.sync();
  window.addEventListener('online', handleOnline);
  return () => window.removeEventListener('online', handleOnline);
}, []);
```

### Challenge 4: 99%+ Push Notification Delivery

The fuzzy ping IS the product. Unreliable delivery breaks the core promise.

**Solution**: Delivery tracking with retry logic:
```typescript
// Track every push delivery
interface PingDelivery {
  pingId: string;
  subscriptionId: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  retryCount: number;
  sentAt: Date;
  deliveredAt?: Date;
  failedAt?: Date;
}

// Retry failed pushes up to 3 times
const MAX_RETRIES = 3;
```

## Performance Optimizations

### Bundle Size Budget

```typescript
const BUDGETS = {
  initialBundle: 200 * 1024,      // 200KB JS
  firstContentfulPaint: 1500,     // 1.5s on 3G
  timeToInteractive: 3000,        // 3s on 3G
  imageMaxSize: 100 * 1024,       // 100KB per image
};
```

### Image Optimization

- WebP with JPEG fallback
- Progressive loading with blurhash placeholders
- Automatic thumbnail generation (300px)
- Max dimension 1200px

### Caching Strategy

```typescript
// Service Worker strategies
// API calls: NetworkFirst (5s timeout, fallback to cache)
// Static assets: CacheFirst (versioned)
// Images: StaleWhileRevalidate
```

## Lessons Learned

### 1. Start with the Emotional Experience

The fuzzy ping delay seemed counterintuitive - why not real-time? But the intentional delay creates the ice cream truck magic. Sometimes slower is better.

### 2. Privacy as Architecture, Not Policy

Building privacy into the data model (no user IDs on desires, anonymous aggregation) is more defensible than privacy policies alone.

### 3. Monorepo for Solo Development

Sharing types between frontend and backend via `@paletaapp/shared` eliminated entire categories of bugs and made refactoring fearless.

### 4. PWA-First Simplifies Onboarding

Rosa can browse Carlos's menu without installing anything. The app install comes naturally after she sees value.

### 5. Honest Empty States Build Trust

Showing "No cravings yet - share your QR code!" is more trustworthy than fake data. Early adopters appreciate authenticity.

## Code Examples

### TanStack Query with Offline Support

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    },
  },
});

// Persist to IndexedDB
const persister = createSyncStoragePersister({
  storage: indexedDB,
});

persistQueryClient({
  queryClient,
  persister,
});
```

### Optimistic Updates for Follow/Unfollow

```typescript
const followMutation = useMutation({
  mutationFn: followVendor,
  onMutate: async (vendorId) => {
    await queryClient.cancelQueries(['vendor', vendorId]);
    const previous = queryClient.getQueryData(['vendor', vendorId]);

    queryClient.setQueryData(['vendor', vendorId], (old) => ({
      ...old,
      isFollowing: true,
      followerCount: old.followerCount + 1,
    }));

    return { previous };
  },
  onError: (err, vendorId, context) => {
    queryClient.setQueryData(['vendor', vendorId], context.previous);
    toast.error('Failed to follow. Try again.');
  },
});
```

### Environment Validation with Zod

```typescript
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  VAPID_PUBLIC_KEY: z.string(),
  VAPID_PRIVATE_KEY: z.string(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(Number).default('3000'),
});

export const env = envSchema.parse(process.env);
```

## Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Mobile/Web | Expo SDK 52 + Expo Router |
| Styling | NativeWind v4 (Tailwind) |
| Server State | TanStack Query |
| Client State | Zustand |
| API Server | Hono |
| Auth | Better Auth |
| Database | PostgreSQL |
| ORM | Drizzle |
| Validation | Zod + drizzle-zod |
| Push | Web Push (VAPID) |
| Images | Sharp |

## Conclusion

PaletaApp demonstrates that modern web technologies can solve real community problems while respecting user privacy. The combination of Expo for cross-platform development, Hono for a lightweight API, and a privacy-first architecture creates a foundation that scales without compromising on the core emotional experience.

The fuzzy ping isn't just a feature - it's a philosophy. Sometimes the best technology gets out of the way and lets anticipation build. When Rosa's phone buzzes with "Carlos is heading your way", she doesn't check a map. She tells her kids to get their shoes on. That's the product.

For street vendors like Carlos, PaletaApp transforms hope into strategy. For customers like Rosa, it transforms wishing into knowing. And for the community, it creates connections that delivery apps could never replicate.

## Further Reading

- [Expo SDK 52 Documentation](https://docs.expo.dev/)
- [Hono - Web Standard Framework](https://hono.dev/)
- [Better Auth](https://www.better-auth.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Web Push Protocol](https://web.dev/push-notifications-overview/)
- [NativeWind](https://www.nativewind.dev/)

---

*Built with modern web technologies for the communities that technology often forgets.*
