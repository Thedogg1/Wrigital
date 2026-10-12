import type { Metadata } from 'next';
import { siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: {
    absolute: 'FinPrint Founding Partners for US Advisory Firms | Wrigital',
  },
  description:
    'Request a Complimentary Business Owner Analysis. FinPrint carries out real research and produces a Blueprint. The Founding Partner pilot is two Financial Pathway Packs around one genuine prospect.',
  openGraph: {
    title: 'FinPrint Founding Partners for US Advisory Firms | Wrigital',
    description:
      'Request a Complimentary Business Owner Analysis. FinPrint carries out real research and produces a Blueprint. The Founding Partner pilot is two Financial Pathway Packs around one genuine prospect.',
    url: `${siteUrl}/us`,
    type: 'website',
    locale: 'en_US',
  },
  alternates: { canonical: '/us' },
  robots: { index: false, follow: true },
};

export default function UsLandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
