import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-4xl font-bold text-[var(--color-primary)]">
          Page not found
        </h1>
        <p className="mt-4 text-[var(--color-text-secondary)]">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block text-[var(--color-primary)] underline"
        >
          Return home
        </Link>
      </main>
      <Footer />
    </>
  );
}
