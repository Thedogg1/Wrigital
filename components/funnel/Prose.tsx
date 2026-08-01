import type { ReactNode } from 'react';

/** Minimal inline formatter: **bold** and *italic* only. No markdown library. */
export function formatInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(text.slice(last, match.index));
    }
    const token = match[0];
    if (token.startsWith('**')) {
      nodes.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else {
      nodes.push(<em key={key++}>{token.slice(1, -1)}</em>);
    }
    last = match.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Prose({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mt-5 space-y-5 text-[1.0625rem] leading-[1.7] [&_strong]:font-semibold [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-display-lg [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-display-md ${className}`}
    >
      {children}
    </div>
  );
}

export function ProseP({ text }: { text: string }) {
  return <p>{formatInline(text)}</p>;
}
