export default function ChatBubble({ name, message, mine }: { name: string; message: string; mine?: boolean }) {
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-sm rounded-2xl px-4 py-3 text-sm ${mine ? 'bg-teal text-ink' : 'bg-white text-ink'}`}>
        <p className="text-xs uppercase tracking-[0.2em] opacity-70">{name}</p>
        <p className="mt-1">{message}</p>
      </div>
    </div>
  );
}
