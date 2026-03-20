'use client';

import { useState } from 'react';
import ScreenShell from '../../components/ScreenShell';
import { apiFetch } from '../../lib/api';

type PredictionResult = {
  probability: number;
  predictedStatus?: string;
  predicted_status?: string;
  model?: string;
  reason?: string;
};

export default function Prediction() {
  const [form, setForm] = useState({ trainNumber: '', travelDate: '', currentWaitlist: '' });
  const [result, setResult] = useState<PredictionResult | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams(form).toString();
    const response = await apiFetch<PredictionResult>(`/prediction/waitlist?${params}`);
    setResult(response);
  };

  return (
    <ScreenShell title="Waitlist Prediction" subtitle="Estimate confirmation probability instantly.">
      <div className="grid gap-6 md:grid-cols-[1fr_0.9fr]">
        <div className="card">
          <form className="grid gap-4" onSubmit={submit}>
            <input
              className="rounded-xl border border-ink/10 bg-white px-4 py-3 text-ink"
              placeholder="Train Number"
              value={form.trainNumber}
              onChange={(event) => setForm({ ...form, trainNumber: event.target.value })}
              required
            />
            <input
              className="rounded-xl border border-ink/10 bg-white px-4 py-3 text-ink"
              placeholder="Travel Date (YYYY-MM-DD)"
              value={form.travelDate}
              onChange={(event) => setForm({ ...form, travelDate: event.target.value })}
              required
            />
            <input
              className="rounded-xl border border-ink/10 bg-white px-4 py-3 text-ink"
              placeholder="Current Waitlist"
              value={form.currentWaitlist}
              onChange={(event) => setForm({ ...form, currentWaitlist: event.target.value })}
              required
            />
            <button className="mt-2 rounded-full bg-teal px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-ink">
              Predict
            </button>
          </form>
        </div>
        <div className="card">
          <h2 className="section-title">Prediction Output</h2>
          <div className="mt-4 rounded-xl border border-ink/10 bg-white p-4">
            {result ? (
              <>
                <p className="text-sm text-ink/70">
                  WL{form.currentWaitlist} &rarr; {Math.round((result.probability || 0) * 100)}% chance confirmation
                </p>
                <p className="mt-2 text-sm text-ink/70">
                  Predicted final status: {result.predictedStatus || result.predicted_status}
                </p>
                {result.reason ? <p className="mt-2 text-sm text-ink/70">{result.reason}</p> : null}
              </>
            ) : (
              <p className="text-sm text-ink/70">Run a prediction to see results.</p>
            )}
          </div>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-ink/60">
            Model: Random Forest + Logistic Regression
          </p>
        </div>
      </div>
    </ScreenShell>
  );
}
