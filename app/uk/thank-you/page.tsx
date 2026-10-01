import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/Button';
import { contactEmail } from '@/lib/email/config';

export const metadata: Metadata = {
  title: 'Thank you | FinPrint Blueprint',
  description:
    'Your free FinPrint Blueprint request has been received.',
  robots: { index: false, follow: false },
};

const foundingPartnersMailto = `mailto:${contactEmail}?subject=${encodeURIComponent(
  'FinPrint Founding Partners Programme Application',
)}`;

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

export default async function UkBlueprintThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = await searchParams;
  const email = params.email?.trim() ?? '';
  const showEmail = isEmail(email);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-[#1E2A4A] via-[#2D3561] to-[#0a2463] py-20 text-white lg:py-28">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <p className="mb-6 text-xs font-semibold tracking-widest text-[var(--color-accent)] uppercase">
              Free FinPrint Blueprint
            </p>
            <h1 className="mb-6 text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl">
              Thank you. Your Blueprint request has been received.
            </h1>
            <p className="mx-auto mb-6 max-w-2xl text-lg leading-relaxed text-[#CBD5E1]">
              {showEmail
                ? `We will prepare the demonstration Blueprint from this fictional case and send it to ${email}.`
                : 'We will prepare the demonstration Blueprint from this fictional case and send it to the work email you entered.'}
            </p>
            <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-[#CBD5E1]">
              It has not been generated yet. Values you left blank stay unknown
              unless they can properly be calculated, researched, or labelled as
              an assumption.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                href="/uk"
                className="border-none bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-strong)]"
              >
                Back to FinPrint
              </Button>
              <Button
                href={foundingPartnersMailto}
                variant="secondary"
                className="border-white text-white hover:bg-white hover:text-[var(--color-primary)]"
              >
                Apply to Become a Founding Partner
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
