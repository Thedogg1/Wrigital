import { formatCurrency, safeDecimal } from '@/lib/validation/validation-library-core';
import type { SnapshotFormData } from '@/lib/validation/validateSnapshotInputs';

export function formatCurrencyField(value: string, fallback = '—'): string {
  if (!value?.trim()) return fallback;
  const n = safeDecimal(value);
  return n === null ? value : formatCurrency(n);
}

export function formatPercentField(value: string, fallback = '—'): string {
  if (!value?.trim()) return fallback;
  const n = safeDecimal(value);
  return n === null ? value : `${n}%`;
}

export function formatAssumptionRows(inputs: SnapshotFormData): [string, string][] {
  const ownership = formatPercentField(inputs.ownershipPercentage);

  return [
    ['Business value', formatCurrencyField(inputs.businessValue)],
    ['Ownership %', ownership],
    ['Net worth', formatCurrencyField(inputs.netWorth)],
    ['Cost basis', formatCurrencyField(inputs.costBasis)],
    ['Share acquisition date', inputs.shareAcquisitionDate || '—'],
    ['Taxable income (after PA)', formatCurrencyField(inputs.taxableIncome)],
    [
      'Allowable losses',
      inputs.allowableLosses?.trim()
        ? formatCurrencyField(inputs.allowableLosses)
        : '£0 (assumed)',
    ],
    [
      'Previous BADR claimed',
      inputs.previousBadrClaimed?.trim()
        ? formatCurrencyField(inputs.previousBadrClaimed)
        : '£0 (assumed)',
    ],
    ['Trading company', inputs.isTradingCompany ? 'Yes (assumed)' : 'No'],
    [
      'Officer/employee attestation',
      inputs.isOfficerOrEmployee ? 'Yes (assumed)' : 'No',
    ],
    [
      'Voting rights %',
      inputs.votingRightsPercentage?.trim()
        ? formatPercentField(inputs.votingRightsPercentage)
        : `${ownership} (same as ownership)`,
    ],
    [
      'Annual revenue',
      inputs.annualRevenue?.trim()
        ? formatCurrencyField(inputs.annualRevenue)
        : 'Not provided',
    ],
  ];
}
