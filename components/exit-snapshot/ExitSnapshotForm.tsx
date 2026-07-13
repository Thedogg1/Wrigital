'use client';

import Card from '@/components/Card';
import Button from '@/components/Button';
import {
  type SnapshotFormData,
  EMPTY_SNAPSHOT_FORM,
  validateSnapshotInputs,
  isMandatoryField,
  getFieldLabel,
} from '@/lib/validation/validateSnapshotInputs';
import ExitSnapshotValidationSummary from './ExitSnapshotValidationSummary';
import { useMemo, useState } from 'react';

interface ExitSnapshotFormProps {
  formState: SnapshotFormData;
  onChange: (next: SnapshotFormData) => void;
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
  id: keyof SnapshotFormData;
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
        <span className='absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]'>£</span>
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

export default function ExitSnapshotForm({
  formState,
  onChange,
  onGenerate,
  isGenerating,
  reportGenerated,
  inputsChangedSinceReport = false,
  generateError = '',
}: ExitSnapshotFormProps) {
  const [showOptional, setShowOptional] = useState(false);
  const validation = useMemo(() => validateSnapshotInputs(formState), [formState]);
  const errorFields = new Set(validation.errors.map((e) => e.field));

  const update = (field: keyof SnapshotFormData, value: string | boolean) => {
    onChange({ ...formState, [field]: value });
  };

  return (
    <Card>
      <h2 className='text-2xl font-semibold text-[var(--color-primary)] mb-2'>
        Enter your figures
      </h2>
      <p className='text-sm text-[var(--color-text-secondary)] mb-6'>
        All calculations run in your browser. Your financial data is never sent to our servers.
      </p>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
        <CurrencyInput
          id='businessValue'
          label={getFieldLabel('businessValue')}
          value={formState.businessValue}
          onChange={(v) => update('businessValue', v)}
          mandatory={isMandatoryField('businessValue')}
          hasError={errorFields.has('businessValue')}
        />
        <div>
          <label htmlFor='ownershipPercentage' className='block text-sm font-medium text-[var(--color-text-secondary)] mb-1'>
            {getFieldLabel('ownershipPercentage')}
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
          label={getFieldLabel('netWorth')}
          value={formState.netWorth}
          onChange={(v) => update('netWorth', v)}
          mandatory={isMandatoryField('netWorth')}
          hasError={errorFields.has('netWorth')}
        />
        <CurrencyInput
          id='costBasis'
          label={getFieldLabel('costBasis')}
          value={formState.costBasis}
          onChange={(v) => update('costBasis', v)}
          mandatory={isMandatoryField('costBasis')}
          hasError={errorFields.has('costBasis')}
        />
        <div>
          <label htmlFor='shareAcquisitionDate' className='block text-sm font-medium text-[var(--color-text-secondary)] mb-1'>
            {getFieldLabel('shareAcquisitionDate')}
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
          id='taxableIncome'
          label={getFieldLabel('taxableIncome')}
          value={formState.taxableIncome}
          onChange={(v) => update('taxableIncome', v)}
          mandatory={isMandatoryField('taxableIncome')}
          hasError={errorFields.has('taxableIncome')}
        />
      </div>

      <button
        type='button'
        onClick={() => setShowOptional(!showOptional)}
        className='mb-4 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-bg)]'
      >
        {showOptional ? 'Hide optional fields' : 'Show optional fields'}
      </button>

      {showOptional && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pt-4 border-t border-[var(--color-border-subtle)]'>
          <CurrencyInput
            id='allowableLosses'
            label={getFieldLabel('allowableLosses')}
            value={formState.allowableLosses}
            onChange={(v) => update('allowableLosses', v)}
            mandatory={false}
            hasError={errorFields.has('allowableLosses')}
          />
          <CurrencyInput
            id='previousBadrClaimed'
            label={getFieldLabel('previousBadrClaimed')}
            value={formState.previousBadrClaimed}
            onChange={(v) => update('previousBadrClaimed', v)}
            mandatory={false}
            hasError={errorFields.has('previousBadrClaimed')}
          />
          <CurrencyInput
            id='annualRevenue'
            label={getFieldLabel('annualRevenue')}
            value={formState.annualRevenue}
            onChange={(v) => update('annualRevenue', v)}
            mandatory={false}
            hasError={errorFields.has('annualRevenue')}
          />
          <div>
            <label htmlFor='votingRightsPercentage' className='block text-sm font-medium text-[var(--color-text-secondary)] mb-1'>
              {getFieldLabel('votingRightsPercentage')}
            </label>
            <input
              id='votingRightsPercentage'
              type='text'
              inputMode='decimal'
              value={formState.votingRightsPercentage}
              onChange={(e) => update('votingRightsPercentage', e.target.value)}
              placeholder='Same as ownership %'
              className='w-full px-4 py-3 rounded-lg border border-[var(--color-border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring-color)]'
            />
          </div>
          <label className='flex items-center gap-3 cursor-pointer'>
            <input
              type='checkbox'
              checked={formState.isTradingCompany}
              onChange={(e) => update('isTradingCompany', e.target.checked)}
              className='w-5 h-5 rounded border-[var(--color-border-subtle)]'
            />
            <span className='text-sm text-[var(--color-text-secondary)]'>
              Trading company (BADR check)
            </span>
          </label>
          <label className='flex items-center gap-3 cursor-pointer'>
            <input
              type='checkbox'
              checked={formState.isOfficerOrEmployee}
              onChange={(e) => update('isOfficerOrEmployee', e.target.checked)}
              className='w-5 h-5 rounded border-[var(--color-border-subtle)]'
            />
            <span className='text-sm text-[var(--color-text-secondary)]'>
              Officer/employee for qualifying period
            </span>
          </label>
        </div>
      )}

      <ExitSnapshotValidationSummary
        errors={validation.errors}
        warnings={validation.warnings}
      />

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
          disabled={
            !validation.isValid || isGenerating || (reportGenerated && !inputsChangedSinceReport)
          }
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

export { EMPTY_SNAPSHOT_FORM };
