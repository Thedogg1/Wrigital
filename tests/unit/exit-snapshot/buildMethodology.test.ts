import { describe, expect, it } from 'vitest';
import { buildUkMethodology } from '@/lib/exit-snapshot/buildUkMethodology';
import { calculateUkExitSnapshot } from '@/lib/exit-snapshot/calculateUkExitSnapshot';
import { buildUsMethodology } from '@/lib/us-exit-snapshot/buildUsMethodology';
import { calculateUsExitSnapshot } from '@/lib/us-exit-snapshot/calculateUsExitSnapshot';

describe('buildUkMethodology', () => {
  it('includes inputs, formulas, and outputs for a typical scenario', () => {
    const inputs = {
      businessValue: '8280000',
      ownershipPercentage: '80',
      netWorth: '12000000',
      costBasis: '95000',
      shareAcquisitionDate: '2003-04-01',
      taxableIncome: '620000',
      allowableLosses: '',
      previousBadrClaimed: '',
      isTradingCompany: true,
      votingRightsPercentage: '',
      isOfficerOrEmployee: true,
      annualRevenue: '',
    };
    const calculated = calculateUkExitSnapshot(inputs);
    const methodology = buildUkMethodology(inputs, calculated);

    expect(methodology.inputs.length).toBeGreaterThan(5);
    expect(methodology.formulas.some((f) => f.name.includes('Equity value'))).toBe(true);
    expect(methodology.outputs.some((o) => o.label === 'Net proceeds')).toBe(true);
    expect(methodology.parameters.some((p) => p.label.includes('BADR'))).toBe(true);
    expect(methodology.formulas.map((f) => f.step)).toEqual(
      methodology.formulas.map((_, i) => i + 1),
    );
  });
});

describe('buildUsMethodology', () => {
  it('includes QSBS steps for Marcus-style scenario', () => {
    const inputs = {
      businessValue: '145000000',
      ownershipPercentage: '62',
      netWorth: '187000000',
      costBasis: '110000',
      shareAcquisitionDate: '2017-03-14',
      modifiedAdjustedGrossIncome: '14200000',
      entityType: 'C-Corp' as const,
      qsbsEligible: true,
      corporationQsbsQualified: true,
      shareholderQsbsQualified: true,
      activeBusinessRequirementsMet: true,
      serviceBusinessExclusionApplies: false,
      filingStatus: 'Married Filing Jointly' as const,
    };
    const calculated = calculateUsExitSnapshot(inputs);
    const methodology = buildUsMethodology(inputs, calculated);

    expect(methodology.formulas.some((f) => f.name.includes('QSBS'))).toBe(true);
    expect(methodology.formulas.map((f) => f.step)).toEqual(
      methodology.formulas.map((_, i) => i + 1),
    );
    expect(methodology.outputs.some((o) => o.highlight && o.label === 'Net proceeds')).toBe(true);
  });
});
