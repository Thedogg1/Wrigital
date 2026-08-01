'use client';

import { useEffect, useState } from 'react';

const LINES = [
  'Reading your published pages',
  'Finding the figures on those pages',
  'Comparing each figure with the current published value',
] as const;

export function CheckProgress() {
  const [visible, setVisible] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timers = LINES.map((_, i) =>
      window.setTimeout(() => setVisible(i + 1), i * 120),
    );
    const tick = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => {
      timers.forEach(clearTimeout);
      clearInterval(tick);
    };
  }, []);

  return (
    <div
      className="mt-6 flex items-start justify-between gap-4"
      aria-live="polite"
    >
      <ul className="space-y-2 text-sm">
        {LINES.map((line, i) => {
          const shown = i < visible;
          const complete = i < visible;
          return (
            <li
              key={line}
              className={`flex items-center gap-2 transition-opacity duration-[120ms] ${shown ? 'opacity-100' : 'opacity-0'}`}
            >
              <span
                className={`inline-block h-3 w-3 border border-rule ${complete ? 'bg-ink' : 'bg-transparent'}`}
                aria-hidden="true"
              />
              {line}
            </li>
          );
        })}
      </ul>
      <p className="shrink-0 text-sm text-ink-soft">{elapsed}s</p>
    </div>
  );
}
