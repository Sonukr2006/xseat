export default function Loading() {
  return (
    <div className="min-h-screen bg-sand text-ink flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-teal border-t-transparent" />
        <p className="font-display text-xl">Loading XSEAT experience...</p>
      </div>
    </div>
  );
}
