import * as React from 'react';
import type { CheckResult, Verdict } from '@/lib/check-types';
import { SITE } from '@/lib/site';
import { siteUrl } from '@/lib/site';

const VERDICT_STYLE: Record<Verdict, { label: string; color: string }> = {
  current: { label: 'Current', color: '#146B52' },
  behind: { label: 'Behind', color: '#8A4B08' },
  unconfirmed: { label: 'Not confirmed', color: '#46586A' },
};

export function FigureCheckRecord({ result }: { result: CheckResult }) {
  const date = new Date(result.finishedAt).toLocaleDateString('en-GB');
  const checkUrl = `${siteUrl}/?domain=${encodeURIComponent(result.domain)}`;

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 600, margin: '0 auto', color: '#0E1A26' }}>
      <p style={{ fontSize: 22, fontWeight: 600 }}>Wrigital</p>
      <p style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, color: '#46586A' }}>
        Figure check record / {result.domain} / {date}
      </p>

      <p style={{ marginTop: 24 }}>
        {result.figuresFound} figures found across {result.pagesScanned} pages.{' '}
        {result.behindCount} behind the current published value.
      </p>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 24, fontSize: 14 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #D9DEE3', padding: '8px 4px' }}>Figure</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #D9DEE3', padding: '8px 4px' }}>Your page</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #D9DEE3', padding: '8px 4px' }}>Published</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #D9DEE3', padding: '8px 4px' }}>Source</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #D9DEE3', padding: '8px 4px' }}>Verdict</th>
          </tr>
        </thead>
        <tbody>
          {result.findings.map((f) => {
            const v = VERDICT_STYLE[f.verdict];
            return (
              <tr key={f.id}>
                <td style={{ borderBottom: '1px solid #D9DEE3', padding: '8px 4px' }}>{f.label}</td>
                <td style={{ borderBottom: '1px solid #D9DEE3', padding: '8px 4px', fontFamily: 'ui-monospace, monospace' }}>{f.quotedValue}</td>
                <td style={{ borderBottom: '1px solid #D9DEE3', padding: '8px 4px', fontFamily: 'ui-monospace, monospace' }}>{f.publishedValue}</td>
                <td style={{ borderBottom: '1px solid #D9DEE3', padding: '8px 4px' }}>
                  <a href={f.sourceUrl}>{f.sourceHost}</a>
                </td>
                <td style={{ borderBottom: '1px solid #D9DEE3', padding: '8px 4px', color: v.color, fontFamily: 'ui-monospace, monospace' }}>
                  {v.label}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2 style={{ marginTop: 32, fontSize: 18 }}>Pages checked and found current</h2>
      {result.pagesConfirmedClean.length === 0 ? (
        <p>No pages were confirmed clean without findings.</p>
      ) : (
        <ul>
          {result.pagesConfirmedClean.map((p) => (
            <li key={p.url}>
              <a href={p.url}>{p.title || p.url}</a>
            </li>
          ))}
        </ul>
      )}

      <p style={{ marginTop: 24, color: '#46586A', fontSize: 14 }}>
        This checks whether published figures are current. The check doesn&apos;t
        assess compliance, suitability or financial promotion rules, and
        doesn&apos;t replace anyone&apos;s review. Your firm remains responsible
        for its own content.
      </p>

      <h2 style={{ marginTop: 32, fontSize: 18 }}>
        Thirty minutes to define your AI compliance blueprint
      </h2>
      <p>
        <a href={`${siteUrl}/verified-answers`}>What verification actually is</a>
      </p>
      <p>
        <a href={SITE.calendly}>Book a call</a>
      </p>

      <p style={{ marginTop: 32, fontSize: 12, color: '#46586A' }}>
        {SITE.name}, company number {SITE.companyNumber}. {SITE.registeredAddress}.{' '}
        <a href={`${siteUrl}/privacy`}>Privacy</a>
      </p>
      <p style={{ fontSize: 12, color: '#46586A' }}>
        You asked for this record at {checkUrl} on {date}.
      </p>
    </div>
  );
}

export default FigureCheckRecord;
