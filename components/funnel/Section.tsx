export function Section({
  tone = 'paper',
  id,
  children,
}: {
  /** @deprecated Section markers removed; accepted so call sites need not change. */
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
      <div className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
        <div className="max-w-[68ch]">{children}</div>
      </div>
    </section>
  );
}
