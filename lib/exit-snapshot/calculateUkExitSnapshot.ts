import { safeDecimal } from '@/lib/validation/validation-library-core';
import type { SnapshotFormData, SnapshotCalculated } from './types';
import { TAX_PARAMETERS_2025_26, TAX_YEAR_LABEL } from './taxParameters202526';
import { validateBadrEligibility } from './validateBadrEligibility';
import {
  CONCENTRATION_EXTREME_THRESHOLD,
  CONCENTRATION_HIGH_THRESHOLD,
  CONCENTRATION_MODERATE_THRESHOLD,
  calculateConcentrationRisk,
} from '@/lib/validation/validation-library-core';

export interface UkTaxScenarioInput {
  grossProceeds: number;
  costBasis: number;
  taxableIncome: number;
  allowableLosses: number;
  badrEligible: boolean;
  previousBadrClaimed: number;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/**
 * Port of TaxOptimizationFormulas.CalculateUkScenario (BadrOnly, Rates202526).
 */
export function calculateUkTaxScenario(
  input: UkTaxScenarioInput,
  params = TAX_PARAMETERS_2025_26,
): Omit<SnapshotCalculated, 'equityValue' | 'businessValueShareOfNetWorth' | 'badrHeadroomRemaining' | 'holdingPeriodYears' | 'ownershipPercent' | 'badrEligible' | 'badrCheckResults' | 'calculationDate' | 'taxYear'> {
  const capitalGain = input.grossProceeds - input.costBasis;

  if (capitalGain <= 0) {
    return {
      grossProceeds: input.grossProceeds,
      grossCapitalGain: capitalGain,
      allowableLossesApplied: 0,
      gainsAfterLosses: 0,
      badrQualifyingGain: 0,
      badrTax: 0,
      nonBadrGain: 0,
      aeaApplied: 0,
      taxableNonBadrGain: 0,
      basicRatePortion: 0,
      higherRatePortion: 0,
      nonBadrGainTax: 0,
      totalTaxLiability: 0,
      netProceeds: input.grossProceeds,
      effectiveTaxRate: 0,
    };
  }

  const gainsAfterLosses = Math.max(0, capitalGain - input.allowableLosses);
  const lossesApplied = capitalGain - gainsAfterLosses;

  let badrGain = 0;
  let badrRateApplied: number | null = null;
  let nonBadrGain = gainsAfterLosses;

  if (input.badrEligible) {
    const headroom = Math.max(0, params.badrLifetimeLimit - input.previousBadrClaimed);
    badrGain = Math.min(gainsAfterLosses, headroom);
    nonBadrGain = gainsAfterLosses - badrGain;
    badrRateApplied = params.badrRate202526;
  }

  const aeaOnNonBadr = Math.min(params.annualCgtExemption, nonBadrGain);
  const taxableNonBadrGain = nonBadrGain - aeaOnNonBadr;
  const remainingAea = params.annualCgtExemption - aeaOnNonBadr;
  const aeaOnBadr = Math.min(remainingAea, badrGain);
  const taxableBadrGain = badrGain - aeaOnBadr;
  const totalAeaApplied = aeaOnNonBadr + aeaOnBadr;

  let badrTax = 0;
  if (badrRateApplied !== null && taxableBadrGain > 0) {
    badrTax = taxableBadrGain * badrRateApplied;
  }

  const extendedBrb = params.basicRateBand;
  const unusedBrb = Math.max(0, extendedBrb - input.taxableIncome);
  const gainsAtBasicRate = Math.min(taxableNonBadrGain, unusedBrb);
  const gainsAtHigherRate = taxableNonBadrGain - gainsAtBasicRate;
  const standardCgtTax =
    gainsAtBasicRate * params.capitalGainsTaxBasicRate +
    gainsAtHigherRate * params.capitalGainsTaxHigherRate;

  const totalTax = badrTax + standardCgtTax;
  const netProceeds = input.grossProceeds - totalTax;
  const effectiveRate = capitalGain > 0 ? (totalTax / capitalGain) * 100 : 0;

  return {
    grossProceeds: input.grossProceeds,
    grossCapitalGain: capitalGain,
    allowableLossesApplied: lossesApplied,
    gainsAfterLosses,
    badrQualifyingGain: badrGain,
    badrTax: round2(badrTax),
    nonBadrGain,
    aeaApplied: totalAeaApplied,
    taxableNonBadrGain,
    basicRatePortion: round2(gainsAtBasicRate),
    higherRatePortion: round2(gainsAtHigherRate),
    nonBadrGainTax: round2(standardCgtTax),
    totalTaxLiability: round2(totalTax),
    netProceeds: round2(netProceeds),
    effectiveTaxRate: round1(effectiveRate),
  };
}

export function calculateUkExitSnapshot(
  inputs: SnapshotFormData,
  disposalDate: Date = new Date(),
): SnapshotCalculated {
  const businessValue = safeDecimal(inputs.businessValue) ?? 0;
  const ownershipPercent = safeDecimal(inputs.ownershipPercentage) ?? 0;
  const netWorth = safeDecimal(inputs.netWorth) ?? 0;
  const costBasis = safeDecimal(inputs.costBasis) ?? 0;
  const taxableIncome = safeDecimal(inputs.taxableIncome) ?? 0;
  const allowableLosses = safeDecimal(inputs.allowableLosses) ?? 0;
  const previousBadrClaimed = safeDecimal(inputs.previousBadrClaimed) ?? 0;
  const votingRights =
    safeDecimal(inputs.votingRightsPercentage) ?? ownershipPercent;

  const equityValue = businessValue * (ownershipPercent / 100);
  const grossCapitalGain = equityValue - costBasis;

  const badrResult = validateBadrEligibility({
    isTradingCompany: inputs.isTradingCompany,
    shareAcquisitionDate: inputs.shareAcquisitionDate,
    disposalDate,
    ownershipPercentage: ownershipPercent,
    votingRightsPercentage: votingRights,
    isOfficerOrEmployeeForQualifyingPeriod: inputs.isOfficerOrEmployee,
    previousBadrClaimed,
    currentGain: Math.max(0, grossCapitalGain),
  });

  const taxResult = calculateUkTaxScenario({
    grossProceeds: equityValue,
    costBasis,
    taxableIncome,
    allowableLosses,
    badrEligible: badrResult.isEligible,
    previousBadrClaimed,
  });

  const concentration = calculateConcentrationRisk(businessValue, ownershipPercent, netWorth) ?? 0;

  return {
    ...taxResult,
    equityValue: round2(equityValue),
    businessValueShareOfNetWorth: round1(concentration),
    badrHeadroomRemaining: badrResult.remainingLifetimeCap,
    holdingPeriodYears: round1(badrResult.holdingPeriodYears),
    ownershipPercent,
    badrEligible: badrResult.isEligible,
    badrCheckResults: badrResult.checkResults,
    calculationDate: disposalDate.toISOString().split('T')[0],
    taxYear: TAX_YEAR_LABEL,
  };
}

export function countAssumptions(inputs: SnapshotFormData): number {
  let count = 0;
  if (!inputs.allowableLosses) count++;
  if (!inputs.previousBadrClaimed) count++;
  if (!inputs.votingRightsPercentage) count++;
  if (!inputs.annualRevenue) count++;
  if (inputs.isTradingCompany) count++;
  if (inputs.isOfficerOrEmployee) count++;
  return count;
}

export function buildSnapshotFlags(
  inputs: SnapshotFormData,
  calculated: SnapshotCalculated,
): import('./types').SnapshotFlags {
  const concentration = calculated.businessValueShareOfNetWorth;
  return {
    badrEligible: calculated.badrEligible,
    hasCapitalLoss: calculated.grossCapitalGain <= 0,
    concentrationModerate: concentration >= CONCENTRATION_MODERATE_THRESHOLD,
    concentrationHigh: concentration >= CONCENTRATION_HIGH_THRESHOLD,
    concentrationExtreme: concentration >= CONCENTRATION_EXTREME_THRESHOLD,
    effectiveTaxHigh: calculated.effectiveTaxRate > 20,
    badrHeadroomExceeded:
      calculated.badrEligible &&
      calculated.gainsAfterLosses > calculated.badrHeadroomRemaining,
    assumptionCount: countAssumptions(inputs),
  };
}
