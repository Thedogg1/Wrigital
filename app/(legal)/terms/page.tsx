import { contactEmail, contactMailto } from '@/lib/email/config';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service',
  robots: { index: false, follow: true },
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="mb-8 text-3xl font-bold text-[var(--color-primary)]">
          Terms of Service
        </h1>
        <div className="prose space-y-6 text-[var(--color-text-secondary)]">
          <p>
            These terms govern your use of the Wrigital website and tools. By using
            wrigital.com you agree to these terms.
          </p>
          <h2 className="text-xl font-semibold text-[var(--color-primary)]">
            No advice
          </h2>
          <p>
            Wrigital provides technology-based decision-support tools and analysis
            frameworks. Wrigital does not make suitability determinations, provide
            investment advice, or act as a regulated adviser. Licensed professionals
            remain responsible for all client recommendations.
          </p>
          <h2 className="text-xl font-semibold text-[var(--color-primary)]">
            Limitation of liability
          </h2>
          <p>
            Tools and reports are provided &ldquo;as is&rdquo; for professional use.
            Wrigital Ltd is not liable for decisions made on the basis of calculator
            outputs or sample reports without independent professional review.
          </p>
          <h2 className="text-xl font-semibold text-[var(--color-primary)]">
            Contact
          </h2>
          <p>
            Questions about these terms:{' '}
            <a href={contactMailto} className="underline">
              {contactEmail}
            </a>
            .
          </p>
        </div>
        <p className="mt-12">
          <Link href="/" className="text-[var(--color-primary)] underline">
            Return home
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
