'use client';

import { FormEvent, ReactNode, useMemo, useState } from 'react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  actionableFindings,
  formatGbp,
  historicFindings,
} from '@/lib/figure-check/compare';
import type { Finding, PageRead } from '@/lib/figure-check/types';

type Phase = 'entry' | 'scanning' | 'result';

type ScanResponse = {
  scanId: string;
  domain: string;
  pagesScanned: number;
  pagesSkipped: { url: string; reason: string }[];
  truncated: boolean;
  counts: {
    figuresFound: number;
    current: number;
    stale: number;
    check: number;
  };
  findings: Finding[];
  pagesRead: PageRead[];
  scannedAt: string;
};

const HOW_IT_WORKS = [
  'Enter your firm’s public website URL.',
  'We crawl public pages and collect published tax and allowance figures.',
  'Each figure is compared with the current GOV.UK value in our curated table.',
  'Findings appear on screen in full. Email yourself a dated record of every page and figure checked — with an optional re-check after the autumn Budget.',
];

function highlightNumber(sentence: string, numberFound: number): ReactNode {
  const candidates = [
    formatGbp(numberFound),
    `£${numberFound.toLocaleString('en-GB')}`,
    `£${numberFound}`,
    String(numberFound),
  ];
  for (const c of candidates) {
    const idx = sentence.indexOf(c);
    if (idx >= 0) {
      return (
        <>
          {sentence.slice(0, idx)}
          <mark className="bg-[var(--color-surface)] font-semibold text-[var(--color-primary)]">
            {c}
          </mark>
          {sentence.slice(idx + c.length)}
        </>
      );
    }
  }
  return sentence;
}

function FindingCard({ finding }: { finding: Finding }) {
  return (
    <Card className="border-[var(--color-border-strong)] shadow-none">
      <p className="text-xs font-semibold tracking-wide text-[var(--color-primary)] uppercase">
        {finding.classification}
        {finding.staleTaxYear ? ` · matches ${finding.staleTaxYear}` : ''}
      </p>
      <p className="mt-3 text-sm break-all">
        <span className="text-[var(--color-text-secondary)]">Page: </span>
        <a
          href={finding.pageUrl}
          className="text-[var(--color-primary)] underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring-color)]"
          target="_blank"
          rel="noopener noreferrer"
        >
          {finding.pageUrl}
        </a>
      </p>
      <p className="mt-3 text-base leading-relaxed">
        “{highlightNumber(finding.sentence, finding.numberFound)}”
      </p>
      <dl className="mt-4 space-y-2 text-sm">
        <div>
          <dt className="text-[var(--color-text-secondary)]">Figure</dt>
          <dd className="font-semibold">{finding.figureLabel}</dd>
        </div>
        <div>
          <dt className="text-[var(--color-text-secondary)]">Number found</dt>
          <dd className="font-semibold">{formatGbp(finding.numberFound)}</dd>
        </div>
        <div>
          <dt className="text-[var(--color-text-secondary)]">Current value</dt>
          <dd className="font-semibold">{formatGbp(finding.currentValue)}</dd>
        </div>
        <div>
          <dt className="text-[var(--color-text-secondary)]">Matched keyword</dt>
          <dd>
            “{finding.matchedKeyword}” ({finding.matchLocation})
          </dd>
        </div>
        <div>
          <dt className="text-[var(--color-text-secondary)]">Source</dt>
          <dd>
            <a
              href={finding.sourceUrl}
              className="text-[var(--color-primary)] underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring-color)]"
              target="_blank"
              rel="noopener noreferrer"
            >
              {finding.sourceLabel}
            </a>
          </dd>
        </div>
      </dl>
    </Card>
  );
}

