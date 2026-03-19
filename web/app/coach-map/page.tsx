'use client';

import { useEffect, useState } from 'react';
import ScreenShell from '../../components/ScreenShell';
import SeatMap, { Seat } from '../../components/SeatMap';
import LoadingSection from '../../components/LoadingSection';
import { apiFetch } from '../../lib/api';

export default function CoachMap() {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ seats: Seat[] }>('/coach/map?coachNumber=S1&seatNumber=12')
      .then((res) => setSeats(res.seats))
      .catch(() => {
        setSeats(
          Array.from({ length: 24 }, (_, i) => ({
            number: i + 1,
            seatType: ['LB', 'MB', 'UB', 'LB', 'MB', 'UB', 'SL', 'SU'][i % 8],
            isUserSeat: i + 1 === 12,
          }))
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <ScreenShell title="Coach Map" subtitle="Visualize your coach and nearby opportunities.">
        <LoadingSection label="Loading coach map..." />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title="Coach Map" subtitle="Visualize your coach and nearby opportunities.">
      <div className="grid gap-6 md:grid-cols-[1fr_0.9fr]">
        <div className="card">
          <SeatMap seats={seats} />
        </div>
        <div className="card">
          <h2 className="section-title">Nearby Opportunities</h2>
          <ul className="mt-4 space-y-3 text-sm text-ink/70">
            <li>Seat 14 (UB) willing to swap to LB.</li>
            <li>Seat 18 (MB) prefers UB.</li>
            <li>Seat 22 (SL) available after Lucknow.</li>
          </ul>
        </div>
      </div>
    </ScreenShell>
  );
}
