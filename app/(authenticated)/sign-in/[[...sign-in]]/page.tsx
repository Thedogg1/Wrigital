import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

export default function StudioSignInPage() {
  const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-surface)] px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-2xl font-bold text-[var(--color-primary)]">
            Sign in to Wrigital Studio
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Authorised users only. Sign in to manage blog posts.
          </p>
        </div>

        {clerkConfigured ? (
          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-in"
            fallbackRedirectUrl="/studio"
            forceRedirectUrl="/studio"
          />
        ) : (
          <div className="rounded-lg border border-[var(--color-warning)] bg-amber-50 p-6 text-center">
            <p className="mb-4 text-sm text-[var(--color-text-secondary)]">
              Clerk is not configured. Add the following to your environment:
            </p>
            <pre className="overflow-x-auto rounded border bg-white p-4 text-left text-xs">
              {`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/studio
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/studio`}
            </pre>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-[var(--color-text-secondary)]">
          <Link href="/" className="text-[var(--color-primary)] hover:underline">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
