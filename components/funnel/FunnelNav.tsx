'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/RAG_Offer', label: 'The check', exact: true },
  { href: '/RAG_Offer/verified-answers', label: 'Verified answers', exact: false },
  { href: '/RAG_Offer/the-assistant', label: 'The assistant', exact: false },
] as const;

function isActive(pathname: string, href: string, exact: boolean): boolean {
  if (exact) return pathname === href || pathname === `${href}/`;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function FunnelNav() {
  const pathname = usePathname() ?? '';
  const bookActive = isActive(pathname, '/RAG_Offer/book', false);

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:gap-6 sm:py-0 sm:h-14">
        <Link
          href="/RAG_Offer"
          className="font-display text-lg tracking-tight text-ink shrink-0"
        >
          Wrigital
        </Link>

        <div className="flex min-w-0 flex-1 items-center gap-4">
          <nav
            aria-label="Funnel"
            className="funnel-nav-tabs flex min-w-0 flex-1 gap-5 overflow-x-auto"
          >
            {TABS.map((tab) => {
              const active = isActive(pathname, tab.href, tab.exact);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  aria-current={active ? 'page' : undefined}
                  className={`shrink-0 border-b-2 py-3 font-mono text-[0.8125rem] transition-colors duration-[120ms] ${
                    active
                      ? 'border-source text-ink'
                      : 'border-transparent text-ink-soft hover:text-ink'
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/RAG_Offer/book"
            aria-current={bookActive ? 'page' : undefined}
            className={`ml-auto shrink-0 rounded bg-source px-4 py-2 font-body text-[0.875rem] font-semibold text-white transition-opacity duration-[120ms] hover:opacity-90 ${
              bookActive ? 'ring-2 ring-ink ring-offset-2 ring-offset-paper' : ''
            }`}
          >
            Book now
          </Link>
        </div>
      </div>
    </header>
  );
}
