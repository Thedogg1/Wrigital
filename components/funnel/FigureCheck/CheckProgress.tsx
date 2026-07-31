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
      <ul className="space-y-2 font-mono text-[0.8125rem]">
        {LINES.map((line, i) => {
          const shown = i < visible;
          const done = i < visible - 1 || (i === visible - 1 && visible === LINES.length);
          return (
            <li
              key={line}
              className={`flex items-center gap-2 transition-opacity duration-150 ${shown ? 'opacity-100' : 'opacity-0'}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <span
                className={`inline-block h-3 w-3 rounded-none border border-rule ${done ? 'bg-ink' : ''}`}
                aria-hidden="true"
              />
              {line}
            </li>
          );
        })}
      </ul>
      <p className="shrink-0 font-mono text-[0.8125rem] text-ink-soft">
        {elapsed}s
      </p>
    </div>
  );
}
