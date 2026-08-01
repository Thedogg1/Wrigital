'use client';

import Link from 'next/link';
import { Prose } from './Prose';
import { track } from '@/lib/analytics';

export function ForwardCta({
  heading,
  body,
  label,
  href,
  from,
}: {
  heading: string;
  body?: string[];
  label: string;
  href: string;
  from: string;
}) {
  return (
    <section className="border-t border-rule bg-card">
      <div className="mx-auto max-w-6xl px-5 py-16 lg:py-20">
        <div className="max-w-[68ch] rounded border border-rule bg-paper p-7 lg:p-9">
          <h2 className="text-display-md">{heading}</h2>
          {body && body.length > 0 && (
            <Prose>
              {body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </Prose>
          )}
          <Link
            href={href}
            onClick={() => track('forward_cta_clicked', { from, to: href })}
            className="mt-7 inline-flex items-center rounded bg-source px-6 py-3.5 font-semibold text-white transition-opacity hover:opacity-90"
          >
            {label}
          </Link>
        </div>
      </div>
    </section>
  );
}
