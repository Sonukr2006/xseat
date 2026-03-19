'use client';

import { useRouter } from 'next/navigation';
import { apiFetch } from '../lib/api';
import { clearPhone, clearToken } from '../lib/auth';
import { clearSessionClient } from '../lib/session';

export default function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const ok = window.confirm('Are you sure you want to logout?');
    if (!ok) return;
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch (err) {
      // Ignore network errors on logout
    } finally {
      clearToken();
      clearPhone();
      clearSessionClient();
      router.push('/auth/login');
    }
  };

  return (
    <button
      onClick={logout}
      className="rounded-full bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sand"
    >
      Logout
    </button>
  );
}
