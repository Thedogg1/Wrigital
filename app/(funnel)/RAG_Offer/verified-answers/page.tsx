import type { Metadata } from 'next';
import { Section } from '@/components/funnel/Section';
import { Prose, ProseP } from '@/components/funnel/Prose';
import { ForwardCta } from '@/components/funnel/ForwardCta';
import { WizardBlock } from '@/components/funnel/wizard/WizardBlock';
import { VERIFIED_PAGE } from '@/content/copy';

export const metadata: Metadata = {
  title: 'How many unverified answers left your firm last month',
  description:
    'Eleven questions and the estimate appears on screen, with the arithmetic shown in full. Nothing to install, no account, and your answers stay in your browser.',
  alternates: { canonical: '/RAG_Offer/verified-answers' },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Wrigital',
  },
};

export default function VerifiedAnswersPage() {
  return (
    <>
      <Section label="The nod">
        <p className="text-display-md">{VERIFIED_PAGE.nod[0]}</p>
        <p className="mt-5 text-[1.0625rem] leading-[1.7]">
          {VERIFIED_PAGE.nod[1]}
        </p>
      </Section>

      <Section label="Why not">
        <Prose>
          <h2>{VERIFIED_PAGE.whyNotHeading}</h2>
          {VERIFIED_PAGE.whyNot.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Prose>
      </Section>

      <Section label="The gap">
        <Prose>
          <h2>{VERIFIED_PAGE.gapHeading}</h2>
          {VERIFIED_PAGE.gap.map((p) => (
            <ProseP key={p} text={p} />
          ))}
        </Prose>
      </Section>

      <WizardBlock />

      <ForwardCta
        heading={VERIFIED_PAGE.forward.heading}
        body={[...VERIFIED_PAGE.forward.body]}
        label={VERIFIED_PAGE.forward.label}
        href="/RAG_Offer/book-a-call"
        from="verified-answers"
      />
    </>
  );
}
