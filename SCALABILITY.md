# Scalability Note — KeyVault Platform

## Current Architecture

KeyVault is built on a stateless, serverless-ready stack designed to scale horizontally without architectural rewrites.

---

## Stateless Authentication (Scales Immediately)

JWT tokens are self-contained — no session store is needed. Any server instance can verify a token independently using only the JWT_SECRET. This means you can run 10 or 100 instances behind a load balancer and auth will work correctly on every one.

```
User → Load Balancer → [Server 1 | Server 2 | Server 3]
Any server verifies the JWT — no shared session state required.
```

---

## Database Scalability (Neon DB)

The app uses **Neon DB** — a serverless Postgres service that:
- Auto-scales compute based on traffic (scales to zero when idle)
- Supports **connection pooling** via PgBouncer (already in the connection string)
- Branches databases for dev/staging/prod environments
- No manual scaling or server provisioning needed

For higher write throughput, the next step would be **read replicas** for query-heavy operations like usage stats.

---

## Rate Limiter — The One Bottleneck

**Current implementation**: In-memory sliding window using a `Map<apiKeyId, timestamps[]>`.

**Problem**: If 3 server instances run, each has its own memory map. A user could make 100 req/min per instance = 300 req/min total. The rate limit breaks.

**Solution**: Replace with a **Redis-based rate limiter**:

```typescript
// Current (in-memory — single server only)
const windowMap = new Map<string, number[]>();

// Production fix: Upstash Redis (serverless, edge-compatible)
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "1 m"),
});
```

Upstash Redis is free-tier available and works in Edge/serverless environments with zero ops overhead.

---

## Caching Strategy (Next Step)

Expensive queries like `GET /api/v1/usage` aggregate across all request logs. As the table grows, this gets slow.

**Recommendation**: Cache usage stats with a short TTL (e.g., 30 seconds) using Redis:

```typescript
const cached = await redis.get(`usage:${userId}`);
if (cached) return JSON.parse(cached);

const stats = await db.query(...);
await redis.setex(`usage:${userId}`, 30, JSON.stringify(stats));
```

---

## Horizontal Scaling Plan

| Layer | Current | Production-ready upgrade |
|---|---|---|
| App servers | 1 (local) | N instances behind Nginx/ALB |
| Rate limiting | In-memory | Upstash Redis |
| Database | Neon DB (serverless) | Neon + read replicas |
| Caching | None | Redis (usage stats, key lookups) |
| CDN | None | Cloudflare (static assets) |
| Auth | Stateless JWT | No change needed ✅ |

---

## Microservices Path

If this were to grow into a full SaaS platform, the logical split would be:

1. **Auth Service** — registration, login, token refresh
2. **Key Service** — key generation, validation, revocation
3. **Gateway Service** — rate limiting, logging, routing
4. **Analytics Service** — async consumption of request logs for dashboards

Each service communicates via REST or message queues (e.g., Redis Pub/Sub or BullMQ).

---

## Docker Deployment

The app is containerizable with a standard Dockerfile:

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Deploy to: **Vercel** (zero-config for Next.js), **Railway**, **Render**, or **AWS ECS**.

---

## Summary

KeyVault's architecture is already aligned with production scalability principles:
- ✅ Stateless auth — horizontal scaling ready
- ✅ Serverless DB — auto-scaling with connection pooling
- ✅ Clean 4-layer architecture — easy to split into microservices
- ⚡ One upgrade needed: Redis rate limiter for multi-instance deployments
