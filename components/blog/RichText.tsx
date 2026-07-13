import NextImage from 'next/image';
import Link from 'next/link';
import { urlForImage } from '@/sanity/lib/image';
import type { PortableTextComponents } from '@portabletext/react';
import type { Image } from '@/types';

export const RichText: PortableTextComponents = {
  types: {
    image: ({ value }: { value: Image }) => {
      if (!value) {
        return null;
      }

      const imageUrl = urlForImage(value);
      if (!imageUrl) {
        return null;
      }

      return (
        <figure className='my-8 sm:my-12'>
          <div className='relative w-full aspect-video overflow-hidden rounded-lg'>
            <NextImage
              src={imageUrl}
              alt={value.alt || 'Blog Post Image'}
              fill
              className='object-cover'
            />
          </div>
          {value.alt && (
            <figcaption className='text-xs sm:text-sm text-[var(--color-text-secondary)] mt-2 sm:mt-3 text-center italic px-4'>
              {value.alt}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className='my-4 sm:my-6 ml-4 sm:ml-6 list-disc space-y-2 sm:space-y-3 text-base sm:text-lg text-[var(--color-text-primary)]'>
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className='my-4 sm:my-6 ml-4 sm:ml-6 list-decimal space-y-2 sm:space-y-3 text-base sm:text-lg text-[var(--color-text-primary)]'>
        {children}
      </ol>
    ),
  },
  block: {
    h1: ({ children }) => (
      <h1 className='text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mt-8 sm:mt-12 mb-4 sm:mb-6 first:mt-0'>
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className='text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mt-8 sm:mt-12 mb-4 sm:mb-6 first:mt-0'>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className='text-xl sm:text-2xl font-semibold text-[var(--color-text-primary)] mt-6 sm:mt-10 mb-3 sm:mb-4 first:mt-0'>
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className='text-lg sm:text-xl font-semibold text-[var(--color-text-primary)] mt-6 sm:mt-8 mb-2 sm:mb-3 first:mt-0'>
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className='text-base sm:text-lg leading-relaxed text-[var(--color-text-primary)] my-4 sm:my-6 max-w-prose'>
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className='border-l-4 border-[var(--color-primary)] pl-4 sm:pl-6 py-3 sm:py-4 my-6 sm:my-8 italic text-base sm:text-lg text-[var(--color-text-secondary)] bg-[var(--color-surface)] rounded-r-lg'>
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      if (!value?.href) {
        return <>{children}</>;
      }

      const rel = !value.href.startsWith('/')
        ? 'noopener noreferrer'
        : undefined;

      return (
        <Link 
          href={value.href} 
          rel={rel}
          className='text-[var(--color-primary)] hover:text-[var(--color-cta-hover)] underline transition-colors'
        >
          {children}
        </Link>
      );
    },
    strong: ({ children }) => (
      <strong className='font-semibold text-[var(--color-text-primary)]'>
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className='italic'>
        {children}
      </em>
    ),
  },
};
