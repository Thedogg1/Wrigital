import type { Metadata } from 'next';
import { ThankYouHeading } from '@/components/funnel/ThankYouHeading';
import { ForwardCta } from '@/components/funnel/ForwardCta';
import { Prose } from '@/components/funnel/Prose';
import { THANK_YOU } from '@/content/copy';

export const metadata: Metadata = {
  title: 'Your figure check record is on its way',
  robots: { index: false, follow: false },
  alternates: { canonical: '/RAG_Offer/thank-you' },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Wrigital',
  },
};

function normaliseDomainParam(raw: string | string[] | undefined): string {
  if (!raw || Array.isArray(raw)) return 'your site';
  const cleaned = raw.trim();
  if (!cleaned || cleaned.length > 253) return 'your site';
  const stripped = cleaned.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(stripped)) return 'your site';
  return stripped;
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ domain?: string }>;
}) {
  const params = await searchParams;
  const domain = normaliseDomainParam(params.domain);

  return (
    <>
      <div className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
        <div className="max-w-[68ch]">
          <ThankYouHeading />
          <Prose>
            <p>
              {THANK_YOU.p1Prefix}
              {domain}
              {THANK_YOU.p1}
            </p>
            <p>{THANK_YOU.p2}</p>
          </Prose>
        </div>
      </div>

      <ForwardCta
        heading={THANK_YOU.forward.heading}
        body={[...THANK_YOU.forward.body]}
        label={THANK_YOU.forward.label}
        href="/RAG_Offer/how-i-stop-hallucinations"
        from="thank-you"
      />
    </>
  );
}
