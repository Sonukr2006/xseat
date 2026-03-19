export default function MatchCard({ name, have, want, coach }: { name: string; have: string; want: string; coach: string }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-ink/60">Matched Passenger</p>
          <p className="text-lg font-display">{name}</p>
        </div>
        <span className="tag">{coach}</span>
      </div>
      <div className="mt-4 flex items-center gap-3 text-sm text-ink/70">
        <span className="rounded-full bg-white px-3 py-1">Have: {have}</span>
        <span className="rounded-full bg-white px-3 py-1">Want: {want}</span>
      </div>
    </div>
  );
}