export default function FigureCheckFlow() {
  const [phase, setPhase] = useState<Phase>('entry');
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('Preparing scan…');
  const [pagesScanned, setPagesScanned] = useState(0);
  const [scan, setScan] = useState<ScanResponse | null>(null);
  const [email, setEmail] = useState('');
  const [firmName, setFirmName] = useState('');
  const [budgetRecheck, setBudgetRecheck] = useState(true);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const actionable = useMemo(
    () => (scan ? actionableFindings(scan.findings) : []),
    [scan],
  );
  const historic = useMemo(
    () => (scan ? historicFindings(scan.findings) : []),
    [scan],
  );
  const notCurrent = scan
    ? scan.counts.stale + scan.counts.check
    : 0;

  async function onScan(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSentTo(null);
    setSendError(null);
    setScan(null);
    setBudgetRecheck(true);
    setPhase('scanning');
    setStatus('Fetching public pages…');
    setPagesScanned(0);

    try {
      const res = await fetch('/api/figure-check/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!res.ok || !res.body) {
        let message = 'The scan could not be completed.';
        try {
          const data = (await res.json()) as { error?: string };
          if (data.error) message = data.error;
        } catch {
          // keep default
        }
        setError(message);
        setPhase('entry');
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let gotResult = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          let event: {
            type: string;
            pagesScanned?: number;
            status?: string;
            error?: string;
            truncated?: boolean;
          } & Partial<ScanResponse>;
          try {
            event = JSON.parse(trimmed);
          } catch {
            continue;
          }

          if (event.type === 'progress') {
            if (typeof event.pagesScanned === 'number') {
              setPagesScanned(event.pagesScanned);
            }
            if (event.status) setStatus(event.status);
          } else if (event.type === 'error') {
            setError(event.error ?? 'The scan could not be completed.');
            setPhase('entry');
            return;
          } else if (event.type === 'result') {
            gotResult = true;
            const data = event as unknown as ScanResponse;
            setScan(data);
            setPagesScanned(data.pagesScanned);
            setStatus(
              data.truncated
                ? `Reached the time limit after ${data.pagesScanned} pages — showing partial results.`
                : `Finished scanning ${data.pagesScanned} pages.`,
            );
            setPhase('result');
          }
        }
      }

      if (!gotResult) {
        setError('The scan ended without a result. Please try again.');
        setPhase('entry');
      }
    } catch {
      setError(
        'Network error while scanning. Check your connection and try again.',
      );
      setPhase('entry');
    }
  }

  async function onSend(e: FormEvent) {
    e.preventDefault();
    if (!scan) return;
    setSendError(null);
    setSending(true);
    try {
      const res = await fetch('/api/figure-check/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scanId: scan.scanId,
          email,
          firmName: firmName.trim() || undefined,
          budgetRecheck,
        }),
      });
      const data = (await res.json()) as { sent?: boolean; error?: string };
      if (!res.ok) {
        setSendError(data.error ?? 'We could not send the report.');
        return;
      }
      setSentTo(email.trim());
    } catch {
      setSendError('Network error while sending. Please try again.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <p className="mb-3 text-xs font-semibold tracking-[0.12em] text-[var(--color-accent)] uppercase">
        Stale Figure Check
      </p>
      <h1
        className="mb-6 text-[1.75rem] leading-tight text-[var(--color-primary)] sm:text-4xl"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        Check every published figure after each Budget and tax year change
      </h1>

      {phase === 'entry' && (
        <div>
          <p className="mb-4 text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
            When allowances move, adviser websites are often left quoting last
            year’s numbers. Paste your site URL and we will find UK tax,
            allowance, and threshold figures in your public copy, then compare
            each one with the current value.
          </p>
          <p className="mb-8 text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
            Findings appear here in full — page, sentence, and GOV.UK source.
            Optionally email yourself a dated record of every page and figure
            checked, with a re-check after the autumn Budget.
          </p>

          <form onSubmit={onScan} className="space-y-4">
            <div>
              <Label htmlFor="figure-check-url">Website URL</Label>
              <Input
                id="figure-check-url"
                name="url"
                type="text"
                inputMode="url"
                autoComplete="url"
                placeholder="https://www.yourfirm.co.uk"
                value={url}
                onChange={(ev) => setUrl(ev.target.value)}
                required
                className="mt-2"
              />
            </div>
            {error && (
              <p
                role="alert"
                className="border border-[var(--color-critical)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-critical)]"
              >
                {error}
              </p>
            )}
            <Button type="submit" className="w-full sm:w-auto">
              Run Stale Figure Check
            </Button>
          </form>

          <ol className="mt-12 space-y-3 border-t border-[var(--color-border-subtle)] pt-8">
            <li className="mb-2 text-sm font-semibold tracking-wide text-[var(--color-primary)] uppercase">
              How it works
            </li>
            {HOW_IT_WORKS.map((step, i) => (
              <li
                key={step}
                className="flex gap-3 text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base"
              >
                <span className="font-semibold text-[var(--color-primary)]">
                  {i + 1}.
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          <p className="mt-10 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            This is a factual currency check of published figures only. It is not
            a compliance, suitability, or financial-promotion review. Your firm
            remains responsible for its own content.
          </p>
        </div>
      )}

      {phase === 'scanning' && (
        <div
          aria-live="polite"
          aria-busy="true"
          className="border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-5 py-8"
        >
          <p className="text-sm tracking-wide text-[var(--color-primary)] uppercase">
            Scanning
          </p>
          <p
            className="mt-3 text-3xl text-[var(--color-primary)]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {pagesScanned > 0 ? pagesScanned : '…'}
            <span className="ml-2 text-base text-[var(--color-text-secondary)]">
              pages scanned
            </span>
          </p>
          <p className="mt-4 text-base text-[var(--color-text-secondary)]">
            {status}
          </p>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            We fetch public HTML only — no login, no sitemap of private areas,
            and no external data APIs during the scan.
          </p>
        </div>
      )}

      {phase === 'result' && scan && (
        <div aria-live="polite" className="space-y-8">
          <div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Results for{' '}
              <strong className="text-[var(--color-primary)]">{scan.domain}</strong>
              {scan.truncated ? ' (partial — time limit reached)' : ''}
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="border border-[var(--color-border-subtle)] px-3 py-4 text-center">
                <p
                  className="text-3xl text-[var(--color-primary)] sm:text-4xl"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {scan.pagesRead?.length ?? scan.pagesScanned}
                </p>
                <p className="mt-1 text-xs tracking-wide text-[var(--color-text-secondary)] uppercase">
                  Pages read
                </p>
              </div>
              <div className="border border-[var(--color-border-subtle)] px-3 py-4 text-center">
                <p
                  className="text-3xl text-[var(--color-primary)] sm:text-4xl"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {scan.counts.figuresFound}
                </p>
                <p className="mt-1 text-xs tracking-wide text-[var(--color-text-secondary)] uppercase">
                  Figures checked
                </p>
              </div>
              <div className="border border-[var(--color-border-subtle)] px-3 py-4 text-center">
                <p
                  className="text-3xl text-[var(--color-primary)] sm:text-4xl"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {notCurrent}
                </p>
                <p className="mt-1 text-xs tracking-wide text-[var(--color-text-secondary)] uppercase">
                  Not current
                </p>
              </div>
            </div>
          </div>

          {actionable.length > 0 ? (
            <div className="space-y-4">
              <h2
                className="text-xl text-[var(--color-primary)]"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Figures to review
              </h2>
              {actionable.map((f, i) => (
                <FindingCard
                  key={`${f.pageUrl}-${f.figureId}-${f.numberFound}-${i}`}
                  finding={f}
                />
              ))}
            </div>
          ) : (
            <div className="border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-5 py-6">
              <p
                className="text-xl text-[var(--color-primary)]"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Every figure found was current
              </p>
              <p className="mt-3 text-base leading-relaxed text-[var(--color-text-secondary)]">
                {scan.counts.figuresFound === 0
                  ? 'We did not find any of the tracked UK tax, allowance, or threshold figures in the pages we read. That can still be useful coverage to keep on file.'
                  : `All ${scan.counts.figuresFound} figure${scan.counts.figuresFound === 1 ? '' : 's'} we matched against the curated table matched the current published value. That is a good outcome.`}
              </p>
            </div>
          )}

          {historic.length > 0 && (
            <details className="border border-[var(--color-border-subtle)] px-4 py-3">
              <summary className="cursor-pointer text-sm font-semibold text-[var(--color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring-color)]">
                Likely-intentional historic mentions ({historic.length})
              </summary>
              <ul className="mt-4 space-y-4">
                {historic.map((f, i) => (
                  <li
                    key={`h-${f.pageUrl}-${f.figureId}-${f.numberFound}-${i}`}
                    className="border-t border-[var(--color-border-subtle)] pt-4 text-sm"
                  >
                    <FindingCard finding={f} />
                  </li>
                ))}
              </ul>
            </details>
          )}

          {sentTo ? (
            <p
              role="status"
              className="border border-[var(--color-success)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-primary)]"
            >
              Record sent to <strong>{sentTo}</strong>
              {budgetRecheck
                ? ', including your autumn Budget re-check preference.'
                : '.'}
            </p>
          ) : (
            <form
              onSubmit={onSend}
              className="space-y-4 border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5"
            >
              {actionable.length > 0 ? (
                <div className="space-y-4 text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
                  <p className="text-[var(--color-text-primary)]">
                    One wrong figure doesn&apos;t tell you the other{' '}
                    {scan.pagesRead?.length ?? scan.pagesScanned} pages are
                    right.
                  </p>
                  <p>
                    You now know about this one. The question it raises is the
                    one you can&apos;t answer from this screen: what about
                    everything else?
                  </p>
                  <p>
                    The emailed record lists every page read and every figure
                    found, each shown against the current published value with
                    the gov.uk link that confirms it. That&apos;s what lets you
                    stop looking. Without it you&apos;re back to checking the
                    rest of the site by hand, which is the job this was meant to
                    save you.
                  </p>
                  <p>
                    It&apos;s also the version you can forward. You&apos;re
                    probably not the person editing the website, and
                    &quot;change the CGT figure&quot; tends to come back with
                    questions or get changed to the wrong number. Each line
                    carries its own source, so whoever makes the edit can verify
                    it without asking you.
                  </p>
                  <p>
                    Tick the box below and I&apos;ll run the same check again
                    after the autumn Budget and email you the results. Figures
                    move in November and nothing on your site will tell you when
                    they have.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
                  <p className="text-[var(--color-text-primary)]">
                    {scan.counts.figuresFound > 0
                      ? 'Every figure we found was current. The emailed record is the confirmation.'
                      : "We didn't find any of the tracked figures on the pages we read. The emailed record is still worth keeping."}
                  </p>
                  <p>
                    It lists every page read and every figure found, each shown
                    against the current published value with the gov.uk link that
                    confirms it. That&apos;s what lets you stop looking — and
                    keep a dated note that the site was current when you checked.
                    Without it you&apos;re back to checking the rest of the site
                    by hand, which is the job this was meant to save you.
                  </p>
                  <p>
                    It&apos;s also the version you can forward. You&apos;re
                    probably not the person editing the website. Each line
                    carries its own source, so whoever makes an edit can verify
                    it without asking you.
                  </p>
                  <p>
                    Tick the box below and I&apos;ll run the same check again
                    after the autumn Budget and email you the results. Figures
                    move in November and nothing on your site will tell you when
                    they have.
                  </p>
                </div>
              )}
              <div>
                <Label htmlFor="figure-check-email">Work email</Label>
                <Input
                  id="figure-check-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="figure-check-firm">Firm name (optional)</Label>
                <Input
                  id="figure-check-firm"
                  name="firmName"
                  type="text"
                  autoComplete="organization"
                  value={firmName}
                  onChange={(ev) => setFirmName(ev.target.value)}
                  className="mt-2"
                />
              </div>
              <div className="flex items-start gap-3">
                <input
                  id="figure-check-recheck"
                  name="budgetRecheck"
                  type="checkbox"
                  checked={budgetRecheck}
                  onChange={(ev) => setBudgetRecheck(ev.target.checked)}
                  className="mt-1 size-4 accent-[var(--color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring-color)]"
                />
                <Label
                  htmlFor="figure-check-recheck"
                  className="text-sm leading-snug font-normal text-[var(--color-text-primary)]"
                >
                  Re-check my site after the autumn Budget
                </Label>
              </div>
              {sendError && (
                <p
                  role="alert"
                  className="border border-[var(--color-critical)] px-3 py-2 text-sm text-[var(--color-critical)]"
                >
                  {sendError}
                </p>
              )}
              <Button type="submit" disabled={sending} className="w-full sm:w-auto">
                {sending ? 'Sending…' : 'Email the record'}
              </Button>
            </form>
          )}

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setPhase('entry');
                setError(null);
                setSentTo(null);
              }}
            >
              Check another URL
            </Button>
          </div>

          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            This is a factual currency check of published figures only. It is not
            a compliance review. Your firm remains responsible for its own content.
          </p>
        </div>
      )}
    </div>
  );
}
