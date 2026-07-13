import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type FeatureCardProps = {
  icon?: LucideIcon;
  title: string;
  children: ReactNode;
  href?: string;
  hover?: boolean;
  className?: string;
};

export function FeatureCard({
  icon: Icon,
  title,
  children,
  href,
  hover = false,
  className,
}: FeatureCardProps) {
  const inner = (
    <>
      {Icon && (
        <Icon className="mb-4 size-8 text-[var(--color-accent)]" aria-hidden />
      )}
      <h3 className="mb-3 text-xl font-semibold text-[var(--color-primary)]">
        {title}
      </h3>
      <div className="text-[var(--color-text-secondary)]">{children}</div>
    </>
  );

  const cardClass = cn(
    'rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-8',
    hover && 'transition-shadow hover:shadow-[var(--shadow-overlay)] hover:border-[var(--color-accent)]/40',
    className,
  );

  if (href) {
    return (
      <Link href={href} className={cn(cardClass, 'block')}>
        {inner}
      </Link>
    );
  }

  return <div className={cardClass}>{inner}</div>;
}
