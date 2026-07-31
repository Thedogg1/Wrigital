export function SourceMark({
  href,
  n,
  children,
}: {
  href: string;
  n: number;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group text-ink underline decoration-source decoration-dotted underline-offset-[5px] transition-[text-decoration-style] duration-150 hover:decoration-solid focus-visible:decoration-solid"
    >
      {children}
      <sup className="ml-0.5 font-mono text-[0.625rem] text-source">{n}</sup>
      <span className="sr-only"> (opens the published source in a new tab)</span>
    </a>
  );
}
