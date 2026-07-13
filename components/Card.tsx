import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg)] p-6 shadow-[var(--shadow-card)]',
        className,
      )}
    >
      {children}
    </div>
  );
}
