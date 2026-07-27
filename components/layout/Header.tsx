'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { WrigitalLogo } from '@/components/brand/WrigitalLogo';
import { buttonVariants } from '@/components/ui/button';
import { calendlyUrl } from '@/lib/site';
import { cn } from '@/lib/utils';

type HeaderProps = {
  variant?: 'main' | 'finprint';
};

const navItems = [
  { label: 'Consultancy', href: '/consultancy', shortLabel: 'Consultancy' },
  {
    label: 'FinPrint',
    href: '/client-conversion-financial-advisers',
    shortLabel: 'FinPrint',
  },
  {
    label: 'Client Intelligence Engine',
    href: '/client-intelligence-engine',
    shortLabel: 'The Engine',
  },
  {
    label: 'Unverified Answer Count',
    href: '/unverified-answer-count',
    shortLabel: 'Answer Count',
  },
  { label: 'About', href: '/about', shortLabel: 'About' },
  { label: 'Blog', href: '/blog', shortLabel: 'Blog' },
];

export default function Header({ variant = 'main' }: HeaderProps) {
  const [open, setOpen] = useState(false);

  const cta =
    variant === 'finprint'
      ? { label: 'Request a sample report', href: '#request-sample' }
      : { label: 'Book an assessment', href: calendlyUrl };

  const isExternal = cta.href.startsWith('http');
  const ctaClass = cn(buttonVariants({ size: 'sm' }), 'ml-2');

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg)]/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/"
          className="flex shrink-0 items-center"
          onClick={() => setOpen(false)}
        >
          <WrigitalLogo variant={variant} />
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-primary)]"
            >
              <span className="hidden xl:inline">{item.label}</span>
              <span className="xl:hidden">{item.shortLabel}</span>
            </Link>
          ))}
          {isExternal ? (
            <a
              href={cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className={ctaClass}
            >
              {cta.label}
            </a>
          ) : (
            <a href={cta.href} className={ctaClass}>
              {cta.label}
            </a>
          )}
        </div>

        <button
          type="button"
          className="p-2 text-[var(--color-primary)] lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-[var(--color-border-subtle)] lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {isExternal ? (
              <a
                href={cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants()}
              >
                {cta.label}
              </a>
            ) : (
              <a href={cta.href} className={buttonVariants()}>
                {cta.label}
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
