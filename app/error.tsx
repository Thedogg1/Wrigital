'use client';

import { contactEmail } from '@/lib/email/config';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-3xl font-bold text-[var(--color-primary)]">
        Something went wrong
      </h1>
      <p className="mt-4 text-[var(--color-text-secondary)]">
        Please try again. If the problem persists, contact {contactEmail}.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-lg bg-[var(--color-primary)] px-6 py-3 text-[var(--color-text-inverse)]"
      >
        Try again
      </button>
    </main>
  );
}
