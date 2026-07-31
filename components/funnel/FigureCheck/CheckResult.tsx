'use client';

import { useEffect, useRef } from 'react';
import { track } from '@/lib/analytics';
import { useFigureCheck } from './FigureCheckProvider';
import { FindingRowDesktop, FindingRowMobile } from './FindingRow';
import { ReportCapture } from './ReportCapture';
import { Section } from '@/components/funnel/Section';

export function CheckResult() {
  const { status, domain, result } = useFigureCheck();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (status === 'done' && result) {
      headingRef.current?.focus();
    }
  }, [status, result]);

  if (status !== 'done' || !result) return null;

  const summary =
    result.behindCount > 0
      ? `${result.figuresFound} figures checked on ${domain}. ${result.behindCount} behind the current published value.`
      : `${result.figuresFound} figures checked on ${domain}. Every figure matches the current published value.`;

  return (
    <Section label="Result" id="check-result">
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="font-mono text-display-md outline-none"
      >
        {summary}
      </h2>

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

      <ReportCapture />

      <p className="mt-8">
        <a
          href="/the-assistant"
          onClick={() => track('assistant_link_clicked', {})}
          className="font-mono text-[0.8125rem] text-source underline underline-offset-4"
        >
          This check is one small piece of what I build → The assistant
        </a>
      </p>
    </Section>
  );
}
