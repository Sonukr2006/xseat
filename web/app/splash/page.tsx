import Link from 'next/link';

export default function Splash() {
  return (
    <div className="min-h-screen bg-sand text-ink flex flex-col items-center justify-center px-6">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-peach text-ink text-2xl font-display">
          XS
        </div>
        <h1 className="text-4xl font-display">XSEAT</h1>
        <p className="mt-2 text-ink/70">Your intelligent seat exchange companion.</p>
        <Link
          href="/auth/login"
          className="mt-6 inline-flex rounded-full bg-dawn px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink"
        >
          Enter App
        </Link>
      </div>
    </div>
  );
}
