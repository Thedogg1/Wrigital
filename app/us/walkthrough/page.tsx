import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/Button';
import FoundingPartnerApplyButton from '@/components/landing/FoundingPartnerApplyButton';
import { siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'FinPrint US Walkthrough',
  description: 'A walkthrough of FinPrint for US advisory firms.',
  openGraph: {
    title: 'FinPrint US Walkthrough | Wrigital',
    description: 'A walkthrough of FinPrint for US advisory firms.',
    url: `${siteUrl}/us/walkthrough`,
    type: 'website',
    locale: 'en_US',
  },
  alternates: { canonical: '/us/walkthrough' },
  robots: { index: false, follow: true },
};

export default function UsWalkthroughPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-[#1E2A4A] via-[#2D3561] to-[#0a2463] py-20 text-white lg:py-28">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <p className="mb-6 text-xs font-semibold tracking-widest text-[var(--color-accent)] uppercase">
              FinPrint US
            </p>
            <h1 className="mb-10 text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl">
              FinPrint Walkthrough
            </h1>
            <div style={{ position: 'relative', width: '100%', height: 720 }}>
              <iframe
                src="https://app.trupeer.ai/embed/khx37gXEu/doc?app=69f9261c487f9d6e7dbfc075"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  border: 0,
                }}
                allowFullScreen
                allow="autoplay; fullscreen; encrypted-media; clipboard-write"
                loading="lazy"
                title="FinPrint USA demo"
              />
            </div>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
              <FoundingPartnerApplyButton />
              <Button
                href="/us"
                variant="secondary"
                className="border-white text-white hover:bg-white hover:text-[var(--color-primary)]"
              >
                Back to FinPrint
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
