export default function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <p className="text-sm uppercase tracking-[0.3em] text-ink/60">{label}</p>
      <p className="mt-4 text-3xl font-display text-ocean">{value}</p>
    </div>
  );
}
