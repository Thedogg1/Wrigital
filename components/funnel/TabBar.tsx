'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WrigitalLogo } from '@/components/brand/WrigitalLogo';
import { TABS, BOOK_TAB } from '@/lib/site';
import { track } from '@/lib/analytics';

export function TabBar() {
  const path = usePathname() ?? '';

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/95 backdrop-blur-sm">
      <nav
        aria-label="Funnel"
        className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-4 sm:gap-6"
      >
        <Link
          href={TABS[0].href}
          className="flex shrink-0 items-center"
          onClick={() => track('tab_clicked', { label: 'Wrigital' })}
        >
          <WrigitalLogo />
        </Link>
        <ul className="funnel-nav-tabs flex min-w-0 flex-1 items-center gap-5 overflow-x-auto sm:gap-6">
          {TABS.map((t) => {
            const active = path === t.href || path === `${t.href}/`;
            return (
              <li key={t.href} className="shrink-0">
                <Link
                  href={t.href}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => track('tab_clicked', { label: t.label })}
                  className={`block whitespace-nowrap border-b-2 pb-1 text-sm transition-colors duration-150 ${
                    active
                      ? 'border-source text-ink'
                      : 'border-transparent text-ink-soft hover:text-ink'
                  }`}
                >
                  {t.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <Link
          href={BOOK_TAB.href}
          aria-current={
            path === BOOK_TAB.href || path === `${BOOK_TAB.href}/`
              ? 'page'
              : undefined
          }
          onClick={() => track('tab_clicked', { label: BOOK_TAB.label })}
          className={`ml-auto shrink-0 rounded bg-source px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 ${
            path === BOOK_TAB.href || path === `${BOOK_TAB.href}/`
              ? 'ring-2 ring-ink ring-offset-2 ring-offset-paper'
              : ''
          }`}
        >
          {BOOK_TAB.label}
        </Link>
      </nav>
    </header>
  );
}
