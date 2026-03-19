'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import ScreenShell from '../../../components/ScreenShell';
import { apiFetch } from '../../../lib/api';
import { setToken } from '../../../lib/auth';
import { setSessionClient } from '../../../lib/session';

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const response = await apiFetch<{ token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (response.token) {
        setToken(response.token);
        setSessionClient();
      }
      setStatus('Login successful.');
      router.push(nextPath || '/dashboard');
    } catch (err) {
      setStatus('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenShell title="Login" subtitle="Use your email and password to continue.">
      <div className="grid gap-6 md:grid-cols-[1fr_0.8fr]">
        <div className="card">
          <form className="grid gap-4" onSubmit={submit}>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-ink/60">Email</label>
              <input
                className="mt-2 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-ink"
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-ink/60">Password</label>
              <input
                className="mt-2 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-ink"
                placeholder="Your password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-fit rounded-full bg-teal px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-ink disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
            {status ? <p className="text-sm text-ink/70">{status}</p> : null}
            <p className="text-xs text-ink/60">
              New here? <Link href="/auth/signup" className="underline">Create an account</Link>
            </p>
          </form>
        </div>
        <div className="card">
          <h2 className="section-title">Welcome back</h2>
          <p className="mt-2 text-sm text-ink/70">
            Log in to manage tickets, track predictions, and unlock smarter seat exchanges.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-ink/70">
            <li>Secure JWT session for API access</li>
            <li>Realtime updates across your trips</li>
            <li>One account for every journey</li>
          </ul>
        </div>
      </div>
    </ScreenShell>
  );
}
