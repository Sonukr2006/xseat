'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ScreenShell from '../../components/ScreenShell';
import LoadingSection from '../../components/LoadingSection';
import { apiFetch } from '../../lib/api';

type Ticket = {
  _id: string;
  trainNumber: string;
  travelDate: string;
  sourceStation: string;
  destinationStation: string;
  coachNumber: string;
  seatNumber: string;
  ticketStatus: string;
};

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Ticket[]>('/ticket/list')
      .then(setTickets)
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  }, []);

  const deleteTicket = async (id: string) => {
    const ok = window.confirm('Delete this ticket? This cannot be undone.');
    if (!ok) return;
    await apiFetch(`/ticket/${id}`, { method: 'DELETE' });
    setTickets((prev) => prev.filter((ticket) => ticket._id !== id));
  };

  if (loading) {
    return (
      <ScreenShell title="Ticket Dashboard" subtitle="Manage all your PNRs and coach details in one place.">
        <LoadingSection label="Loading tickets..." />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title="Ticket Dashboard" subtitle="Manage all your PNRs and coach details in one place.">
      <div className="grid gap-6">
        {tickets.length === 0 ? <p className="text-sm text-ink/70">No tickets yet.</p> : null}
        {tickets.map((ticket) => (
          <div key={ticket._id} className="card flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-ink/60">
                {ticket.trainNumber} - {new Date(ticket.travelDate).toLocaleDateString()}
              </p>
              <p className="mt-2 text-lg font-display text-ocean">
                {ticket.sourceStation} -> {ticket.destinationStation}
              </p>
              <p className="mt-2 text-sm text-ink/70">
                Coach {ticket.coachNumber} - Seat {ticket.seatNumber} - {ticket.ticketStatus}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/tickets/add"
                className="rounded-full border border-ink/10 px-4 py-2 text-xs uppercase tracking-[0.2em]"
              >
                Edit
              </Link>
              <button
                className="rounded-full bg-ember px-4 py-2 text-xs uppercase tracking-[0.2em] text-ink"
                onClick={() => deleteTicket(ticket._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        <Link
          href="/prediction"
          className="w-fit rounded-full bg-teal px-4 py-2 text-xs uppercase tracking-[0.2em] text-ink"
        >
          Predict WL
        </Link>
      </div>
    </ScreenShell>
  );
}
