import type { Metadata } from 'next';
import { siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'FinPrint Exit Tax Calculator for UK Financial Advisers | Wrigital',
  description:
    'FCA-regulated advisers: estimate your client\'s net proceeds after CGT, BADR eligibility, and concentration risk. Free UK exit tax calculator.',
  openGraph: {
    title: 'FinPrint Exit Tax Calculator for UK Financial Advisers | Wrigital',
    description:
      'Estimate net proceeds after CGT, BADR eligibility, and concentration risk for HNW business owner clients.',
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
