import type { Metadata } from 'next';
import { Section } from '@/components/funnel/Section';
import { Prose } from '@/components/funnel/Prose';
import { ForwardCta } from '@/components/funnel/ForwardCta';
import { LAYERS_PAGE } from '@/content/copy';

export const metadata: Metadata = {
  title: 'How I stop hallucinations',
  description:
    'Defence in depth. Five independent layers, each catching what the previous layer missed. Every one of them runs before your firm asks a single question.',
  alternates: { canonical: '/RAG_Offer/how-i-stop-hallucinations' },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Wrigital',
  },
};

export default function HowIStopHallucinationsPage() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
        <div className="max-w-[68ch]">
          <h1 className="text-display-xl">{LAYERS_PAGE.h1}</h1>
          <Prose>
            {LAYERS_PAGE.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Prose>
        </div>
      </div>

      <Section>
        <ol className="space-y-8">
          {LAYERS_PAGE.layers.map((l, i) => (
            <li
              key={l.lead}
              className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4"
            >
              <span className="pt-1 text-sm font-semibold text-source">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="font-semibold">{l.lead}</p>
                <p className="mt-2 text-ink-soft">{l.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <h2 className="mt-16 text-display-lg">{LAYERS_PAGE.afterHeading}</h2>
        <Prose>
          {LAYERS_PAGE.after.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Prose>
      </Section>

      <ForwardCta
        heading={LAYERS_PAGE.forward.heading}
        body={[...LAYERS_PAGE.forward.body]}
        label={LAYERS_PAGE.forward.label}
        href="/RAG_Offer/see-it-working"
        from="how-i-stop-hallucinations"
      />
    </>
  );
}
