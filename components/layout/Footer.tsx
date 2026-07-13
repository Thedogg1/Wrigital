import Link from 'next/link';
import { calendlyUrl } from '@/lib/site';

const footerLinks = [
  { label: 'Consultancy', href: '/consultancy' },
  { label: 'FinPrint', href: '/client-conversion-financial-advisers' },
  {
    label: 'Client Intelligence Engine',
    href: '/client-intelligence-engine',
  },
  { label: 'Book an assessment', href: calendlyUrl, external: true },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--color-border-subtle)] bg-[var(--color-primary)] text-[var(--color-text-inverse)]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="mb-8 text-lg font-medium">
          Accountable AI for regulated firms.
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-3">
          {footerLinks.map((link) => (
            <li key={link.href}>
              {link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--color-text-inverse)]/90 underline-offset-4 hover:underline"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  href={link.href}
                  className="text-sm text-[var(--color-text-inverse)]/90 underline-offset-4 hover:underline"
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-wrap gap-6 border-t border-white/20 pt-8 text-sm text-[var(--color-text-inverse)]/80">
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
          <span>© Wrigital Ltd</span>
        </div>
      </div>
    </footer>
  );
}
