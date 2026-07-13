'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type CtaLink = {
  label: string;
  href: string;
};

type LinkButtonProps = {
  cta: CtaLink;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'lg' | 'sm';
  className?: string;
};

export function LinkButton({
  cta,
  variant = 'default',
  size = 'lg',
  className,
}: LinkButtonProps) {
  const isExternal =
    cta.href.startsWith('http://') || cta.href.startsWith('https://');
  const isHash = cta.href.startsWith('#');

  const combinedClass = cn(
    buttonVariants({ variant, size }),
    size === 'lg' && 'h-11 px-8 text-base',
    className,
  );

  if (isHash) {
    return (
      <a
        href={cta.href}
        className={combinedClass}
        onClick={(e) => {
          e.preventDefault();
          document.querySelector(cta.href)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }}
      >
        {cta.label}
      </a>
    );
  }

  if (isExternal) {
    return (
      <a
        href={cta.href}
        className={combinedClass}
        target="_blank"
        rel="noopener noreferrer"
      >
        {cta.label}
      </a>
    );
  }

  return (
    <Link href={cta.href} className={combinedClass}>
      {cta.label}
    </Link>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
      {children}
    </p>
  );
}
