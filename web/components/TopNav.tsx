'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import LogoutButton from './LogoutButton';
import { fetchSessionProfile, hasSessionClient } from '../lib/session';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/tickets', label: 'Tickets' },
  { href: '/prediction', label: 'Prediction' },
  { href: '/matches', label: 'Matches' },
  { href: '/assistant', label: 'Assistant' },
];

export default function TopNav() {
  const [hasSession, setHasSession] = useState(false);
  const [initials, setInitials] = useState('P');

  useEffect(() => {
    let active = true;
    const init = async () => {
      const localSession = hasSessionClient();
      if (localSession) {
        setHasSession(true);
      }
      const profile = await fetchSessionProfile();
      if (!active) return;
      if (profile) {
        setHasSession(true);
        const name = (profile.name || 'Passenger').trim();
        const parts = name.split(/\s+/).filter(Boolean);
        const initialsValue =
          parts.length >= 2
            ? `${parts[0][0]}${parts[1][0]}`
            : parts.length === 1
            ? `${parts[0][0]}`
            : 'P';
        setInitials(initialsValue.toUpperCase());
      } else if (!localSession) {
        setHasSession(false);
      }
    };
    init();
    return () => {
      active = false;
    };
  }, []);
  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 py-6">
      <Link href="/" className="flex items-center gap-3 font-display text-xl">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-peach text-ink">XS</span>
        XSEAT
      </Link>
      <div className="flex flex-wrap items-center gap-4 text-sm text-ink/80">
        {hasSession
          ? navItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-ink">
                {item.label}
              </Link>
            ))
          : null}
        {hasSession ? (
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-peach text-sm font-semibold text-ink"
              aria-label="Profile"
            >
              {initials}
            </Link>
            <LogoutButton />
          </div>
        ) : (
          <>
            <Link
              href="/auth/login"
              className="rounded-full border border-ink/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-full bg-teal px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
