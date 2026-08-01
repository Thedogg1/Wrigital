'use client';

import { track } from '@/lib/analytics';

export function BookPageButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('calendly_clicked', { placement: 'book_page' })}
      className="inline-flex items-center rounded bg-source px-6 py-3.5 font-body font-semibold text-white transition-opacity hover:opacity-90"
    >
      Book a call
    </a>
  );
}
