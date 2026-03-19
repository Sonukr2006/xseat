'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import TopNav from '../components/TopNav';
import ActionCard from '../components/ActionCard';
import StatCard from '../components/StatCard';
import { hasSessionClient } from '../lib/session';

export default function Home() {
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    setHasSession(hasSessionClient());
  }, []);

  return (
    <div className="min-h-screen bg-hero-grad">
      <div className="mx-auto w-full max-w-6xl px-6">
        <TopNav />
        <section className="grid gap-12 py-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <div className="tag">Seat Exchange Platform</div>
            <h1 className="mt-6 text-4xl font-display md:text-6xl">Comfort-first rail travel, made simple.</h1>
            <p className="mt-4 max-w-xl text-lg text-ink/70">
              XSEAT helps passengers manage tickets, predict confirmations, and swap berths safely with verified
              passengers.
            </p>
            <p className="mt-3 text-sm text-ink/60">Login required to access the dashboard and tools.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/auth/signup"
                className="rounded-full bg-teal px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-ink"
              >
                Create Account
              </Link>
              <Link
                href="/auth/login"
                className="rounded-full border border-ink/20 px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-ink"
              >
                Login
              </Link>
            </div>
          </div>
          <div className="card animate-floaty">
            <h2 className="section-title">Secure Passenger Hub</h2>
            <p className="mt-3 text-sm text-ink/70">
              Sign in to unlock predictions, coach maps, match tracking, and in-app chat.
            </p>
          </div>
        </section>

        {hasSession ? (
          <>
            <section className="grid gap-6 md:grid-cols-3">
              <StatCard label="Live Matches" value="+2,140" />
              <StatCard label="Confirm Rate" value="68%" />
              <StatCard label="Daily Alerts" value="12K" />
            </section>

            <section className="mt-16 grid gap-6 md:grid-cols-3">
              <ActionCard
                title="Waitlist Prediction"
                body="Check confirmation odds before you start packing."
                href="/prediction"
                cta="Predict Now"
                requiresAuth
              />
              <ActionCard
                title="Seat Exchange"
                body="Request swaps with nearby verified passengers."
                href="/exchange/request"
                cta="Request Swap"
                requiresAuth
              />
              <ActionCard
                title="Coach Map"
                body="See your coach layout and nearby opportunities."
                href="/coach-map"
                cta="View Map"
                requiresAuth
              />
            </section>

            <section className="py-16">
              <div className="card">
                <h2 className="section-title">Built for reliability</h2>
                <p className="mt-2 text-ink/70">
                  Modular services, prediction models, and real-time alerts keep XSEAT dependable during peak travel.
                </p>
                <div className="mt-6 flex flex-wrap gap-4 text-xs uppercase tracking-[0.2em] text-ink/60">
                  <span>OTP Auth</span>
                  <span>Matching Engine</span>
                  <span>Live Chat</span>
                  <span>QR Confirmations</span>
                  <span>Admin Console</span>
                </div>
              </div>
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
}
