import TopNav from './TopNav';

export default function ScreenShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-hero-grad">
      <div className="mx-auto w-full max-w-6xl px-6">
        <TopNav />
        <div className="mb-10">
          <div className="tag">XSEAT Experience</div>
          <h1 className="mt-4 text-3xl font-display md:text-5xl">{title}</h1>
          {subtitle ? <p className="mt-3 max-w-2xl text-ink/70">{subtitle}</p> : null}
        </div>
        {children}
      </div>
    </div>
  );
}
