import type { Metadata } from 'next';
import { Section } from '@/components/funnel/Section';
import { Prose, ProseP } from '@/components/funnel/Prose';
import { ForwardCta } from '@/components/funnel/ForwardCta';
import { FEATURES_PAGE } from '@/content/copy';

export const metadata: Metadata = {
  title: 'The Verified Assistant, Founding Firms Programme',
  description:
    'A bespoke grounded assistant for UK FCA-regulated advice firms with 1 to 10 advisers. £1,200 setup, then £250 a month.',
  alternates: { canonical: '/RAG_Offer/features' },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Wrigital',
  },
};

export default function FeaturesPage() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
        <div className="max-w-[68ch]">
          <h1 className="text-display-xl">{FEATURES_PAGE.h1}</h1>
          <h2 className="mt-3 text-sm font-semibold tracking-wide text-ink-soft">
            {FEATURES_PAGE.h2}
          </h2>
          <p className="mt-6 font-display text-display-md italic">
            {FEATURES_PAGE.italic}
          </p>
          <p className="mt-5 text-[1.125rem] leading-[1.65]">
            {FEATURES_PAGE.audience}
          </p>
        </div>
      </div>

      <Section label="The case">
        <Prose>
          {FEATURES_PAGE.core.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Prose>
      </Section>

      <Section label="Included">
        <h2 className="text-display-lg">{FEATURES_PAGE.includedHeading}</h2>
        <dl className="mt-8 divide-y divide-rule border-y border-rule">
          {FEATURES_PAGE.included.map((i) => (
            <div key={i.term} className="py-5">
              <dt className="font-semibold">{i.term}</dt>
              <dd className="mt-1.5 text-ink-soft">{i.detail}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section label="Founding">
        <h2 className="text-display-lg">{FEATURES_PAGE.foundingHeading}</h2>
        <div className="mt-6 rounded border border-rule bg-card p-6">
          <Prose className="mt-0">
            <ProseP text={FEATURES_PAGE.founding.p1} />
            <p>{FEATURES_PAGE.founding.p2}</p>
          </Prose>
        </div>
      </Section>

      <Section label="Price">
        <h2 className="text-display-lg">{FEATURES_PAGE.priceHeading}</h2>
        <p className="mt-6 font-display text-display-lg">
          {FEATURES_PAGE.priceLead}
        </p>
        <Prose>
          <p>{FEATURES_PAGE.priceTerms}</p>
          <p>{FEATURES_PAGE.priceAzure}</p>
          <p className="text-ink-soft">{FEATURES_PAGE.priceExample}</p>
        </Prose>
      </Section>

      <Section label="Excluded">
        <h2 className="text-display-lg">{FEATURES_PAGE.excludedHeading}</h2>
        <dl className="mt-8 divide-y divide-rule border-y border-rule">
          {FEATURES_PAGE.excluded.map((i) => (
            <div key={i.term} className="py-5">
              <dt className="font-semibold">{i.term}</dt>
              <dd className="mt-1.5 text-ink-soft">{i.detail}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section label="Cohort">
        <h2 className="text-display-lg">{FEATURES_PAGE.cohortHeading}</h2>
        <Prose>
          {FEATURES_PAGE.cohort.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Prose>
      </Section>

      <Section label="Close" tone="ink">
        <Prose>
          {FEATURES_PAGE.close.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Prose>
      </Section>

      <ForwardCta
        heading={FEATURES_PAGE.forward.heading}
        body={[...FEATURES_PAGE.forward.body]}
        label={FEATURES_PAGE.forward.label}
        href="/RAG_Offer/verified-answers"
        from="features"
      />
    </>
  );
}
