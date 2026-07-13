'use client';

import Card from '@/components/Card';
import Button from '@/components/Button';
import ExitSnapshotValidationSummary from '@/components/exit-snapshot/ExitSnapshotValidationSummary';
import {
  type UsSnapshotFormData,
  validateUsSnapshotInputs,
  isUsMandatoryField,
  getUsFieldLabel,
} from '@/lib/validation/validateUsSnapshotInputs';
import { useMemo, useState } from 'react';

interface UsExitSnapshotFormProps {
  formState: UsSnapshotFormData;
  onChange: (next: UsSnapshotFormData) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  reportGenerated: boolean;
  inputsChangedSinceReport?: boolean;
  generateError?: string;
}

function CurrencyInput({
  id,
  label,
  value,
  onChange,
  mandatory,
  hasError,
}: {
  id: keyof UsSnapshotFormData;
  label: string;
  value: string;
  onChange: (v: string) => void;
  mandatory: boolean;
  hasError: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className='block text-sm font-medium text-[var(--color-text-secondary)] mb-1'>
        {label}
        {mandatory && <span className='text-[var(--color-critical)] ml-1'>*</span>}
      </label>
      <div className='relative'>
        <span className='absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]'>$</span>
        <input
          id={id}
          type='text'
          inputMode='decimal'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder='0'
          className={`w-full pl-8 pr-4 py-3 rounded-lg border ${
            hasError
              ? 'border-[var(--color-critical)] focus:ring-[var(--color-critical)]'
              : 'border-[var(--color-border-subtle)] focus:ring-[var(--focus-ring-color)]'
          } focus:outline-none focus:ring-2`}
        />
      </div>
    </div>
  );
}

