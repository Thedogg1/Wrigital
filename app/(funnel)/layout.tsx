import { Newsreader, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import { SiteFooter } from '@/components/funnel/SiteFooter';

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  axes: ['opsz'],
});
const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-plex-sans',
  display: 'swap',
});
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
});

export default function FunnelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`funnel min-h-screen antialiased ${newsreader.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:p-3"
      >
        Skip to content
      </a>
      <main id="main">{children}</main>
      <SiteFooter />
    </div>
  );
}
