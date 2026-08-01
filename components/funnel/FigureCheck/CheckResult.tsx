'use client';

import { useEffect, useRef } from 'react';
import { track } from '@/lib/analytics';
import { useFigureCheck } from './FigureCheckProvider';
import { FindingRowDesktop, FindingRowMobile } from './FindingRow';
import { ReportCapture } from './ReportCapture';
import { Section } from '@/components/funnel/Section';

export function CheckResult() {
  const { status, result } = useFigureCheck();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (status === 'done' && result) {
      headingRef.current?.focus();
    }
  }, [status, result]);

  if (status !== 'done' || !result) return null;

  const figuresBehind = result.findings.filter(
    (f) => f.verdict === 'behind',
  ).length;
  const figuresUnconfirmed = result.findings.filter(
    (f) => f.verdict === 'unconfirmed',
  ).length;
  const figuresConfirmed = result.findings.filter(
    (f) => f.verdict === 'current',
  ).length;

  const summaryParts = [
    `${result.pagesScanned} pages read`,
    `${result.figuresFound} figures checked`,
    `${figuresConfirmed} figures confirmed`,
  ];
  if (figuresBehind > 0) {
    summaryParts.push(`${figuresBehind} behind`);
  }
  if (figuresUnconfirmed > 0) {
    summaryParts.push(`${figuresUnconfirmed} not confirmed`);
  }

  return (
    <Section label="Result" id="check-result">
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="font-mono text-display-md outline-none"
      >
        {summaryParts.join('. ')}.
      </h2>

      {result.findings.length > 0 && (
        <div className="mt-8" aria-live="polite">
          <div className="md:hidden">
            {result.findings.map((f, i) => (
              <FindingRowMobile key={f.id} finding={f} index={i} />
            ))}
          </div>

          <table className="hidden w-full text-left md:table">
            <thead>
              <tr className="border-b border-rule font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-soft">
                <th className="py-3 pr-4 font-normal">Figure</th>
                <th className="py-3 pr-4 font-normal">On your page</th>
                <th className="py-3 pr-4 font-normal">Published value</th>
                <th className="py-3 font-normal">Source</th>
              </tr>
            </thead>
            <tbody>
              {result.findings.map((f, i) => (
                <FindingRowDesktop key={f.id} finding={f} index={i} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ReportCapture />

      <p className="mt-10 border-t border-rule pt-8">
        <a
          href="/RAG_Offer/the-assistant"
          onClick={() => track('assistant_link_clicked', {})}
          className="inline-block font-display text-display-md font-semibold text-source underline decoration-2 underline-offset-4 transition-opacity hover:opacity-80"
        >
          This check is one small piece of what I build → The assistant
        </a>
      </p>
    </Section>
  );
}
