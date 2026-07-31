'use client';

import type { Finding, Verdict } from '@/lib/check-types';

const VERDICT_LABEL: Record<Verdict, string> = {
  current: 'CURRENT',
  behind: 'BEHIND',
  unconfirmed: 'NOT CONFIRMED',
};

export function FindingRowMobile({
  finding,
  index = 0,
}: {
  finding: Finding;
  index?: number;
}) {
  return (
    <div
      className="funnel-finding-row border-b border-rule bg-card py-5"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <dl className="space-y-3">
        <div>
          <dt className="sr-only">Figure</dt>
          <dd className="font-semibold">{finding.label}</dd>
        </div>
        <div>
          <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-soft">
            On your page
          </dt>
          <dd
            className={`mt-1 font-mono ${finding.verdict === 'behind' ? 'text-stale' : ''}`}
          >
            {finding.quotedValue}
            {finding.verdict === 'behind' && (
              <span className="ml-2 font-mono text-[11px] uppercase text-stale">
                Behind
              </span>
            )}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-soft">
            Published value
          </dt>
          <dd
            className={`mt-1 font-mono ${finding.verdict === 'current' ? 'text-verified' : ''}`}
          >
            {finding.publishedValue}
            {finding.verdict === 'current' && (
              <span className="ml-2 font-mono text-[11px] uppercase text-verified">
                Current
              </span>
            )}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-soft">
            Source
          </dt>
          <dd className="mt-1">
            <a
              href={finding.pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-source underline underline-offset-4"
            >
              Your page
            </a>
            {' · '}
            <a
              href={finding.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-source underline underline-offset-4"
            >
              {finding.sourceHost}
            </a>
          </dd>
        </div>
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">
            {VERDICT_LABEL[finding.verdict]}
          </span>
        </div>
      </dl>
    </div>
  );
}

export function FindingRowDesktop({
  finding,
  index = 0,
}: {
  finding: Finding;
  index?: number;
}) {
  return (
    <tr
      className="funnel-finding-row border-b border-rule bg-card"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <td className="py-4 pr-4 align-top font-semibold">{finding.label}</td>
      <td
        className={`py-4 pr-4 align-top font-mono ${finding.verdict === 'behind' ? 'text-stale' : ''}`}
      >
        {finding.quotedValue}
        {finding.verdict === 'behind' && (
          <span className="ml-2 text-[11px] uppercase">Behind</span>
        )}
      </td>
      <td
        className={`py-4 pr-4 align-top font-mono ${finding.verdict === 'current' ? 'text-verified' : ''}`}
      >
        {finding.publishedValue}
        {finding.verdict === 'current' && (
          <span className="ml-2 text-[11px] uppercase">Current</span>
        )}
      </td>
      <td className="py-4 align-top">
        <a
          href={finding.pageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-source underline underline-offset-4"
        >
          Your page
        </a>
        <a
          href={finding.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 block font-mono text-source underline underline-offset-4"
        >
          {finding.sourceHost}
        </a>
        <span className="mt-2 block font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">
          {VERDICT_LABEL[finding.verdict]}
        </span>
      </td>
    </tr>
  );
}
