'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFigureCheck } from './FigureCheckProvider';

export function ReportCapture() {
  const { domain, sendReport } = useFigureCheck();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [failMessage, setFailMessage] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSending(true);
    setFailMessage(null);
    const result = await sendReport(email);
    setSending(false);
    if (!result.ok) {
      setFailMessage(
        result.message ??
          'The record did not send. Try again, or email hello@wrigital.com and I will send the record by hand.',
      );
      return;
    }
    sessionStorage.setItem('wrigital:lastEmail', email);
    router.push(`/thank-you?domain=${encodeURIComponent(domain)}`);
  }

  return (
    <div className="mt-8 rounded border border-rule bg-card p-6">
      <h3 className="text-display-md">Send the full dated record</h3>
      <p className="mt-2 text-[1.0625rem] leading-[1.7] text-ink-soft">
        Every page read, every figure found, and the pages confirmed correct.
      </p>
      <form onSubmit={onSubmit} className="mt-5">
        <label htmlFor="check-report-email" className="sr-only">
          Email address
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="check-report-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={sending}
            className="w-full rounded border border-rule bg-paper px-4 py-3 font-mono text-[0.9375rem]"
            placeholder="you@yourfirm.co.uk"
          />
          <button
            type="submit"
            disabled={sending}
            className="inline-flex shrink-0 items-center justify-center rounded bg-source px-6 py-3.5 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            Email the record
          </button>
        </div>
      </form>
      <p className="mt-3 font-mono text-[0.8125rem] text-ink-soft">
        I will email the record and may follow up once about this check. No
        list, no newsletter. See the{' '}
        <a href="/privacy" className="underline underline-offset-4">
          privacy notice
        </a>
        .
      </p>
      {failMessage && (
        <p className="mt-3 text-stale" role="alert">
          {failMessage}
        </p>
      )}
    </div>
  );
}
