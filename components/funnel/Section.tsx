export function Section({
  label,
  tone = 'paper',
  id,
  children,
}: {
  label?: string;
  tone?: 'paper' | 'ink';
  id?: string;
  children: React.ReactNode;
}) {
  const dark = tone === 'ink';
  return (
    <section
      id={id}
      className={`border-t border-rule ${dark ? 'bg-ink text-paper' : ''}`}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-5 py-20 lg:grid-cols-[140px_minmax(0,1fr)] lg:py-28">
        <div aria-hidden="true" className="hidden lg:block">
          {label && (
            <p
              className={`sticky top-8 font-mono text-[0.6875rem] uppercase tracking-[0.12em] ${dark ? 'text-paper/60' : 'text-ink-soft'}`}
            >
              {label}
            </p>
          )}
        </div>
        <div className="max-w-[68ch]">{children}</div>
      </div>
    </section>
  );
}
