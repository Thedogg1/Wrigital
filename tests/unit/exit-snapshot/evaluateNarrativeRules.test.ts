import { describe, it, expect } from 'vitest';
import { evaluateNarrativeRules } from '@/lib/exit-snapshot/evaluateNarrativeRules';
import { buildSnapshotFlags } from '@/lib/exit-snapshot/calculateUkExitSnapshot';
import { buildSnapshotContext } from '@/lib/exit-snapshot/buildSnapshotContext';
import type { SnapshotCalculated } from '@/lib/exit-snapshot/types';
import { EMPTY_SNAPSHOT_FORM } from '@/lib/validation/validateSnapshotInputs';

function makeCalculated(overrides: Partial<SnapshotCalculated> = {}): SnapshotCalculated {
  return {
    grossProceeds: 1_000_000,
    equityValue: 1_000_000,
    grossCapitalGain: 800_000,
    allowableLossesApplied: 0,
    gainsAfterLosses: 800_000,
    badrQualifyingGain: 800_000,
    badrTax: 112_000,
    nonBadrGain: 0,
    aeaApplied: 3_000,
    taxableNonBadrGain: 0,
    basicRatePortion: 0,
    higherRatePortion: 0,
    nonBadrGainTax: 0,
    totalTaxLiability: 112_000,
    netProceeds: 888_000,
    effectiveTaxRate: 14,
    businessValueShareOfNetWorth: 75,
    badrHeadroomRemaining: 1_000_000,
    holdingPeriodYears: 5,
    ownershipPercent: 100,
    badrEligible: true,
    badrCheckResults: [],
    calculationDate: '2026-06-26',
    taxYear: '2025/26',
    ...overrides,
  };
}

describe('evaluateNarrativeRules', () => {
  it('fires high concentration rules when concentration >= 60%', () => {
    const inputs = { ...EMPTY_SNAPSHOT_FORM, businessValue: '2000000', netWorth: '1000000', ownershipPercentage: '75' };
    const calculated = makeCalculated({ businessValueShareOfNetWorth: 75 });
    const context = buildSnapshotContext(inputs, calculated);
    const matched = evaluateNarrativeRules(context);
    const ids = matched.map((m) => m.rule.id);

    expect(ids).toContain('exit.concentration.high.01');
    expect(ids).toContain('exit.concentration.high.02');
    expect(ids).toContain('badr.eligible.01');
  });

  it('fires capital loss rule when gain is zero or negative', () => {
    const inputs = EMPTY_SNAPSHOT_FORM;
    const calculated = makeCalculated({ grossCapitalGain: -50_000, badrEligible: false });
    const flags = buildSnapshotFlags(inputs, calculated);
    const context = { inputs, calculated, flags };
    const matched = evaluateNarrativeRules(context);
    const ids = matched.map((m) => m.rule.id);

    expect(ids).toContain('gain.zero.loss.01');
    expect(ids).toContain('badr.noteligible.01');
  });
});
