'use client';

import type { Finding, Verdict } from '@/lib/check-types';

const VERDICT_LABEL: Record<Verdict, string> = {
  current: 'Current',
  behind: 'Behind',
  unconfirmed: 'Not confirmed',
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
          <dt className="text-sm text-ink-soft">On your page</dt>
          <dd
            className={`mt-1 tabular-nums ${finding.verdict === 'behind' ? 'text-stale' : ''}`}
          >
            {finding.quotedValue}
            {finding.verdict === 'behind' && (
              <span className="ml-2 text-sm text-stale">Behind</span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-ink-soft">Published value</dt>
          <dd
            className={`mt-1 tabular-nums ${finding.verdict === 'current' ? 'text-verified' : ''}`}
          >
            {finding.publishedValue}
            {finding.verdict === 'current' && (
              <span className="ml-2 text-sm text-verified">Current</span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-ink-soft">Source</dt>
          <dd className="mt-1">
            <a
              href={finding.pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-source underline underline-offset-4"
            >
              {finding.pageKind === 'blog' ? 'Blog post' : 'Your page'}
            </a>
            {' · '}
            <a
              href={finding.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-source underline underline-offset-4"
            >
              {finding.sourceHost}
            </a>
          </dd>
        </div>
        <div>
          <span className="text-sm text-ink-soft">
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
        className={`py-4 pr-4 align-top tabular-nums ${finding.verdict === 'behind' ? 'text-stale' : ''}`}
      >
        {finding.quotedValue}
        {finding.verdict === 'behind' && (
          <span className="ml-2 text-sm">Behind</span>
        )}
      </td>
      <td
        className={`py-4 pr-4 align-top tabular-nums ${finding.verdict === 'current' ? 'text-verified' : ''}`}
      >
        {finding.publishedValue}
        {finding.verdict === 'current' && (
          <span className="ml-2 text-sm">Current</span>
        )}
      </td>
      <td className="py-4 align-top">
        <a
          href={finding.pageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-source underline underline-offset-4"
        >
          {finding.pageKind === 'blog' ? 'Blog post' : 'Your page'}
        </a>
        <a
          href={finding.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 block text-source underline underline-offset-4"
        >
          {finding.sourceHost}
        </a>
        <span className="mt-2 block text-sm text-ink-soft">
          {VERDICT_LABEL[finding.verdict]}
        </span>
      </td>
    </tr>
  );
}