export default function UsExitSnapshotForm({
  formState,
  onChange,
  onGenerate,
  isGenerating,
  reportGenerated,
  inputsChangedSinceReport = false,
  generateError = '',
}: UsExitSnapshotFormProps) {
  const [showOptional, setShowOptional] = useState(false);
  const validation = useMemo(() => validateUsSnapshotInputs(formState), [formState]);
  const errorFields = new Set(validation.errors.map((e) => e.field));

  const update = (field: keyof UsSnapshotFormData, value: string | boolean) => {
    onChange({ ...formState, [field]: value });
  };

  return (
    <Card>
      <h2 className='text-2xl font-semibold text-[var(--color-primary)] mb-2'>Enter your figures</h2>
      <p className='text-sm text-[var(--color-text-secondary)] mb-6'>
        All calculations run in your browser. Your financial data is never sent to our servers until you
        request your reports by email.
      </p>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
        <CurrencyInput
          id='businessValue'
          label={getUsFieldLabel('businessValue')}
          value={formState.businessValue}
          onChange={(v) => update('businessValue', v)}
          mandatory={isUsMandatoryField('businessValue')}
          hasError={errorFields.has('businessValue')}
        />
        <div>
          <label htmlFor='ownershipPercentage' className='block text-sm font-medium text-[var(--color-text-secondary)] mb-1'>
            {getUsFieldLabel('ownershipPercentage')}
            <span className='text-[var(--color-critical)] ml-1'>*</span>
          </label>
          <div className='relative'>
            <input
              id='ownershipPercentage'
              type='text'
              inputMode='decimal'
              value={formState.ownershipPercentage}
              onChange={(e) => update('ownershipPercentage', e.target.value)}
              placeholder='0'
              className={`w-full pr-10 py-3 rounded-lg border ${
                errorFields.has('ownershipPercentage')
                  ? 'border-[var(--color-critical)]'
                  : 'border-[var(--color-border-subtle)]'
              } focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring-color)]`}
            />
            <span className='absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]'>%</span>
          </div>
        </div>
        <CurrencyInput
          id='netWorth'
          label={getUsFieldLabel('netWorth')}
          value={formState.netWorth}
          onChange={(v) => update('netWorth', v)}
          mandatory={isUsMandatoryField('netWorth')}
          hasError={errorFields.has('netWorth')}
        />
        <CurrencyInput
          id='costBasis'
          label={getUsFieldLabel('costBasis')}
          value={formState.costBasis}
          onChange={(v) => update('costBasis', v)}
          mandatory={isUsMandatoryField('costBasis')}
          hasError={errorFields.has('costBasis')}
        />
        <div>
          <label htmlFor='shareAcquisitionDate' className='block text-sm font-medium text-[var(--color-text-secondary)] mb-1'>
            {getUsFieldLabel('shareAcquisitionDate')}
            <span className='text-[var(--color-critical)] ml-1'>*</span>
          </label>
          <input
            id='shareAcquisitionDate'
            type='date'
            value={formState.shareAcquisitionDate}
            onChange={(e) => update('shareAcquisitionDate', e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${
              errorFields.has('shareAcquisitionDate')
                ? 'border-[var(--color-critical)]'
                : 'border-[var(--color-border-subtle)]'
            } focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring-color)]`}
          />
        </div>
        <CurrencyInput
          id='modifiedAdjustedGrossIncome'
          label={getUsFieldLabel('modifiedAdjustedGrossIncome')}
          value={formState.modifiedAdjustedGrossIncome}
          onChange={(v) => update('modifiedAdjustedGrossIncome', v)}
          mandatory={isUsMandatoryField('modifiedAdjustedGrossIncome')}
          hasError={errorFields.has('modifiedAdjustedGrossIncome')}
        />
      </div>

      <button
        type='button'
        onClick={() => setShowOptional(!showOptional)}
        className='mb-4 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-bg)]'
      >
        {showOptional ? 'Hide optional QSBS fields' : 'Show optional QSBS fields'}
      </button>

      {showOptional && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div>
            <label htmlFor='entityType' className='block text-sm font-medium text-[var(--color-text-secondary)] mb-1'>
              {getUsFieldLabel('entityType')}
            </label>
            <select
              id='entityType'
              value={formState.entityType}
              onChange={(e) => update('entityType', e.target.value)}
              className='w-full px-4 py-3 rounded-lg border border-[var(--color-border-subtle)]'
            >
              <option value='C-Corp'>C-Corp</option>
              <option value='S-Corp'>S-Corp</option>
              <option value='LLC'>LLC</option>
              <option value='Partnership'>Partnership</option>
            </select>
          </div>
          <div>
            <label htmlFor='filingStatus' className='block text-sm font-medium text-[var(--color-text-secondary)] mb-1'>
              {getUsFieldLabel('filingStatus')}
            </label>
            <select
              id='filingStatus'
              value={formState.filingStatus}
              onChange={(e) => update('filingStatus', e.target.value)}
              className='w-full px-4 py-3 rounded-lg border border-[var(--color-border-subtle)]'
            >
              <option value='Married Filing Jointly'>Married Filing Jointly</option>
              <option value='Single'>Single</option>
            </select>
          </div>
          {(
            [
              ['qsbsEligible', 'QSBS eligible'],
              ['corporationQsbsQualified', 'Corporation QSBS qualified'],
              ['shareholderQsbsQualified', 'Shareholder QSBS qualified'],
              ['activeBusinessRequirementsMet', 'Active business requirements met'],
              ['serviceBusinessExclusionApplies', 'Service business exclusion applies'],
            ] as const
          ).map(([field, label]) => (
            <label key={field} className='flex items-center gap-3 cursor-pointer md:col-span-2'>
              <input
                type='checkbox'
                checked={formState[field]}
                onChange={(e) => update(field, e.target.checked)}
                className='w-5 h-5 rounded border-[var(--color-border-subtle)]'
              />
              <span className='text-sm text-[var(--color-text-secondary)]'>{label}</span>
            </label>
          ))}
        </div>
      )}

      <ExitSnapshotValidationSummary errors={validation.errors} warnings={validation.warnings} />

      {generateError && (
        <div
          className='mt-4 rounded-lg border border-[var(--color-critical)] bg-red-50 p-4 text-sm text-[var(--color-critical)]'
          role='alert'
        >
          {generateError}
        </div>
      )}

      <div className='mt-8'>
        <Button
          onClick={onGenerate}
          disabled={!validation.isValid || isGenerating || (reportGenerated && !inputsChangedSinceReport)}
          className='w-full sm:w-auto'
        >
          {isGenerating
            ? 'Generating…'
            : reportGenerated
              ? inputsChangedSinceReport
                ? 'Update Report'
                : 'Report generated'
              : 'Generate Report'}
        </Button>
        {reportGenerated && !inputsChangedSinceReport && (
          <p className='mt-2 text-sm text-[var(--color-text-secondary)]'>
            Change a figure above to refresh the results.
          </p>
        )}
      </div>
    </Card>
  );
}
