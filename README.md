# 🔑 KeyVault — API Key Management & Rate Limiting Platform

> **PrimeTradeAI Backend Developer Internship Assignment**  
> Built by: Koushik Varakala

A production-grade backend platform demonstrating secure API key management, JWT authentication, role-based access control, rate limiting, and full CRUD operations — built with **Next.js 16 (App Router)**, **PostgreSQL (Neon DB)**, and **Prisma ORM**.

---

## 🚀 Live Features

| Feature | Status |
|---|---|
| User Registration & Login | ✅ |
| JWT Authentication (Access + Refresh) | ✅ |
| Role-Based Access Control (USER / ADMIN) | ✅ |
| API Key Generation (SHA-256 hashed storage) | ✅ |
| API Key Revocation | ✅ |
| Rate Limiting (100 req/min sliding window) | ✅ |
| Request Usage Logging | ✅ |
| Notes CRUD API (secondary entity) | ✅ |
| API Versioning (`/api/v1/`) | ✅ |
| Input Validation (Zod) | ✅ |
| Admin Panel | ✅ |
| Responsive Dashboard UI | ✅ |
| Landing Page | ✅ |

---

## 🏗️ Architecture

```
src/
├── app/
│   ├── api/v1/
│   │   ├── auth/         # register, login, logout
│   │   ├── api-keys/     # CRUD for API keys
│   │   ├── notes/        # CRUD for notes (secondary entity)
│   │   ├── usage/        # usage stats
│   │   ├── admin/        # admin-only endpoints
│   │   └── protected-data/ # example rate-limited endpoint
│   ├── dashboard/        # main UI
│   ├── login/
│   ├── register/
│   └── page.tsx          # landing page
├── services/             # business logic
├── repositories/         # data access layer (Prisma)
├── validators/           # Zod schemas
├── lib/                  # prisma, jwt, hash, rateLimit utilities
└── proxy.ts              # Next.js middleware for auth/RBAC
```

---

## ⚙️ Setup & Installation

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd backendprimetradeAI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file (copy from `.env.example`):

```bash
cp .env.example .env.local
```

Fill in the values:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-min-32-chars"
```

> 💡 Get a free PostgreSQL database at [neon.tech](https://neon.tech)

### 4. Push database schema

```bash
npx prisma db push
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔌 API Reference

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register new user | ❌ |
| POST | `/api/v1/auth/login` | Login & receive JWT cookies | ❌ |
| POST | `/api/v1/auth/logout` | Clear auth cookies | ❌ |

### API Keys

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/api-keys` | List user's API keys | ✅ JWT |
| POST | `/api/v1/api-keys` | Generate new API key | ✅ JWT |
| DELETE | `/api/v1/api-keys/:id` | Revoke an API key | ✅ JWT |

### Notes (CRUD)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/notes` | List all notes | ✅ JWT |
| POST | `/api/v1/notes` | Create a note | ✅ JWT |
| GET | `/api/v1/notes/:id` | Get a single note | ✅ JWT |
| PATCH | `/api/v1/notes/:id` | Update a note | ✅ JWT |
| DELETE | `/api/v1/notes/:id` | Delete a note | ✅ JWT |

### Protected API (API Key authenticated)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/protected-data` | Fetch market data | ✅ API Key |

### Admin

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/admin/users` | List all users | ✅ JWT + ADMIN role |

---

## 🔐 Security Implementation

### Password Hashing
```typescript
// bcrypt with 12 salt rounds
const hash = await bcrypt.hash(password, 12);
```

### JWT Tokens
- **Access Token**: 15 minute expiry, stored in HttpOnly cookie
- **Refresh Token**: 7 day expiry, stored in HttpOnly cookie
- **Library**: `jose` (Edge-compatible, no native Node.js crypto dependency)

### API Key Security
- Generated with `crypto.randomBytes(32)` — 256 bits of entropy
- **Only the SHA-256 hash is stored** in the database
- The raw key is shown once and never retrievable again
- Keys are masked in the UI (`kv_live_abc...xyz`)

### Rate Limiting
```
Algorithm: Sliding Window
Limit: 100 requests per minute per API key
Response on limit: 429 Too Many Requests
Headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
```

---

## 🧪 Testing the API

### Option 1: Postman

Import `postman_collection.json` from the repo root.

### Option 2: cURL

**Register:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Login:**
```bash
curl -c cookies.txt -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Generate API Key:**
```bash
curl -b cookies.txt -X POST http://localhost:3000/api/v1/api-keys \
  -H "Content-Type: application/json" \
  -d '{"name":"My App"}'
```

**Call Protected API:**
```bash
curl -H "Authorization: Bearer <your_api_key>" \
  http://localhost:3000/api/v1/protected-data
```

**Create a Note:**
```bash
curl -b cookies.txt -X POST http://localhost:3000/api/v1/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"My Note","content":"This is the content"}'
```

---

## 📦 Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** | Full-stack framework (App Router) |
| **TypeScript** | Type safety across all layers |
| **PostgreSQL (Neon DB)** | Serverless relational database |
| **Prisma ORM v5** | Type-safe database queries |
| **jose** | JWT signing & verification (Edge-safe) |
| **bcrypt** | Password hashing |
| **Zod** | Runtime input validation |
| **Tailwind CSS** | Styling |

---

## 🗄️ Database Schema

```prisma
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  role         Role     @default(USER)  // USER | ADMIN
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  apiKeys      ApiKey[]
  notes        Note[]
}

model ApiKey {
  id          String       @id @default(uuid())
  keyHash     String       @unique  // SHA-256 hash only
  maskedKey   String
  name        String
  isActive    Boolean      @default(true)
  createdAt   DateTime     @default(now())
  expiresAt   DateTime?
  userId      String
  requestLogs RequestLog[]
}

model Note {
  id        String   @id @default(uuid())
  title     String
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  userId    String
}

model RequestLog {
  id         String   @id @default(uuid())
  endpoint   String
  method     String
  statusCode Int
  timestamp  DateTime @default(now())
  apiKeyId   String
}
```
