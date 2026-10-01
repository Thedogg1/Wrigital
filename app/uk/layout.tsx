import type { Metadata } from 'next';
import { siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'FinPrint Founding Partners for UK Advice Firms | Wrigital',
  description:
    'Request a free FinPrint Blueprint on a fictional business owner, then use the Founding Partner pilot for two Financial Pathway Packs on a genuine prospect.',
  openGraph: {
    title: 'FinPrint Founding Partners for UK Advice Firms | Wrigital',
    description:
      'Request a free FinPrint Blueprint on a fictional business owner, then use the Founding Partner pilot for two Financial Pathway Packs on a genuine prospect.',
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
