'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFigureCheck } from './FigureCheckProvider';
import {
  CHECK_CAPTURE_CLEAN,
  CHECK_CAPTURE_FINDINGS,
  CHECK_CAPTURE_SHARED,
} from '@/content/copy';

export function ReportCapture() {
  const { domain, result, sendReport } = useFigureCheck();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [budgetRecheck, setBudgetRecheck] = useState(false);
  const [sending, setSending] = useState(false);
  const [failMessage, setFailMessage] = useState<string | null>(null);

  if (!result) return null;

  const hasFindings = result.findings.some(
    (f) => f.verdict === 'behind' || f.verdict === 'unconfirmed',
  );
  const copy = hasFindings ? CHECK_CAPTURE_FINDINGS : CHECK_CAPTURE_CLEAN;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSending(true);
    setFailMessage(null);
    const sendResult = await sendReport(email, budgetRecheck);
    setSending(false);
    if (!sendResult.ok) {
      setFailMessage(
        sendResult.message ??
          'The record did not send. Try again, or email hello@wrigital.com and I will send the record by hand.',
      );
      return;
    }
    sessionStorage.setItem('wrigital:lastEmail', email);
    router.push(
      `/RAG_Offer/thank-you?domain=${encodeURIComponent(domain)}`,
    );
  }

  return (
    <div className="mt-8 rounded border border-rule bg-card p-6">
      <h3 className="text-display-md">{copy.h3}</h3>
      <div className="mt-2 space-y-5 text-[1.0625rem] leading-[1.7] text-ink-soft">
        <p>{copy.p1}</p>
        <p>{copy.p2}</p>
      </div>
      <form onSubmit={onSubmit} className="mt-5">
        <label className="flex items-start gap-3 text-[1.0625rem] leading-[1.7]">
          <input
            type="checkbox"
            checked={budgetRecheck}
            onChange={(e) => setBudgetRecheck(e.target.checked)}
            disabled={sending}
            className="mt-1"
          />
          <span>{CHECK_CAPTURE_SHARED.budgetLabel}</span>
        </label>
        <label htmlFor="check-report-email" className="sr-only">
          Email address
        </label>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            id="check-report-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={sending}
            className="w-full rounded border border-rule bg-paper px-4 py-3 text-[0.9375rem]"
          />
          <button
            type="submit"
            disabled={sending}
            className="inline-flex shrink-0 items-center justify-center rounded bg-source px-6 py-3.5 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {CHECK_CAPTURE_SHARED.button}
          </button>
        </div>
      </form>
      <p className="mt-3 text-sm text-ink-soft">
        I will email the record and may follow up once about this check. No
        list, no newsletter. See the{' '}
        <a
          href="/RAG_Offer/privacy"
          className="underline underline-offset-4"
        >
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
