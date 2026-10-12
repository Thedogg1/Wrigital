import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/Button';
import FoundingPartnerApplyButton from '@/components/landing/FoundingPartnerApplyButton';

export const metadata: Metadata = {
  title: {
    absolute: 'Thank you | Complimentary Business Owner Analysis',
  },
  description:
    'Your Complimentary Business Owner Analysis request has been received.',
  robots: { index: false, follow: false },
};

/** Replace when a USA sample Financial Pathway Pack folder exists. */
const US_SAMPLE_PACK_URL = '[US SAMPLE PACK URL]';

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

function suppliedSamplePackUrl(value: string): string | null {
  if (!value.trim() || value.trim() === '[US SAMPLE PACK URL]') return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}

export default async function UsBlueprintThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = await searchParams;
  const email = params.email?.trim() ?? '';
  const showEmail = isEmail(email);
  const samplePackUrl = suppliedSamplePackUrl(US_SAMPLE_PACK_URL);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-[#1E2A4A] via-[#2D3561] to-[#0a2463] py-20 text-white lg:py-28">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <p className="mb-6 text-xs font-semibold tracking-widest text-[var(--color-accent)] uppercase">
              Complimentary Business Owner Analysis
            </p>
            <h1 className="mb-6 text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl">
              Thank you. Your analysis request has been received.
            </h1>
            <p className="mx-auto mb-6 max-w-2xl text-lg leading-relaxed text-[#CBD5E1]">
              {showEmail
                ? `We will carry out the Complimentary Business Owner Analysis and send the Blueprint to ${email}.`
                : 'We will carry out the Complimentary Business Owner Analysis and send the Blueprint to the work email you entered.'}
            </p>
            <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-[#CBD5E1]">
              It has not been generated yet. Values you left blank stay unknown
              unless they can properly be calculated, researched, or labelled as
              an assumption.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
              {samplePackUrl ? (
                <Button
                  href={samplePackUrl}
                  className="border-none bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-strong)]"
                >
                  View a sample Financial Pathway Pack
                </Button>
              ) : null}
              <Button
                href="/us"
                variant="secondary"
                className="border-white text-white hover:bg-white hover:text-[var(--color-primary)]"
              >
                Back to FinPrint
              </Button>
              <FoundingPartnerApplyButton
                variant="secondary"
                className="border-white text-white hover:bg-white hover:text-[var(--color-primary)]"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
