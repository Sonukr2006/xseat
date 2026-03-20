'use client';

import { useEffect, useState } from 'react';
import ScreenShell from '../../components/ScreenShell';
import StatCard from '../../components/StatCard';
import ActionCard from '../../components/ActionCard';
import LoadingSection from '../../components/LoadingSection';
import { apiFetch } from '../../lib/api';

type Ticket = {
  _id: string;
  trainNumber: string;
  trainName: string;
  travelDate: string;
  sourceStation: string;
  destinationStation: string;
  coachNumber: string;
  seatNumber: string;
  ticketStatus: string;
};

type Insight = {
  type: string;
  message: string;
};

type Profile = {
  preferredBerth?: string;
};

type Match = {
  _id: string;
};

export default function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [matchesCount, setMatchesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [ticketsRes, insightRes, profileRes, matchesRes] = await Promise.all([
          apiFetch<Ticket[]>('/ticket/list'),
          apiFetch<{ insights: Insight[] }>('/assistant/insights'),
          apiFetch<Profile>('/auth/profile'),
          apiFetch<Match[]>('/exchange/matches'),
        ]);
        setTickets(ticketsRes);
        setInsights(insightRes.insights);
        setProfile(profileRes);
        setMatchesCount(matchesRes.length);
      } catch (err) {
        setInsights([{ type: 'general', message: 'Connect your account to see live insights.' }]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const nextTrip = tickets[0];

  if (loading) {
    return (
      <ScreenShell title="Home Dashboard" subtitle="Your travel intelligence for upcoming journeys.">
        <LoadingSection label="Loading your dashboard..." />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title="Home Dashboard" subtitle="Your travel intelligence for upcoming journeys.">
      <section className="grid gap-6 md:grid-cols-3">
        <StatCard label="Next Trip" value={nextTrip ? nextTrip.trainNumber : 'No active trips'} />
        <StatCard label="Seat Preference" value={profile?.preferredBerth || 'Not set'} />
        <StatCard label="Matches Waiting" value={String(matchesCount)} />
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="card">
          <h2 className="section-title">Today's Insights</h2>
          <ul className="mt-4 space-y-3 text-sm text-ink/70">
            {insights.length ? (
              insights.map((item) => <li key={item.message}>{item.message}</li>)
            ) : (
              <li>Loading insights...</li>
            )}
          </ul>
        </div>
        <div className="card">
          <h2 className="section-title">Your Active Tickets</h2>
          {nextTrip ? (
            <div className="mt-4 rounded-xl border border-ink/10 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-ink/60">
                {nextTrip.trainNumber} - {new Date(nextTrip.travelDate).toLocaleDateString()}
              </p>
              <p className="mt-2 text-lg font-display text-ocean">
                {nextTrip.sourceStation} &rarr; {nextTrip.destinationStation}
              </p>
              <p className="mt-2 text-sm text-ink/70">
                Coach {nextTrip.coachNumber} - Seat {nextTrip.seatNumber} - {nextTrip.ticketStatus}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-ink/70">No tickets yet. Add one to get started.</p>
          )}
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        <ActionCard
          title="Add New Ticket"
          body="Sync your latest journey details in seconds."
          href="/tickets/add"
          cta="Add Ticket"
        />
        <ActionCard
          title="Request Exchange"
          body="Find a better berth with smart matching."
          href="/exchange/request"
          cta="Request"
        />
        <ActionCard title="Chat Matches" body="Coordinate swaps securely in-app." href="/matches" cta="View Matches" />
      </section>
    </ScreenShell>
  );
}
