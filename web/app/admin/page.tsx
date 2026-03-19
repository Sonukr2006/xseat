'use client';

import { useEffect, useState } from 'react';
import ScreenShell from '../../components/ScreenShell';
import LoadingSection from '../../components/LoadingSection';
import { apiFetch } from '../../lib/api';

type Analytics = {
  users: number;
  tickets: number;
  exchanges: number;
  matches: number;
  confirmedMatches?: number;
  notifications?: number;
};

type User = { _id: string; name: string; phone: string; createdAt: string };
type Ticket = {
  _id: string;
  trainNumber: string;
  travelDate: string;
  coachNumber: string;
  seatNumber: string;
  ticketStatus: string;
  userId?: { name?: string; phone?: string };
};
type Exchange = { _id: string; trainNumber: string; status: string; createdAt: string };
type Match = { _id: string; trainNumber: string; status: string; createdAt: string };
type Note = { _id: string; title: string; body: string; userId?: { name?: string; phone?: string } };

type Dashboard = {
  latestUsers: User[];
  latestTickets: Ticket[];
  latestRequests: Exchange[];
  latestMatches: Match[];
  latestNotifications: Note[];
};

export default function Admin() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [a, d, t, n] = await Promise.all([
          apiFetch<Analytics>('/admin/analytics'),
          apiFetch<Dashboard>('/admin/dashboard'),
          apiFetch<Ticket[]>('/admin/tickets'),
          apiFetch<Note[]>('/admin/notifications'),
        ]);
        setAnalytics(a);
        setDashboard(d);
        setTickets(t);
        setNotes(n);
      } catch (err) {
        setAnalytics(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <ScreenShell title="Admin Panel" subtitle="Monitor system health, users, and exchange activity.">
        <LoadingSection label="Loading admin data..." />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title="Admin Panel" subtitle="Monitor system health, users, and exchange activity.">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="card">
          <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Users</p>
          <p className="mt-4 text-3xl font-display text-ocean">{analytics?.users ?? '-'}</p>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Tickets</p>
          <p className="mt-4 text-3xl font-display text-ocean">{analytics?.tickets ?? '-'}</p>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Exchanges</p>
          <p className="mt-4 text-3xl font-display text-ocean">{analytics?.exchanges ?? '-'}</p>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Matches</p>
          <p className="mt-4 text-3xl font-display text-ocean">{analytics?.matches ?? '-'}</p>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Confirmed</p>
          <p className="mt-4 text-3xl font-display text-ocean">{analytics?.confirmedMatches ?? '-'}</p>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Notifications</p>
          <p className="mt-4 text-3xl font-display text-ocean">{analytics?.notifications ?? '-'}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="card">
          <h2 className="section-title">Latest Users</h2>
          <div className="mt-4 space-y-3 text-sm text-ink/70">
            {(dashboard?.latestUsers ?? []).slice(0, 5).map((user) => (
              <div key={user._id} className="flex items-center justify-between">
                <span>{user.name || 'Passenger'}</span>
                <span className="text-xs">{user.phone}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h2 className="section-title">Latest Tickets</h2>
          <div className="mt-4 space-y-3 text-sm text-ink/70">
            {tickets.slice(0, 5).map((ticket) => (
              <div key={ticket._id} className="flex items-center justify-between">
                <span>
                  {ticket.trainNumber} · {ticket.coachNumber}/{ticket.seatNumber}
                </span>
                <span className="text-xs">{ticket.ticketStatus}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="card">
          <h2 className="section-title">Recent Exchanges</h2>
          <div className="mt-4 space-y-3 text-sm text-ink/70">
            {(dashboard?.latestRequests ?? []).slice(0, 5).map((exchange) => (
              <div key={exchange._id} className="flex items-center justify-between">
                <span>{exchange.trainNumber}</span>
                <span className="text-xs">{exchange.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h2 className="section-title">Recent Notifications</h2>
          <div className="mt-4 space-y-3 text-sm text-ink/70">
            {notes.slice(0, 5).map((note) => (
              <div key={note._id} className="flex items-center justify-between">
                <span>{note.title}</span>
                <span className="text-xs">{note.userId?.phone ?? ''}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 card">
        <h2 className="section-title">Latest Matches</h2>
        <div className="mt-4 space-y-3 text-sm text-ink/70">
          {(dashboard?.latestMatches ?? []).slice(0, 6).map((match) => (
            <div key={match._id} className="flex items-center justify-between">
              <span>{match.trainNumber}</span>
              <span className="text-xs">{match.status}</span>
            </div>
          ))}
        </div>
      </div>
    </ScreenShell>
  );
}
