'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import ScreenShell from '../../../components/ScreenShell';
import { apiFetch } from '../../../lib/api';
import { getPhone, setToken } from '../../../lib/auth';
import { setSessionClient } from '../../../lib/session';

export default function Otp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/dashboard';
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const phone = getPhone();
    if (!phone) {
      setStatus('Missing phone number. Please login again.');
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const response = await apiFetch<{ token?: string }>('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone, otp }),
      });
      if (response.token) {
        setToken(response.token);
      }
      setSessionClient();
      router.push(nextPath);
    } catch (err) {
      setStatus('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenShell title="OTP Verification" subtitle="Enter the 6-digit code sent to your phone.">
      <div className="grid gap-6 md:grid-cols-[1fr_0.9fr]">
        <div className="card">
          <form className="grid gap-4" onSubmit={submit}>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-ink/60">OTP Code</label>
              <input
                className="mt-2 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-ink"
                placeholder="123456"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-fit rounded-full bg-teal px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-ink disabled:opacity-60"
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
            {status ? <p className="text-sm text-ink/70">{status}</p> : null}
          </form>
        </div>
        <div className="card">
          <h2 className="section-title">Security First</h2>
          <p className="mt-2 text-sm text-ink/70">
            Your OTP expires in 5 minutes. We never store plain OTPs in production; swap in a SMS provider when you
            deploy.
          </p>
          <div className="mt-6 rounded-xl border border-ink/10 bg-white p-4 text-sm text-ink/70">
            Dev OTP (local): <span className="text-ocean">123456</span>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
