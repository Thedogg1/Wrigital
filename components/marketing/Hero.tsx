import Image from 'next/image';
import type { ReactNode } from 'react';
import { LinkButton, type CtaLink } from '@/components/marketing/shared';
import { cn } from '@/lib/utils';

type HeroProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  supporting?: string;
  primary?: CtaLink;
  secondary?: CtaLink;
  image?: string;
  fullWidthImage?: boolean;
  className?: string;
  children?: ReactNode;
};

export default function Hero({
  eyebrow,
  title,
  subtitle,
  supporting,
  primary,
  secondary,
  image,
  fullWidthImage = false,
  className,
  children,
}: HeroProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden',
        fullWidthImage ? 'min-h-[420px]' : 'bg-[var(--color-surface)] py-20 lg:py-28',
        className,
      )}
    >
      {image && (
        <>
          <Image
            src={image}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[var(--color-primary)]/70" />
        </>
      )}
      <div
        className={cn(
          'relative mx-auto max-w-7xl px-6',
          image ? 'py-20 text-[var(--color-text-inverse)] lg:py-28' : '',
        )}
      >
        <div className={cn('max-w-3xl', fullWidthImage && 'mx-auto text-center')}>
          {eyebrow && (
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
              {eyebrow}
            </p>
          )}
          <h1 className="mb-6 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mb-4 text-lg leading-relaxed text-inherit opacity-95 sm:text-xl">
            {subtitle}
          </p>
          {supporting && (
            <p className="mb-8 text-base opacity-90">{supporting}</p>
          )}
          {(primary || secondary) && (
            <div className="flex flex-wrap gap-4">
              {primary && (
                <LinkButton cta={primary} variant="default" />
              )}
              {secondary && (
                <LinkButton cta={secondary} variant="outline" />
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
