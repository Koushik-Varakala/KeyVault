"use client";

import { useState } from "react";
import Link from "next/link";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => { window.location.href = "/login"; }, 2500);
    } else {
      const data = await res.json();
      setError(data.error || "Registration failed. Please try again.");
    }
  };

  const strength = password.length === 0 ? 0 : password.length < 8 ? 1 : password.length < 12 ? 2 : 3;
  const strengthLabel = ["", "Weak", "Good", "Strong"];
  const strengthColor = ["", "bg-red-500", "bg-yellow-400", "bg-emerald-500"];

  return (
    <div className="min-h-screen bg-[#080810] flex font-sans">
      {/* Left panel — visual */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-indigo-700/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-700/15 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,#080810_100%)]" />
        </div>

        <Link href="/" className="relative flex items-center gap-2.5 w-fit">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-violet-500/30">K</div>
          <span className="text-white font-semibold text-lg">KeyVault</span>
        </Link>

        <div className="relative space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              Free forever · No credit card
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              Your API keys,<br />your rules.
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Join KeyVault and get instant access to cryptographic API key generation, real-time rate limiting, and usage analytics.
            </p>
          </div>

          {/* Feature checklist */}
          <div className="space-y-3">
            {[
              "Generate unlimited API keys",
              "Rate limiting built-in (100 req/min)",
              "Full request logging & analytics",
              "Role-based admin access control",
              "Notes CRUD to demo full API patterns",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3 text-sm text-gray-400">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400 text-xs">✓</span>
                {f}
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

          {success ? (
            <div className="text-center space-y-4 py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-3xl mx-auto">🎉</div>
              <h2 className="text-2xl font-bold text-white">You&apos;re in!</h2>
              <p className="text-gray-400 text-sm">Account created successfully. Redirecting to sign in...</p>
              <div className="w-32 h-0.5 bg-emerald-500/20 mx-auto rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full animate-[progress_2.5s_linear_forwards]" />
              </div>
            </div>
          ) : (
            <>
              <div>
                <h1 className="text-3xl font-bold text-white">Create account</h1>
                <p className="text-gray-500 mt-1 text-sm">
                  Already have one?{" "}
                  <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-5">
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
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="Min. 8 characters"
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 hover:border-white/20 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 transition-all"
                  />
                  {/* Password strength indicator */}
                  {password.length > 0 && (
                    <div className="pt-1 space-y-1.5">
                      <div className="flex gap-1">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`flex-1 h-1 rounded-full transition-all ${i <= strength ? strengthColor[strength] : "bg-white/10"}`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs ${strength === 1 ? "text-red-400" : strength === 2 ? "text-yellow-400" : "text-emerald-400"}`}>
                        {strengthLabel[strength]} password
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-sm text-white transition-all hover:shadow-xl hover:shadow-violet-500/20 hover:-translate-y-0.5 active:translate-y-0"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    "Create Account →"
                  )}
                </button>

                <p className="text-center text-xs text-gray-600">
                  By signing up, you agree that this is a demo project for internship purposes.
                </p>
              </form>
            </>
          )}

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
