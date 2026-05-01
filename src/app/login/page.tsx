"use client";

import { useState } from "react";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) {
      window.location.href = "/dashboard";
    } else {
      const data = await res.json();
      setError(data.error || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-[#080810] flex font-sans">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-violet-700/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-700/15 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,#080810_100%)]" />
        </div>

        <Link href="/" className="relative flex items-center gap-2.5 w-fit">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-violet-500/30">K</div>
          <span className="text-white font-semibold text-lg">KeyVault</span>
        </Link>

        <div className="relative space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              The developer platform<br />for secure API access
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Generate keys, enforce rate limits, and monitor every request — all from one clean dashboard.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: "🔑", title: "Cryptographic API Keys", desc: "256-bit entropy, SHA-256 hashed storage" },
              { icon: "🚦", title: "Rate Limiting", desc: "Sliding window — 100 req/min per key" },
              { icon: "🛡️", title: "JWT Authentication", desc: "HttpOnly cookies — XSS safe by design" },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.03] backdrop-blur-sm">
                <span className="text-xl">{f.icon}</span>
                <div>
                  <div className="text-sm font-medium text-white">{f.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-gray-700">
          PrimeTradeAI Backend Internship Assignment · Built by Koushik Varakala
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <Link href="/" className="flex lg:hidden items-center gap-2.5 justify-center mb-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center font-bold text-xs">K</div>
            <span className="text-white font-semibold">KeyVault</span>
          </Link>

          <div>
            <h1 className="text-3xl font-bold text-white">Sign in</h1>
            <p className="text-gray-500 mt-1 text-sm">
              New here?{" "}
              <Link href="/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                Create a free account
              </Link>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/8 border border-red-500/20">
                <span className="text-red-400 text-lg flex-shrink-0">⚠</span>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 hover:border-white/20 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 hover:border-white/20 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-sm text-white transition-all hover:shadow-xl hover:shadow-violet-500/20 hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-white/5">
            <p className="text-center text-xs text-gray-600">
              <Link href="/" className="hover:text-gray-400 transition-colors">← Back to home</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
