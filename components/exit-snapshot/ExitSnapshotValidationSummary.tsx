'use client';

import type { ValidationError, ValidationWarning } from '@/lib/validation/validation-library-core';
import { getFieldLabel } from '@/lib/validation/validateSnapshotInputs';

interface ExitSnapshotValidationSummaryProps {
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export default function ExitSnapshotValidationSummary({
  errors,
  warnings,
}: ExitSnapshotValidationSummaryProps) {
  if (errors.length === 0 && warnings.length === 0) return null;

  return (
    <div className='space-y-4'>
      {errors.length > 0 && (
        <div className='rounded-lg border border-[var(--color-critical)] bg-red-50 p-4'>
          <h3 className='font-semibold text-[var(--color-critical)] mb-2'>
            {errors.length} error{errors.length !== 1 ? 's' : ''} — fix before generating report
          </h3>
          <ul className='space-y-1 text-sm'>
            {errors.map((e, i) => (
              <li key={`${e.field}-${i}`} className='text-[var(--color-text-primary)]'>
                <span className='font-medium'>{getFieldLabel(e.field)}:</span> {e.message}
              </li>
            ))}
          </ul>
        </div>
      )}
      {warnings.length > 0 && (
        <div className='rounded-lg border border-[var(--color-warning)] bg-amber-50 p-4'>
          <h3 className='font-semibold text-[var(--color-warning)] mb-2'>
            {warnings.length} warning{warnings.length !== 1 ? 's' : ''}
          </h3>
          <ul className='space-y-1 text-sm'>
            {warnings.map((w, i) => (
              <li key={`${w.field}-${i}`} className='text-[var(--color-text-secondary)]'>
                <span className='font-medium'>{getFieldLabel(w.field)}:</span> {w.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
