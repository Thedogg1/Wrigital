import type { Metadata } from 'next';
import { SITE } from '@/lib/site';
import { BookPageButton } from './BookPageButton';

export const metadata: Metadata = {
  title: 'Book a call',
  robots: { index: true, follow: true },
  alternates: { canonical: '/RAG_Offer/book' },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Wrigital',
  },
};

export default function BookPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100svh-8rem)] max-w-[52ch] flex-col justify-center px-5 py-20 lg:py-28">
      <h1 className="text-display-xl">{'{{BOOK_H1}}'}</h1>
      <p className="mt-6 text-[1.125rem] leading-[1.7] text-ink-soft">
        {'{{BOOK_BODY}}'}
      </p>
      <div className="mt-9">
        <BookPageButton href={SITE.calendly} />
      </div>
    </div>
  );
}
