'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ScreenShell from '../../../components/ScreenShell';
import LoadingSection from '../../../components/LoadingSection';
import { apiFetch } from '../../../lib/api';

type Ticket = {
  _id: string;
  trainNumber: string;
  trainName: string;
  travelDate: string;
  sourceStation: string;
  destinationStation: string;
  coachNumber: string;
  seatNumber: string;
  seatType: string;
};

export default function ExchangeRequest() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    ticketId: '',
    haveSeatType: '',
    wantSeatType: '',
    coachPreference: '',
    from: '',
    to: '',
  });
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Ticket[]>('/ticket/list')
      .then((data) => setTickets(data))
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  }, []);

  const handleTicketSelect = (ticketId: string) => {
    const selected = tickets.find((ticket) => ticket._id === ticketId);
    setForm((prev) => ({
      ...prev,
      ticketId,
      haveSeatType: selected?.seatType || prev.haveSeatType,
      coachPreference: selected?.coachNumber || prev.coachPreference,
      from: selected?.sourceStation || prev.from,
      to: selected?.destinationStation || prev.to,
    }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus(null);
    try {
      await apiFetch('/exchange/request', {
        method: 'POST',
        body: JSON.stringify({
          ticketId: form.ticketId,
          haveSeatType: form.haveSeatType,
          wantSeatType: form.wantSeatType,
          coachPreference: form.coachPreference,
          routeSegment: { from: form.from, to: form.to },
        }),
      });
      setStatus('Exchange request submitted.');
    } catch (err) {
      setStatus('Failed to submit request.');
    }
  };

  if (loading) {
    return (
      <ScreenShell title="Seat Exchange Request" subtitle="Find a better berth with smart passenger matching.">
        <LoadingSection label="Loading tickets..." />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title="Seat Exchange Request" subtitle="Find a better berth with smart passenger matching.">
      <div className="grid gap-6 md:grid-cols-[1fr_0.8fr]">
        <div className="card">
          <form className="grid gap-4" onSubmit={submit}>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-ink/60">Select Ticket</label>
              <select
                className="mt-2 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-ink"
                value={form.ticketId}
                onChange={(event) => handleTicketSelect(event.target.value)}
                required
              >
                <option value="">Choose a ticket</option>
                {tickets.map((ticket) => (
                  <option key={ticket._id} value={ticket._id}>
                    {ticket.trainNumber} {ticket.sourceStation} - {ticket.destinationStation} ({ticket.coachNumber} {ticket.seatNumber})
                  </option>
                ))}
              </select>
              {tickets.length === 0 ? (
                <p className="mt-2 text-xs text-ink/60">
                  No tickets found. <Link href="/tickets/add" className="underline">Add a ticket</Link>
                </p>
              ) : null}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="rounded-xl border border-ink/10 bg-white px-4 py-3 text-ink"
                placeholder="Have Seat Type"
                value={form.haveSeatType}
                onChange={(event) => setForm({ ...form, haveSeatType: event.target.value })}
                required
              />
              <input
                className="rounded-xl border border-ink/10 bg-white px-4 py-3 text-ink"
                placeholder="Want Seat Type"
                value={form.wantSeatType}
                onChange={(event) => setForm({ ...form, wantSeatType: event.target.value })}
                required
              />
            </div>
            <input
              className="rounded-xl border border-ink/10 bg-white px-4 py-3 text-ink"
              placeholder="Coach Preference"
              value={form.coachPreference}
              onChange={(event) => setForm({ ...form, coachPreference: event.target.value })}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="rounded-xl border border-ink/10 bg-white px-4 py-3 text-ink"
                placeholder="Route From"
                value={form.from}
                onChange={(event) => setForm({ ...form, from: event.target.value })}
                required
              />
              <input
                className="rounded-xl border border-ink/10 bg-white px-4 py-3 text-ink"
                placeholder="Route To"
                value={form.to}
                onChange={(event) => setForm({ ...form, to: event.target.value })}
                required
              />
            </div>
            <button className="mt-2 rounded-full bg-teal px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-ink">
              Submit Request
            </button>
            {status ? <p className="text-sm text-ink/70">{status}</p> : null}
          </form>
        </div>
        <div className="card">
          <h2 className="section-title">Matching Priorities</h2>
          <ul className="mt-4 space-y-3 text-sm text-ink/70">
            <li>Same coach or adjacent coaches are prioritized.</li>
            <li>Route overlap ensures both passengers are on board.</li>
            <li>Seat type compatibility required for auto-match.</li>
          </ul>
        </div>
      </div>
    </ScreenShell>
  );
}
