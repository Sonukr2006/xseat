'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ScreenShell from '../../../components/ScreenShell';
import ChatBubble from '../../../components/ChatBubble';
import LoadingSection from '../../../components/LoadingSection';
import { apiFetch } from '../../../lib/api';

type Message = {
  _id: string;
  senderId: string;
  message: string;
};

export default function Chat() {
  const params = useParams<{ matchId: string }>();
  const matchId = params?.matchId;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!matchId) return;
    apiFetch<Message[]>(`/chat/${matchId}`)
      .then(setMessages)
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, [matchId]);

  const send = async () => {
    if (!matchId || !input.trim()) return;
    const newMessage = await apiFetch<Message>(`/chat/${matchId}`, {
      method: 'POST',
      body: JSON.stringify({ message: input }),
    });
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
  };

  if (loading) {
    return (
      <ScreenShell title="Chat Screen" subtitle="Securely coordinate your seat exchange.">
        <LoadingSection label="Loading chat..." />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title="Chat Screen" subtitle="Securely coordinate your seat exchange.">
      <div className="card space-y-4">
        {messages.length === 0 ? <p className="text-sm text-ink/70">No messages yet.</p> : null}
        {messages.map((msg) => (
          <ChatBubble key={msg._id} name={msg.senderId.slice(-4)} message={msg.message} />
        ))}
      </div>
      <div className="mt-6 card">
        <div className="flex gap-3">
          <input
            className="flex-1 rounded-xl border border-ink/10 bg-white px-4 py-3 text-ink"
            placeholder="Type your message"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <button
            onClick={send}
            className="rounded-full bg-teal px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-ink"
          >
            Send
          </button>
        </div>
      </div>
    </ScreenShell>
  );
}
