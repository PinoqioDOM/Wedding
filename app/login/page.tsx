"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setErr(error.message);
    else router.push("/admin");
  }

  return (
    <section className="mx-auto max-w-md px-6 py-20">
      <div className="card p-8">
        <h1 className="font-display text-3xl text-center">Host sign-in</h1>
        <p className="text-center text-ink-700/60 mt-2 text-sm">For Amelia, Julian &amp; family only.</p>
        <form onSubmit={handle} className="mt-8 space-y-3">
          <input className="input" type="email" placeholder="Email"
                 value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="input" type="password" placeholder="Password"
                 value={password} onChange={(e) => setPassword(e.target.value)} required />
          {err && <p className="text-sm text-blush-500">{err}</p>}
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </section>
  );
}
