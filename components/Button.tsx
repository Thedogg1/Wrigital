'use client';

import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = ComponentProps<'button'> & {
  children: ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
};

export default function Button({
  children,
  href,
  variant = 'primary',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-lg px-8 py-4 text-base font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50';

  const variantStyles = {
    primary:
      'bg-[var(--color-primary)] text-white hover:bg-[var(--color-cta-hover)]',
    secondary:
      'border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white',
  };

  const combinedClassName = cn(baseStyles, variantStyles[variant], className);

  if (href && !disabled) {
    if (href.startsWith('#')) {
      return (
        <a
          href={href}
          className={combinedClassName}
          onClick={(e) => {
            e.preventDefault();
            document.querySelector(href)?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }}
        >
          {children}
        </a>
      );
    }
    if (href.startsWith('http://') || href.startsWith('https://')) {
      return (
        <a
          href={href}
          className={combinedClassName}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClassName}
      {...props}
    >
      {children}
    </button>
  );
}
