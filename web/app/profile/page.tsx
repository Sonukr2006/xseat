'use client';

import { useEffect, useState } from 'react';
import ScreenShell from '../../components/ScreenShell';
import LoadingSection from '../../components/LoadingSection';
import { apiFetch } from '../../lib/api';

type Profile = {
  name: string;
  phone: string;
  age?: number;
  gender?: string;
  preferredBerth?: string;
};

type HistoryTicket = {
  _id: string;
  trainNumber: string;
  travelDate: string;
  sourceStation: string;
  destinationStation: string;
  ticketStatus: string;
};

export default function Profile() {
  const [profile, setProfile] = useState<Profile>({
    name: '',
    phone: '',
    age: undefined,
    gender: '',
    preferredBerth: '',
  });
  const [status, setStatus] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [profileData, historyData] = await Promise.all([
          apiFetch<Profile>('/auth/profile'),
          apiFetch<HistoryTicket[]>('/user/travel-history'),
        ]);
        setProfile(profileData);
        setHistory(historyData);
      } catch (err) {
        setStatus('Unable to load profile.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const update = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus(null);
    try {
      const updated = await apiFetch<Profile>('/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify(profile),
      });
      setProfile(updated);
      setStatus('Profile updated.');
    } catch (err) {
      setStatus('Update failed.');
    }
  };

  if (loading) {
    return (
      <ScreenShell title="Profile" subtitle="Manage your travel identity and preferences.">
        <LoadingSection label="Loading profile..." />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title="Profile" subtitle="Manage your travel identity and preferences.">
      <div className="grid gap-6 md:grid-cols-[1fr_0.9fr]">
        <div className="card">
          <form className="grid gap-4" onSubmit={update}>
            <input
              className="rounded-xl border border-ink/10 bg-white px-4 py-3 text-ink"
              placeholder="Name"
              value={profile.name}
              onChange={(event) => setProfile({ ...profile, name: event.target.value })}
            />
            <input
              className="rounded-xl border border-ink/10 bg-white px-4 py-3 text-ink"
              placeholder="Phone"
              value={profile.phone}
              onChange={(event) => setProfile({ ...profile, phone: event.target.value })}
              disabled
            />
            <input
              className="rounded-xl border border-ink/10 bg-white px-4 py-3 text-ink"
              placeholder="Age"
              value={profile.age ?? ''}
              onChange={(event) => setProfile({ ...profile, age: Number(event.target.value) })}
            />
            <input
              className="rounded-xl border border-ink/10 bg-white px-4 py-3 text-ink"
              placeholder="Gender"
              value={profile.gender ?? ''}
              onChange={(event) => setProfile({ ...profile, gender: event.target.value })}
            />
            <input
              className="rounded-xl border border-ink/10 bg-white px-4 py-3 text-ink"
              placeholder="Preferred Berth"
              value={profile.preferredBerth ?? ''}
              onChange={(event) => setProfile({ ...profile, preferredBerth: event.target.value })}
            />
            <button className="mt-2 rounded-full bg-teal px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-ink">
              Update Profile
            </button>
            {status ? <p className="text-sm text-ink/70">{status}</p> : null}
          </form>
        </div>
        <div className="card">
          <h2 className="section-title">Travel History</h2>
          <div className="mt-4 space-y-3 text-sm text-ink/70">
            {history.length === 0 ? <p>No past trips yet.</p> : null}
            {history.map((ticket) => (
              <div key={ticket._id} className="flex items-center justify-between">
                <span>
                  {ticket.trainNumber} {ticket.sourceStation} → {ticket.destinationStation}
                </span>
                <span className="text-xs">
                  {new Date(ticket.travelDate).toLocaleDateString()} · {ticket.ticketStatus}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
