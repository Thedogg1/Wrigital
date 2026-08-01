import type { Metadata } from 'next';
import { Section } from '@/components/funnel/Section';
import { Prose, ProseP } from '@/components/funnel/Prose';
import { ForwardCta } from '@/components/funnel/ForwardCta';
import { VideoEmbed } from '@/components/funnel/VideoEmbed';
import { VIDEO_PAGE } from '@/content/copy';

export const metadata: Metadata = {
  title: 'The Verified Assistant in four minutes',
  description:
    'A real question going in, clickable citations, and the audit reports showing where every figure and information block came from.',
  alternates: { canonical: '/RAG_Offer/see-it-working' },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Wrigital',
  },
};

export default function SeeItWorkingPage() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
        <div className="max-w-[68ch]">
          <h1 className="text-display-xl">{VIDEO_PAGE.h1}</h1>
          <p className="mt-5 text-[1.125rem] leading-[1.65] text-ink-soft">
            {VIDEO_PAGE.sub}
          </p>
          <p className="mt-3 text-sm text-ink-soft">
            Runtime: {VIDEO_PAGE.runtime}.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-0 sm:px-5">
        <VideoEmbed />
      </div>

      <Section label="Notes">
        <Prose>
          <p>{VIDEO_PAGE.numbersBrief}</p>
        </Prose>
        <div className="mt-8 rounded border border-rule bg-card p-6">
          <Prose className="mt-0">
            <ProseP text={VIDEO_PAGE.whatVideoDoesntShow} />
          </Prose>
        </div>
      </Section>

      <ForwardCta
        heading={VIDEO_PAGE.forward.heading}
        body={VIDEO_PAGE.forward.body.length ? [...VIDEO_PAGE.forward.body] : undefined}
        label={VIDEO_PAGE.forward.label}
        href="/RAG_Offer/features"
        from="see-it-working"
      />
    </>
  );
}
