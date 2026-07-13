import { describe, it, expect } from 'vitest';
import {
  formatCurrencyField,
  formatPercentField,
  formatAssumptionRows,
} from '@/lib/exit-snapshot/formatAssumptionDisplay';
import { EMPTY_SNAPSHOT_FORM } from '@/lib/validation/validateSnapshotInputs';

describe('formatAssumptionDisplay', () => {
  it('formats currency and percentage fields for assumptions table', () => {
    const rows = formatAssumptionRows({
      ...EMPTY_SNAPSHOT_FORM,
      businessValue: '5000000',
      ownershipPercentage: '60',
      netWorth: '2000000',
      costBasis: '50000',
      shareAcquisitionDate: '2018-03-15',
      taxableIncome: '30000',
    });

    expect(formatCurrencyField('5000000')).toBe('£5,000,000');
    expect(formatPercentField('60')).toBe('60%');
    expect(rows.find(([l]) => l === 'Business value')?.[1]).toBe('£5,000,000');
    expect(rows.find(([l]) => l === 'Ownership %')?.[1]).toBe('60%');
    expect(rows.find(([l]) => l === 'Net worth')?.[1]).toBe('£2,000,000');
    expect(rows.find(([l]) => l === 'Cost basis')?.[1]).toBe('£50,000');
  });
});
