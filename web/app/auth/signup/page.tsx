'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import ScreenShell from '../../../components/ScreenShell';
import { apiFetch } from '../../../lib/api';
import { setToken } from '../../../lib/auth';
import { setSessionClient } from '../../../lib/session';

export default function Signup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const response = await apiFetch<{ token: string }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      if (response.token) {
        setToken(response.token);
        setSessionClient();
      }
      setStatus('Account created.');
      router.push(nextPath || '/dashboard');
    } catch (err) {
      setStatus('Sign up failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenShell title="Create your XSEAT account" subtitle="Sign up with email and password.">
      <div className="grid gap-6 md:grid-cols-[1fr_0.8fr]">
        <div className="card">
          <form className="grid gap-4" onSubmit={submit}>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-ink/60">Full Name</label>
              <input
                className="mt-2 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-ink"
                placeholder="Passenger name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
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
                placeholder="Create a password"
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
              {loading ? 'Creating...' : 'Create Account'}
            </button>
            {status ? <p className="text-sm text-ink/70">{status}</p> : null}
            <p className="text-xs text-ink/60">
              Already have an account? <Link href="/auth/login" className="underline">Login</Link>
            </p>
          </form>
        </div>
        <div className="card">
          <h2 className="section-title">Why sign up?</h2>
          <p className="mt-2 text-sm text-ink/70">
            Create your passenger profile once and unlock ticket management, seat swaps, waitlist predictions, and
            real-time match notifications.
          </p>
        </div>
      </div>
    </ScreenShell>
  );
}
