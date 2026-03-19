'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ScreenShell from '../../components/ScreenShell';
import MatchCard from '../../components/MatchCard';
import LoadingSection from '../../components/LoadingSection';
import { apiFetch } from '../../lib/api';

type Match = {
  _id: string;
  trainNumber: string;
  coachDistance: number;
  status: string;
  qrImage?: string;
};

export default function Matches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMatches, setLoadingMatches] = useState(true);

  useEffect(() => {
    apiFetch<Match[]>('/exchange/matches')
      .then(setMatches)
      .catch(() => setMatches([]))
      .finally(() => setLoadingMatches(false));
  }, []);

  const respond = async (matchId: string, confirm: boolean) => {
    setLoading(true);
    try {
      const updated = await apiFetch<Match>('/exchange/confirm', {
        method: 'POST',
        body: JSON.stringify({ matchId, confirm }),
      });
      setMatches((prev) => prev.map((m) => (m._id === updated._id ? updated : m)));
    } finally {
      setLoading(false);
    }
  };

  if (loadingMatches) {
    return (
      <ScreenShell title="Match List" subtitle="Coordinate with passengers that match your request.">
        <LoadingSection label="Loading matches..." />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title="Match List" subtitle="Coordinate with passengers that match your request.">
      <div className="grid gap-6">
        {matches.length === 0 ? <p className="text-sm text-ink/70">No matches yet.</p> : null}
        {matches.map((match) => (
          <div key={match._id} className="grid gap-4">
            <MatchCard
              name={`Match ${match.trainNumber}`}
              have={`Coach distance ${match.coachDistance}`}
              want={match.status}
              coach={match.trainNumber}
            />
            <div className="flex flex-wrap gap-3">
              <button
                disabled={loading}
                onClick={() => respond(match._id, true)}
                className="rounded-full bg-teal px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink disabled:opacity-60"
              >
                Confirm Exchange
              </button>
              <button
                disabled={loading}
                onClick={() => respond(match._id, false)}
                className="rounded-full border border-ink/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
            {match.qrImage ? (
              <div className="card">
                <h3 className="text-sm uppercase tracking-[0.2em] text-ink/60">Exchange QR</h3>
                <img src={match.qrImage} alt="QR confirmation" className="mt-4 w-40" />
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        {matches[0] ? (
          <Link
            href={`/chat/${matches[0]._id}`}
            className="rounded-full bg-teal px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-ink"
          >
            Open Chat
          </Link>
        ) : (
          <button
            disabled
            className="rounded-full bg-teal/50 px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-ink"
          >
            Open Chat
          </button>
        )}
        <Link
          href="/coach-map"
          className="rounded-full border border-ink/20 px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em]"
        >
          View Coach Map
        </Link>
        {!matches[0] ? (
          <p className="text-sm text-ink/70">
            Chat will unlock once a match is found. Create a request to get matched.
          </p>
        ) : null}
      </div>
    </ScreenShell>
  );
}
