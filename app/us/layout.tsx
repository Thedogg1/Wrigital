import type { Metadata } from 'next';
import { siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'FinPrint Exit Tax Calculator for US Financial Advisors | Wrigital',
  description:
    'SEC- and FINRA-regulated advisors: estimate net proceeds after federal and state tax, QSBS eligibility, and concentration risk.',
  openGraph: {
    title: 'FinPrint Exit Tax Calculator for US Financial Advisors | Wrigital',
    description:
      'Estimate net proceeds after tax, QSBS eligibility, and concentration risk for HNW business owner clients.',
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
