import type { Metadata } from 'next';
import { siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'FinPrint Founding Partners for UK Advice Firms | Wrigital',
  description:
    'Request a Complimentary Business Owner Analysis. FinPrint carries out real research and produces a Blueprint. The Founding Partner pilot is two Financial Pathway Packs around one genuine prospect.',
  openGraph: {
    title: 'FinPrint Founding Partners for UK Advice Firms | Wrigital',
    description:
      'Request a Complimentary Business Owner Analysis. FinPrint carries out real research and produces a Blueprint. The Founding Partner pilot is two Financial Pathway Packs around one genuine prospect.',
    url: `${siteUrl}/uk`,
    type: 'website',
    locale: 'en_GB',
  },
  alternates: { canonical: '/uk' },
  robots: { index: false, follow: true },
};

export default function UkLandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
