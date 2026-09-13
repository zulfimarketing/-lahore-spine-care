"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MagneticButton from "@/components/MagneticButton";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Invalid username or password.");
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center pt-24 pb-16">
      <div className="w-full max-w-sm">
        <p className="eyebrow-line mb-4">Reception dashboard</p>
        <h1 className="font-serif text-3xl text-ink-primary mb-8">Sign in</h1>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label className="text-sm text-ink-secondary block mb-2">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-card border border-gold-line bg-transparent px-4 py-3 text-ink-primary focus:border-gold outline-none"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="text-sm text-ink-secondary block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-card border border-gold-line bg-transparent px-4 py-3 text-ink-primary focus:border-gold outline-none"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm text-error">{error}</p>}
          <div className="mt-2">
            <MagneticButton type="submit" variant="primary" className={loading ? "opacity-60 pointer-events-none" : ""}>
              {loading ? "Signing in…" : "Sign in"}
            </MagneticButton>
          </div>
        </form>
        <p className="text-xs text-ink-muted mt-8">
          Default credentials are set in <code>.env.local</code> — change them before going live.
        </p>
      </div>
    </section>
  );
}
