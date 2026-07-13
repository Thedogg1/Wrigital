'use client';

import Card from '@/components/Card';
import Button from '@/components/Button';
import { formatCurrency } from '@/lib/validation/validation-library-core';
import type { SnapshotCalculated } from '@/lib/exit-snapshot/types';
import type { MatchedNarrativeRule } from '@/lib/exit-snapshot/types';

interface ExitSnapshotPreviewProps {
  calculated: SnapshotCalculated;
  matchedRules: MatchedNarrativeRule[];
  previewHtml: string;
  onDownload: () => void;
  downloadDisabled: boolean;
  downloadDisabledReason?: string;
  isSignedIn: boolean;
  isDownloading?: boolean;
}

export default function ExitSnapshotPreview({
  calculated,
  matchedRules,
  previewHtml,
  onDownload,
  downloadDisabled,
  downloadDisabledReason,
  isSignedIn,
  isDownloading = false,
}: ExitSnapshotPreviewProps) {
  const narrativePreview = matchedRules
    .filter((r) => r.rule.category !== 'planning')
    .slice(0, 2);

  return (
    <div className='space-y-6'>
      <Card>
        <h2 className='text-2xl font-semibold text-[var(--color-primary)] mb-6'>
          Exit Snapshot Preview
        </h2>

        <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-8'>
          <Metric label='Exit value' value={formatCurrency(calculated.equityValue)} />
          <Metric label='Capital gain' value={formatCurrency(calculated.grossCapitalGain)} />
          <Metric label='Total tax' value={formatCurrency(calculated.totalTaxLiability)} />
          <Metric label='Net proceeds' value={formatCurrency(calculated.netProceeds)} highlight />
          <Metric label='Effective tax rate' value={`${calculated.effectiveTaxRate}%`} />
          <Metric label='Concentration' value={`${calculated.businessValueShareOfNetWorth}%`} />
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

        <p className='text-sm text-[var(--color-text-secondary)] italic mb-6'>
          Download the full report for complete CGT breakdown, BADR checks, planning topics, and disclaimers.
        </p>
        <div className='flex flex-col sm:flex-row gap-4 items-start'>
          <Button onClick={onDownload} disabled={downloadDisabled} className='w-full sm:w-auto'>
            {isDownloading ? 'Generating PDF…' : 'Download full report (PDF)'}
          </Button>
          {isSignedIn && (
            <span className='text-sm text-[var(--color-success)] self-center'>
              Signed in — download ready
            </span>
          )}
        </div>
        {downloadDisabled && downloadDisabledReason && (
          <p className='text-sm text-[var(--color-warning)] mt-3'>{downloadDisabledReason}</p>
        )}
      </Card>

      {/* Hidden iframe for HTML preview rendering if needed */}
      <div
        className='sr-only'
        aria-hidden='true'
        dangerouslySetInnerHTML={{ __html: previewHtml }}
      />
    </div>
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
