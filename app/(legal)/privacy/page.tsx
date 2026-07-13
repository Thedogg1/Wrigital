import { contactEmail, contactMailto } from '@/lib/email/config';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  robots: { index: false, follow: true },
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="mb-8 text-3xl font-bold text-[var(--color-primary)]">
          Privacy Policy
        </h1>
        <div className="prose space-y-6 text-[var(--color-text-secondary)]">
          <p>
            Wrigital Ltd (&ldquo;Wrigital&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) respects
            your privacy. This policy explains how we collect, use and protect personal
            data when you use wrigital.com and related services.
          </p>
          <h2 className="text-xl font-semibold text-[var(--color-primary)]">
            Data we collect
          </h2>
          <p>
            We may collect contact details (name, email, firm name) when you book an
            assessment, request a sample report, or use our landing-page calculators. We
            also collect standard analytics and technical logs to operate and improve the
            site.
          </p>
          <h2 className="text-xl font-semibold text-[var(--color-primary)]">
            How we use data
          </h2>
          <p>
            We use your data to respond to enquiries, deliver requested reports, operate
            our services, and meet legal obligations. We do not sell personal data.
          </p>
          <h2 className="text-xl font-semibold text-[var(--color-primary)]">
            Contact
          </h2>
          <p>
            For privacy enquiries, contact{' '}
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
