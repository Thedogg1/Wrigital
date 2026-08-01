import type { Metadata } from 'next';
import { Section } from '@/components/funnel/Section';
import { Prose } from '@/components/funnel/Prose';
import { CalendlyEmbed } from '@/components/funnel/CalendlyEmbed';
import { BOOK_PAGE } from '@/content/copy';

export const metadata: Metadata = {
  title: 'Thirty minutes to define your AI compliance blueprint',
  description:
    'Tell me what your compliance officer needs to see before AI is client-ready. Within two working days you receive that written as a technical specification, yours to keep.',
  alternates: { canonical: '/RAG_Offer/book-a-call' },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Wrigital',
  },
};

export default function BookACallPage() {
  return (
    <>
      <Section tone="ink">
        <h1 className="text-display-xl">{BOOK_PAGE.h1}</h1>
        <Prose>
          {BOOK_PAGE.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Prose>
      </Section>

      <Section label="The offer">
        <h2 className="text-display-lg">{BOOK_PAGE.offerHeading}</h2>
        <p className="mt-6 font-semibold">
          <strong>{BOOK_PAGE.priceLead}</strong> {BOOK_PAGE.priceTerms}
        </p>
        <ul className="mt-6 list-disc space-y-3 pl-5 text-[1.0625rem] leading-[1.7] text-ink-soft">
          {BOOK_PAGE.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <p className="mt-8 text-[1.0625rem] leading-[1.7]">
          {BOOK_PAGE.numberChecking}
        </p>
      </Section>

      <CalendlyEmbed />
    </>
  );
}
