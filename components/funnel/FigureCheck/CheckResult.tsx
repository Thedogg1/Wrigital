'use client';

import { useEffect, useRef } from 'react';
import { useFigureCheck } from './FigureCheckProvider';
import { FindingRowDesktop, FindingRowMobile } from './FindingRow';
import { ReportCapture } from './ReportCapture';
import { ForwardCta } from '@/components/funnel/ForwardCta';
import { Section } from '@/components/funnel/Section';
import { CHECK_FORWARD } from '@/content/copy';

export function CheckResult() {
  const { status, result } = useFigureCheck();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (status === 'done' && result) {
      headingRef.current?.focus();
    }
  }, [status, result]);

  if (status !== 'done' || !result) return null;

  const figuresConfirmed = result.findings.filter(
    (f) => f.verdict === 'current',
  ).length;
  const displayFindings = result.findings.filter(
    (f) => f.verdict === 'behind' || f.verdict === 'unconfirmed',
  );

  const countsLine = `${result.pagesScanned} pages read. ${result.figuresFound} figures checked. ${figuresConfirmed} figures confirmed.`;

  return (
    <>
      <Section label="Result" id="check-result">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="text-display-md outline-none"
        >
          {countsLine}
        </h2>

        {displayFindings.length > 0 && (
          <div className="mt-8" aria-live="polite">
            <div className="md:hidden">
              {displayFindings.map((f, i) => (
                <FindingRowMobile key={f.id} finding={f} index={i} />
              ))}
            </div>

            <table className="hidden w-full text-left md:table">
              <thead>
                <tr className="border-b border-rule text-sm text-ink-soft">
                  <th className="py-3 pr-4 font-medium">Figure</th>
                  <th className="py-3 pr-4 font-medium">On your page</th>
                  <th className="py-3 pr-4 font-medium">Published value</th>
                  <th className="py-3 font-medium">Source</th>
                </tr>
              </thead>
              <tbody>
                {displayFindings.map((f, i) => (
                  <FindingRowDesktop key={f.id} finding={f} index={i} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        <ReportCapture />
      </Section>

      <ForwardCta
        heading={CHECK_FORWARD.heading}
        body={[...CHECK_FORWARD.body]}
        label={CHECK_FORWARD.label}
        href="/RAG_Offer/how-i-stop-hallucinations"
        from="website-figure-check-result"
      />
    </>
  );
}
