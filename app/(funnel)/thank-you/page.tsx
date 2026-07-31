import type { Metadata } from 'next';
import { ThankYouHeading } from '@/components/funnel/ThankYouHeading';
import { VideoEmbed } from '@/components/funnel/VideoEmbed';
import { BookACall } from '@/components/funnel/BookACall';
import { Prose } from '@/components/funnel/Prose';

export const metadata: Metadata = {
  title: 'Your figure check record is on the way',
  robots: { index: false, follow: false },
  alternates: { canonical: '/thank-you' },
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
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(cleaned.replace(/^https?:\/\//, '').replace(/\/.*$/, ''))) {
    return 'your site';
  }
  return cleaned.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
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
              The full record of the check on {domain}. Every page has been read
              and every figure has been found. Each number has been compared with
              the current published value on the page that the link leads to.
            </p>
            <p>
              The report should arrive within a couple of minutes. If not, check
              your junk folder before assuming it&apos;s lost.
            </p>
          </Prose>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-0 sm:px-5">
        <div className="px-5 sm:px-0">
          <h2 className="max-w-[68ch] text-display-lg">
            Four minutes: the same checking, inside a working assistant
          </h2>
        </div>
        <div className="mt-8 aspect-video w-full">
          <VideoEmbed />
        </div>
        <div className="mt-6 max-w-[68ch] px-5 sm:px-0">
          <Prose>
            <p>
              Watch the assistant in action. See the numbers brief, clickable
              citations, and the audit reports showing the origin of every figure
              and information block.
            </p>
            <p>
              The numbers brief is a separate build. This offer is grounded
              answers with verified citations.
            </p>
          </Prose>
        </div>
      </div>

      <BookACall variant="standing" placement="thank_you" />
    </>
  );
}
