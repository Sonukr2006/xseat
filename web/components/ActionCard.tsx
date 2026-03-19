import Link from 'next/link';

export default function ActionCard({
  title,
  body,
  href,
  cta,
  requiresAuth,
}: {
  title: string;
  body: string;
  href: string;
  cta: string;
  requiresAuth?: boolean;
}) {
  return (
    <div className="card flex flex-col justify-between gap-6">
      <div>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-display">{title}</h3>
          {requiresAuth ? (
            <span className="rounded-full bg-ink px-3 py-1 text-xs uppercase tracking-[0.2em] text-sand">
              Login required
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-sm text-ink/70">{body}</p>
      </div>
      <Link
        href={href}
        className="inline-flex w-fit items-center rounded-full bg-ocean px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sand"
      >
        {cta}
      </Link>
    </div>
  );
}
