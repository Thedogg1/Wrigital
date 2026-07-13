'use client';

import { useMemo, useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import CalculatorResultsTabs from '@/components/exit-snapshot/CalculatorResultsTabs';
import ExitSnapshotMethodologyPanel from '@/components/exit-snapshot/ExitSnapshotMethodologyPanel';
import { buildUkMethodology } from '@/lib/exit-snapshot/buildUkMethodology';
import { formatCurrency } from '@/lib/validation/validation-library-core';
import type { SnapshotCalculated, MatchedNarrativeRule, SnapshotFormData } from '@/lib/exit-snapshot/types';

interface LandingExitPreviewProps {
  inputs: SnapshotFormData;
  calculated: SnapshotCalculated;
  matchedRules: MatchedNarrativeRule[];
  inputsStale?: boolean;
  onRequestFullReport: () => void;
}

export default function LandingExitPreview({
  inputs,
  calculated,
  matchedRules,
  inputsStale = false,
  onRequestFullReport,
}: LandingExitPreviewProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'methodology'>('summary');
  const methodology = useMemo(
    () => buildUkMethodology(inputs, calculated),
    [inputs, calculated],
  );

  const narrativePreview = matchedRules
    .filter((r) => r.rule.category !== 'planning')
    .slice(0, 2);

  const badrLabel = calculated.badrEligible
    ? 'Meets stated tests'
    : 'Does not meet stated tests';

  return (
    <Card>
      {inputsStale && (
        <p
          className='mb-6 rounded-lg border border-[var(--color-warning)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-secondary)]'
          role='status'
        >
          These results are from your previous inputs. Click Update Report above to refresh them.
        </p>
      )}
      <h2 className='text-2xl font-semibold text-[var(--color-primary)] mb-2'>
        Your Client&apos;s Exit Tax Estimate
      </h2>

      <CalculatorResultsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'summary' ? (
        <>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-8'>
            <Metric label='Net proceeds after CGT' value={formatCurrency(calculated.netProceeds)} highlight />
            <Metric
              label='BADR eligibility'
              value={badrLabel}
              valueClassName={calculated.badrEligible ? 'text-[var(--color-success)]' : 'text-[var(--color-warning)]'}
            />
            <Metric label='Concentration risk' value={`${calculated.businessValueShareOfNetWorth}%`} />
          </div>

          <div className='mb-6'>
            <h3 className='text-lg font-semibold text-[var(--color-text-primary)] mb-3'>
              Executive Summary
            </h3>
            <p className='text-[var(--color-text-secondary)]'>
              Based on your inputs, estimated net proceeds after tax are{' '}
              <strong className='text-[var(--color-primary)]'>
                {formatCurrency(calculated.netProceeds)}
              </strong>
              . Tax year {calculated.taxYear}, calculated {calculated.calculationDate}.
            </p>
          </div>

          {narrativePreview.length > 0 && (
            <div className='mb-6'>
              <h3 className='text-lg font-semibold text-[var(--color-text-primary)] mb-3'>
                Observations
              </h3>
              <div className='space-y-3'>
                {narrativePreview.map((r) => (
                  <div
                    key={r.rule.id}
                    className='p-4 bg-[var(--color-surface)] border-l-4 border-[var(--color-info)] rounded-r-lg text-sm text-[var(--color-text-secondary)]'
                  >
                    {r.renderedText}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <ExitSnapshotMethodologyPanel methodology={methodology} />
      )}

      <div className='border-t border-[var(--color-border-subtle)] pt-6 space-y-4 mt-8'>
        <p className='text-[var(--color-text-primary)] font-semibold leading-relaxed'>
          Receive your extended exit tax report and a sample intelligence report, then book a
          discovery call to find out more.
        </p>
        <Button onClick={onRequestFullReport} className='w-full sm:w-auto'>
          Email My Reports
        </Button>
      </div>
    </Card>
  );
}

function Metric({
  label,
  value,
  highlight,
  valueClassName,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  valueClassName?: string;
}) {
  return (
    <div className='p-4 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border-subtle)]'>
      <div className='text-xs text-[var(--color-text-secondary)] mb-1'>{label}</div>
      <div
        className={`text-lg font-semibold ${
          valueClassName ?? (highlight ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-primary)]')
        }`}
      >
        {value}
      </div>
    </div>
  );
}
