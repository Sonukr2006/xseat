export default function LoadingSection({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="card">
      <p className="text-sm text-ink/70">{label}</p>
    </div>
  );
}
