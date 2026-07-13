import { describe, it, expect } from 'vitest';
import { calculateUkTaxScenario } from '@/lib/exit-snapshot/calculateUkExitSnapshot';
import { TAX_PARAMETERS_2025_26 } from '@/lib/exit-snapshot/taxParameters202526';

describe('calculateUkTaxScenario', () => {
  it('BADR-eligible exit has lower tax than without BADR', () => {
    const equityValue = 2_000_000;
    const costBasis = 200_000;

    const withBadr = calculateUkTaxScenario(
      {
        grossProceeds: equityValue,
        costBasis,
        taxableIncome: 30_000,
        allowableLosses: 0,
        badrEligible: true,
        previousBadrClaimed: 0,
      },
      TAX_PARAMETERS_2025_26,
    );

    const withoutBadr = calculateUkTaxScenario(
      {
        grossProceeds: equityValue,
        costBasis,
        taxableIncome: 30_000,
        allowableLosses: 0,
        badrEligible: false,
        previousBadrClaimed: 0,
      },
      TAX_PARAMETERS_2025_26,
    );

    expect(withBadr.totalTaxLiability).toBeLessThan(withoutBadr.totalTaxLiability);
    expect(withBadr.netProceeds).toBeGreaterThan(withoutBadr.netProceeds);
    expect(withBadr.totalTaxLiability).toBe(330_818);
    expect(withoutBadr.totalTaxLiability).toBe(430_818);
  });

  it('capital loss produces zero tax and full gross proceeds as net', () => {
    const result = calculateUkTaxScenario(
      {
        grossProceeds: 100_000,
        costBasis: 200_000,
        taxableIncome: 30_000,
        allowableLosses: 0,
        badrEligible: true,
        previousBadrClaimed: 0,
      },
      TAX_PARAMETERS_2025_26,
    );

    expect(result.grossCapitalGain).toBe(-100_000);
    expect(result.totalTaxLiability).toBe(0);
    expect(result.netProceeds).toBe(100_000);
    expect(result.effectiveTaxRate).toBe(0);
  });

  it('BADR lifetime cap partially applies gain above headroom', () => {
    const result = calculateUkTaxScenario(
      {
        grossProceeds: 800_000,
        costBasis: 50_000,
        taxableIncome: 40_000,
        allowableLosses: 0,
        badrEligible: true,
        previousBadrClaimed: 900_000,
      },
      TAX_PARAMETERS_2025_26,
    );

    expect(result.badrQualifyingGain).toBe(100_000);
    expect(result.nonBadrGain).toBe(650_000);
    expect(result.badrTax).toBe(14_000);
  });
});
