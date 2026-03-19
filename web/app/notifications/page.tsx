'use client';

import { useEffect, useState } from 'react';
import ScreenShell from '../../components/ScreenShell';
import LoadingSection from '../../components/LoadingSection';
import { apiFetch } from '../../lib/api';

type Note = { _id: string; title: string; body: string };

export default function Notifications() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Note[]>('/notifications')
      .then(setNotes)
      .catch(() => setNotes([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <ScreenShell title="Notifications" subtitle="Stay updated on matches and travel updates.">
        <LoadingSection label="Loading notifications..." />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title="Notifications" subtitle="Stay updated on matches and travel updates.">
      <div className="grid gap-4">
        {notes.length === 0 ? <p className="text-sm text-ink/70">No notifications yet.</p> : null}
        {notes.map((note) => (
          <div key={note._id} className="card">
            <h3 className="text-lg font-display">{note.title}</h3>
            <p className="mt-2 text-sm text-ink/70">{note.body}</p>
          </div>
        ))}
      </div>
    </ScreenShell>
  );
}
