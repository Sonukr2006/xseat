'use client';

import { useEffect, useState } from 'react';
import ScreenShell from '../../components/ScreenShell';
import LoadingSection from '../../components/LoadingSection';
import { apiFetch } from '../../lib/api';

type Insight = { message: string };

export default function Assistant() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ insights: Insight[] }>('/assistant/insights')
      .then((res) => setInsights(res.insights))
      .catch(() => setInsights([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <ScreenShell title="Smart Travel Assistant" subtitle="Personalized insights for a smoother journey.">
        <LoadingSection label="Loading insights..." />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title="Smart Travel Assistant" subtitle="Personalized insights for a smoother journey.">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card">
          <h2 className="section-title">Recommendations</h2>
          <ul className="mt-4 space-y-3 text-sm text-ink/70">
            {insights.length ? insights.map((item) => <li key={item.message}>{item.message}</li>) : <li>No insights yet.</li>}
          </ul>
        </div>
        <div className="card">
          <h2 className="section-title">Journey Reminders</h2>
          <p className="mt-2 text-sm text-ink/70">We will notify you 2 hours before boarding and after each match update.</p>
          <div className="mt-6 rounded-xl border border-ink/10 bg-white p-4 text-sm text-ink/70">
            Next reminder: 21 Mar 2026 - 5:30 PM
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
