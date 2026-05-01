import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white font-sans overflow-x-hidden">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-4 border-b border-white/5 backdrop-blur-md bg-[#0a0a0f]/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold">K</div>
          <span className="font-semibold text-white tracking-tight">KeyVault</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-medium border border-violet-500/20">by Koushik</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Sign In</Link>
          <Link href="/register" className="text-sm px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 transition-colors font-medium">Get Started</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center text-center min-h-screen px-6 pt-20">
        {/* Glow effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            Production-grade API Key Management Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Secure API Access,
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Built for Developers
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            KeyVault lets you issue, manage, and monitor API keys with rate limiting, 
            usage tracking, and role-based access control — all from a clean developer dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3.5 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-violet-500/25"
            >
              Start for Free →
            </Link>
            <Link
              href="/login"
              className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold text-white transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 text-xs">
          <span>Scroll to learn more</span>
          <div className="w-px h-8 bg-gradient-to-b from-gray-600 to-transparent" />
        </div>
      </section>

      {/* WHAT IS IT */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">What is KeyVault?</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Think of it like Stripe or AWS — but for controlling who can access your APIs.
              You issue keys, they use them, you monitor everything.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🔑",
                title: "Issue API Keys",
                desc: "Generate high-entropy, cryptographically secure API keys instantly. Only the SHA-256 hash is ever stored — the raw key is shown once, like a real secret.",
              },
              {
                icon: "🚦",
                title: "Rate Limiting",
                desc: "Each key is rate-limited to 100 requests per minute using a sliding window algorithm. Exceed it and you get a clean 429 response with retry headers.",
              },
              {
                icon: "📊",
                title: "Usage Analytics",
                desc: "Every request is logged with endpoint, method, and status code. View per-key usage stats from your dashboard in real time.",
              },
              {
                icon: "🛡️",
                title: "JWT Authentication",
                desc: "Stateless auth with access tokens (15m) and refresh tokens (7d) stored in HttpOnly cookies. No session storage, no leaks.",
              },
              {
                icon: "👑",
                title: "Role-Based Access",
                desc: "Users manage their own keys. Admins get a separate panel to monitor all users, suspicious activity, and platform-wide access.",
              },
              {
                icon: "📝",
                title: "Notes (CRUD Demo)",
                desc: "Full Create, Read, Update, Delete for personal notes — demonstrating a complete secondary entity with proper REST API design.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-violet-500/20 transition-all group"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-white mb-2 group-hover:text-violet-300 transition-colors">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY USE IT */}
      <section className="py-32 px-6 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">Why use KeyVault?</h2>
            <p className="text-gray-400 text-lg">Real-world security patterns — the same ones used in production at scale.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                tag: "Security",
                color: "violet",
                points: [
                  "Passwords hashed with bcrypt (salt rounds = 12)",
                  "Keys stored as SHA-256 hashes — never in plaintext",
                  "JWT in HttpOnly cookies — XSS safe",
                  "Zod validation on every input — no dirty data enters",
                ],
              },
              {
                tag: "Architecture",
                color: "indigo",
                points: [
                  "Clean 4-layer architecture: Route → Service → Repository → DB",
                  "Prisma ORM with full TypeScript types",
                  "API versioning under /api/v1/",
                  "Async request logging — never slows down responses",
                ],
              },
              {
                tag: "Scalability",
                color: "purple",
                points: [
                  "Rate limiter is swappable with Redis for multi-instance",
                  "Stateless JWT means any server can verify tokens",
                  "Neon DB — serverless Postgres that scales automatically",
                  "Next.js App Router — edge-ready architecture",
                ],
              },
              {
                tag: "Developer Experience",
                color: "blue",
                points: [
                  "Proper REST status codes (201, 400, 401, 403, 429)",
                  "Meaningful error messages on every response",
                  "Postman collection for instant API testing",
                  "Masked keys in UI — never expose full secrets",
                ],
              },
            ].map((card) => (
              <div key={card.tag} className="p-8 rounded-2xl border border-white/5 bg-white/[0.02]">
                <span className={`inline-block text-xs px-3 py-1 rounded-full bg-${card.color}-500/10 text-${card.color}-300 border border-${card.color}-500/20 font-medium mb-6`}>
                  {card.tag}
                </span>
                <ul className="space-y-3">
                  {card.points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-gray-400 text-sm">
                      <span className="text-violet-400 mt-0.5 flex-shrink-0">✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">How it works</h2>
            <p className="text-gray-400 text-lg">From signup to your first protected API call in 3 steps.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                step: "01",
                title: "Register & Login",
                desc: "Create your account. You get a secure JWT session stored in an HttpOnly cookie — no localStorage, no risk.",
                code: `POST /api/v1/auth/register\n{ "email": "you@example.com", "password": "..." }`,
              },
              {
                step: "02",
                title: "Generate an API Key",
                desc: "From your dashboard, generate a named key. Copy it — you'll only see it once. The system stores only the hash.",
                code: `POST /api/v1/api-keys\n{ "name": "Production App" }\n→ { "apiKey": "kv_live_abc123..." }`,
              },
              {
                step: "03",
                title: "Call Protected APIs",
                desc: "Pass your key in the Authorization header. The system validates, rate-limits, logs, and responds.",
                code: `GET /api/v1/protected-data\nAuthorization: Bearer kv_live_abc123...\n→ { marketStatus: "OPEN", btcPrice: 64500 }`,
              },
            ].map((s) => (
              <div key={s.step} className="flex gap-6 p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-violet-500/20 transition-all">
                <div className="text-4xl font-bold text-white/10 font-mono flex-shrink-0 w-12">{s.step}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{s.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">{s.desc}</p>
                  <pre className="text-xs text-violet-300 font-mono bg-violet-950/30 border border-violet-500/10 rounded-lg px-4 py-3 whitespace-pre-wrap">
                    {s.code}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S NEXT — ROADMAP */}
      <section className="py-32 px-6 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">What could make this even better?</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              The current build is production-ready as a baseline. Here&apos;s what would take it to the next level.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: "Redis Rate Limiting", desc: "Replace in-memory map with Upstash Redis for multi-server rate limiting that actually works at scale.", status: "High Impact" },
              { label: "Webhook Alerts", desc: "Notify users via webhook when their key hits the rate limit or is used from an unexpected IP.", status: "Product" },
              { label: "Key Expiry & Rotation", desc: "Set TTL on keys. Auto-rotate before expiry. Critical for compliance-heavy industries.", status: "Security" },
              { label: "IP Allowlisting", desc: "Restrict each API key to specific IP ranges — standard in enterprise API platforms.", status: "Security" },
              { label: "Swagger UI", desc: "Auto-generated interactive API docs at /api-docs. Let anyone explore and test without Postman.", status: "DX" },
              { label: "Docker + CI/CD", desc: "Dockerize the app. Add GitHub Actions to run tests and deploy on push to main.", status: "DevOps" },
              { label: "Analytics Dashboard", desc: "Charts showing request volume over time, error rates, top endpoints — like Datadog for your API.", status: "Product" },
              { label: "Team & Org Support", desc: "Multiple users per team, shared key pools, admin delegation. The path to a real SaaS product.", status: "Growth" },
            ].map((item) => (
              <div key={item.label} className="flex gap-4 p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:border-violet-500/15 transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-sm text-white">{item.label}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">{item.status}</span>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Built with modern, production-grade tooling</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Next.js 16", "TypeScript", "PostgreSQL", "Prisma ORM",
              "Neon DB", "JWT (jose)", "bcrypt", "Zod", "Tailwind CSS", "REST API"
            ].map((t) => (
              <span key={t} className="px-4 py-2 rounded-lg border border-white/10 bg-white/[0.03] text-gray-400 text-sm font-mono hover:border-violet-500/30 hover:text-violet-300 transition-all">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="relative p-12 rounded-3xl border border-violet-500/20 bg-gradient-to-b from-violet-950/30 to-transparent overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 via-purple-600/5 to-indigo-600/5 pointer-events-none" />
            <h2 className="text-4xl font-bold mb-4 relative">Ready to get started?</h2>
            <p className="text-gray-400 mb-8 relative">Create your account and generate your first API key in 30 seconds.</p>
            <Link
              href="/register"
              className="inline-block px-10 py-4 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold text-white transition-all hover:scale-105 hover:shadow-xl hover:shadow-violet-500/25 relative"
            >
              Create Free Account →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10 px-8 flex justify-between items-center text-sm text-gray-600">
        <span>KeyVault — PrimeTradeAI Backend Internship Project by Koushik Varakala</span>
        <div className="flex gap-6">
          <Link href="/login" className="hover:text-gray-400 transition-colors">Login</Link>
          <Link href="/register" className="hover:text-gray-400 transition-colors">Register</Link>
          <Link href="/dashboard" className="hover:text-gray-400 transition-colors">Dashboard</Link>
        </div>
      </footer>
    </main>
  );
}
