import { describe, expect, it } from 'vitest';
import { calculateUsExitSnapshot } from '@/lib/us-exit-snapshot/calculateUsExitSnapshot';
import type { UsSnapshotFormData } from '@/lib/validation/validateUsSnapshotInputs';

const baseForm: UsSnapshotFormData = {
  businessValue: '145000000',
  ownershipPercentage: '62',
  netWorth: '187000000',
  costBasis: '110000',
  shareAcquisitionDate: '2017-03-14',
  modifiedAdjustedGrossIncome: '14200000',
  entityType: 'C-Corp',
  qsbsEligible: true,
  corporationQsbsQualified: true,
  shareholderQsbsQualified: true,
  activeBusinessRequirementsMet: true,
  serviceBusinessExclusionApplies: false,
  filingStatus: 'Married Filing Jointly',
};

describe('calculateUsExitSnapshot', () => {
  it('calculates Marcus Ellison-style QSBS scenario with positive net proceeds', () => {
    const result = calculateUsExitSnapshot(baseForm, new Date('2026-06-01'));
    expect(result.equityValue).toBe(89_900_000);
    expect(result.qsbsEligible).toBe(true);
    expect(result.netProceeds).toBeGreaterThan(50_000_000);
    expect(result.totalTaxLiability).toBeGreaterThan(0);
    expect(result.businessValueShareOfNetWorth).toBeGreaterThan(40);
  });

  it('falls back to standard capital gains when QSBS ineligible', () => {
    const result = calculateUsExitSnapshot(
      { ...baseForm, entityType: 'S-Corp' },
      new Date('2026-06-01'),
    );
    expect(result.qsbsEligible).toBe(false);
    expect(result.qsbsExcludedGain).toBe(0);
    expect(result.netProceeds).toBeLessThan(89_900_000);
  });
});
