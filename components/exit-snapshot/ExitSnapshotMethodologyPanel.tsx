'use client';

import type { ExitSnapshotMethodology } from '@/lib/exit-snapshot/methodologyTypes';

interface ExitSnapshotMethodologyPanelProps {
  methodology: ExitSnapshotMethodology;
}

export default function ExitSnapshotMethodologyPanel({
  methodology,
}: ExitSnapshotMethodologyPanelProps) {
  return (
    <div className='space-y-8'>
      <p className='text-sm text-[var(--color-text-secondary)]'>
        Tax year {methodology.taxYear}. Calculated {methodology.calculationDate}. Each figure below
        traces from your inputs through the formulas used in this estimate.
      </p>

      <section>
        <h3 className='text-lg font-semibold text-[var(--color-text-primary)] mb-3'>Inputs</h3>
        <div className='overflow-x-auto rounded-lg border border-[var(--color-border-subtle)]'>
          <table className='w-full text-sm'>
            <tbody>
              {methodology.inputs.map((row) => (
                <tr key={row.label} className='border-b border-[var(--color-border-subtle)] last:border-0'>
                  <td className='px-4 py-2.5 text-[var(--color-text-secondary)] w-2/5'>{row.label}</td>
                  <td className='px-4 py-2.5 text-[var(--color-text-primary)] font-medium'>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className='text-lg font-semibold text-[var(--color-text-primary)] mb-3'>
          Tax parameters used
        </h3>
        <div className='overflow-x-auto rounded-lg border border-[var(--color-border-subtle)]'>
          <table className='w-full text-sm'>
            <tbody>
              {methodology.parameters.map((row) => (
                <tr key={row.label} className='border-b border-[var(--color-border-subtle)] last:border-0'>
                  <td className='px-4 py-2.5 text-[var(--color-text-secondary)] w-2/5'>{row.label}</td>
                  <td className='px-4 py-2.5 text-[var(--color-text-primary)] font-medium'>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className='text-lg font-semibold text-[var(--color-text-primary)] mb-3'>
          Calculation steps
        </h3>
        <div className='space-y-3'>
          {methodology.formulas.map((row) => (
            <div
              key={row.name}
              className='rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4'
            >
              <div className='flex items-start gap-3 mb-2'>
                <span className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-bold text-white'>
                  {row.step}
                </span>
                <p className='font-semibold text-[var(--color-text-primary)]'>{row.name}</p>
              </div>
              <p className='text-sm text-[var(--color-text-secondary)] mb-1'>
                <span className='font-medium text-[var(--color-text-primary)]'>Formula:</span>{' '}
                {row.expression}
              </p>
              <p className='text-sm text-[var(--color-text-secondary)] mb-1 font-mono'>
                {row.substitution}
              </p>
              <p className='text-sm font-semibold text-[var(--color-primary)]'>→ {row.result}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className='text-lg font-semibold text-[var(--color-text-primary)] mb-3'>Outputs</h3>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          {methodology.outputs.map((row) => (
            <div
              key={row.label}
              className={`rounded-lg border p-4 ${
                row.highlight
                  ? 'border-[var(--color-primary)] bg-[var(--color-surface)]'
                  : 'border-[var(--color-border-subtle)]'
              }`}
            >
              <div className='text-xs text-[var(--color-text-secondary)] mb-1'>{row.label}</div>
              <div
                className={`text-base font-semibold ${
                  row.highlight ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-primary)]'
                }`}
              >
                {row.value}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
