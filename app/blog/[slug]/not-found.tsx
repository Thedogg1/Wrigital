import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function BlogPostNotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-3xl font-bold text-[var(--color-primary)]">
          Post not found
        </h1>
        <p className="mt-4 text-[var(--color-text-secondary)]">
          The blog post you are looking for does not exist.
        </p>
        <Link
          href="/blog"
          className="mt-8 inline-block text-[var(--color-primary)] underline"
        >
          Back to blog
        </Link>
      </main>
      <Footer />
    </>
  );
}
