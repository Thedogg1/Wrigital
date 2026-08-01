import type { Metadata } from 'next';
import { Section } from '@/components/funnel/Section';
import { Prose, ProseP, formatInline } from '@/components/funnel/Prose';
import { SourceMark } from '@/components/funnel/SourceMark';
import { Photo } from '@/components/funnel/Photo';
import { ForwardCta } from '@/components/funnel/ForwardCta';
import { FigureCheck, CheckResult } from '@/components/funnel/FigureCheck';
import { FigureCheckProvider } from '@/components/funnel/FigureCheck/FigureCheckProvider';
import {
  CHECK_2026,
  CHECK_BOUNDARY,
  CHECK_FORM,
  CHECK_FORWARD,
  CHECK_HERO,
  CHECK_SCOPE,
  CHECK_WHO,
  SOURCE_MARKS,
} from '@/content/copy';

export const metadata: Metadata = {
  title: "Check your firm's published figures",
  description:
    "Enter your firm's address and see every allowance and threshold on your public pages compared with the current published value. Under a minute, nothing to install.",
  alternates: { canonical: '/RAG_Offer/website-figure-check' },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Wrigital',
  },
};

export default function WebsiteFigureCheckPage() {
  return (
    <FigureCheckProvider>
      <div className="mx-auto flex min-h-[calc(100svh-57px)] max-w-6xl flex-col justify-center px-5 py-10">
        <h1 className="max-w-[20ch] text-display-xl">{CHECK_HERO.h1}</h1>
        <p className="mt-5 max-w-[60ch] text-[1.125rem] text-ink-soft">
          {CHECK_HERO.sub}
        </p>
        <div className="mt-9 max-w-[68ch]">
          <p className="mb-5 text-[1.0625rem] leading-[1.7]">
            {formatInline(CHECK_FORM.lead)}
          </p>
          <FigureCheck variant="hero" />
        </div>
      </div>

      <CheckResult />

      <Section label="Who">
        <Photo
          src="/images/terry-martin-founder.jpg"
          alt="Terry Martin, founder of Wrigital Ltd, photographed in Nottingham"
          caption={CHECK_WHO.caption}
        />
        <Prose>
          <ProseP text={CHECK_WHO.p1} />
          <ProseP text={CHECK_WHO.p2} />
        </Prose>
      </Section>

      <Section label="Boundary" tone="ink">
        <Prose>
          <ProseP text={CHECK_BOUNDARY.p1} />
          <ProseP text={CHECK_BOUNDARY.p2} />
        </Prose>
      </Section>

      <Section label="2026">
        <Prose>
          <h2>{CHECK_2026.h2}</h2>
          <p>
            {CHECK_2026.p1_before}
            <SourceMark n={SOURCE_MARKS[0].n} href={SOURCE_MARKS[0].href}>
              {SOURCE_MARKS[0].text}
            </SourceMark>
            {CHECK_2026.p1_mid1}
            <SourceMark n={SOURCE_MARKS[1].n} href={SOURCE_MARKS[1].href}>
              {SOURCE_MARKS[1].text}
            </SourceMark>
            {CHECK_2026.p1_mid2}
            <SourceMark n={SOURCE_MARKS[2].n} href={SOURCE_MARKS[2].href}>
              {SOURCE_MARKS[2].text}
            </SourceMark>
            {CHECK_2026.p1_mid3}
            <SourceMark n={SOURCE_MARKS[3].n} href={SOURCE_MARKS[3].href}>
              {SOURCE_MARKS[3].text}
            </SourceMark>
            {CHECK_2026.p1_after}
          </p>
          <ProseP text={CHECK_2026.p2} />
          <ProseP text={CHECK_2026.p3} />
          <ProseP text={CHECK_2026.p4} />
        </Prose>
        <div className="mt-10">
          <FigureCheck variant="inline" />
        </div>
      </Section>

      <Section label="Scope">
        <div className="space-y-5 text-[0.9375rem] leading-[1.7] text-ink-soft">
          <p>{CHECK_SCOPE.body}</p>
        </div>
      </Section>

      <ForwardCta
        heading={CHECK_FORWARD.heading}
        body={[...CHECK_FORWARD.body]}
        label={CHECK_FORWARD.label}
        href="/RAG_Offer/how-i-stop-hallucinations"
        from="website-figure-check"
      />
    </FigureCheckProvider>
  );
}
