import type { ReactNode } from 'react';
import { LinkButton, type CtaLink } from '@/components/marketing/shared';
import { cn } from '@/lib/utils';

export function CtaBand({
  title,
  body,
  cta,
  secondary,
  tone = 'navy',
}: {
  title: string;
  body?: string;
  cta: CtaLink;
  secondary?: CtaLink;
  tone?: 'navy' | 'paper';
}) {
  const isNavy = tone === 'navy';

  return (
    <section
      className={cn(
        'py-20',
        isNavy
          ? 'bg-[var(--color-primary)] text-[var(--color-text-inverse)]'
          : 'bg-[var(--color-surface)] text-[var(--color-text-primary)]',
      )}
    >
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="mb-4 text-2xl font-semibold sm:text-3xl">{title}</h2>
        {body && (
          <p
            className={cn(
              'mb-8 text-lg',
              isNavy ? 'text-[var(--color-text-inverse)]/90' : 'text-[var(--color-text-secondary)]',
            )}
          >
            {body}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-4">
          <LinkButton
            cta={cta}
            variant={isNavy ? 'secondary' : 'default'}
          />
          {secondary && (
            <LinkButton cta={secondary} variant="outline" />
          )}
        </div>
      </div>
    </section>
  );
}

export function Prose({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('prose mx-auto max-w-prose', className)}>{children}</div>
  );
}

export function Section({
  children,
  className,
  banded = false,
  id,
}: {
  children: ReactNode;
  className?: string;
  banded?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        'py-16 lg:py-20',
        banded && 'bg-[var(--color-surface)]',
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-6">{children}</div>
    </section>
  );
}
