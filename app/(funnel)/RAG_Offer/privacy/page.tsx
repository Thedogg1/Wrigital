import type { Metadata } from 'next';
import { Section } from '@/components/funnel/Section';
import { Prose, ProseP } from '@/components/funnel/Prose';
import { PRIVACY } from '@/content/copy';

export const metadata: Metadata = {
  title: 'Privacy',
  robots: { index: false, follow: false },
  alternates: { canonical: '/RAG_Offer/privacy' },
};

export default function FunnelPrivacyPage() {
  return (
    <Section>
      <Prose>
        <h2>{PRIVACY.h2}</h2>
        {PRIVACY.paragraphs.map((p) => (
          <ProseP key={p} text={p} />
        ))}
      </Prose>
    </Section>
  );
}
