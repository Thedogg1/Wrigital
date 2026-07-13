/**
 * Port of ExitTaxStrategyCalculator (QsbsExclusion + standard capital gains fallback).
 */

import { safeDecimal } from '@/lib/validation/validation-library-core';
import {
  calculateConcentrationRisk,
  CONCENTRATION_EXTREME_THRESHOLD,
  CONCENTRATION_HIGH_THRESHOLD,
  CONCENTRATION_MODERATE_THRESHOLD,
} from '@/lib/validation/validation-library-core';
import type { UsSnapshotFormData, UsSnapshotCalculated } from './types';
import { US_TAX_PARAMETERS, US_TAX_YEAR_LABEL } from './taxParameters';
import { validateQsbsEligibility } from './validateQsbsEligibility';

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function niitApplies(magi: number, filingStatus: UsSnapshotFormData['filingStatus']): boolean {
  const threshold =
    filingStatus === 'Married Filing Jointly'
      ? US_TAX_PARAMETERS.niitThresholdMarriedFilingJoint
      : US_TAX_PARAMETERS.niitThresholdSingle;
  return magi > threshold;
}

export function calculateUsQsbsScenario(input: {
  equityValue: number;
  costBasis: number;
  qsbsEligible: boolean;
  exclusionPercent: number;
  perIssuerCap: number;
  niitApplies: boolean;
  stateCapitalGainsRate?: number;
}): Pick<
  UsSnapshotCalculated,
  | 'grossCapitalGain'
  | 'qsbsExcludedGain'
  | 'qsbsTaxableGain'
  | 'qsbsSavings'
  | 'federalTax'
  | 'stateTax'
  | 'totalTaxLiability'
  | 'netProceeds'
  | 'effectiveTaxRate'
> {
  const params = US_TAX_PARAMETERS;
  const stateRate = input.stateCapitalGainsRate ?? params.stateCapitalGainsRate;
  const capitalGain = input.equityValue - input.costBasis;

  if (capitalGain <= 0) {
    return {
      grossCapitalGain: capitalGain,
      qsbsExcludedGain: 0,
      qsbsTaxableGain: 0,
      qsbsSavings: 0,
      federalTax: 0,
      stateTax: 0,
      totalTaxLiability: 0,
      netProceeds: input.equityValue,
      effectiveTaxRate: 0,
    };
  }

  if (!input.qsbsEligible || input.exclusionPercent <= 0) {
    const federalCombined =
      params.federalLtcgRate + (input.niitApplies ? params.niitRate : 0);
    const federalTax = capitalGain * federalCombined;
    const stateTax = capitalGain * stateRate;
    const totalTax = federalTax + stateTax;
    return {
      grossCapitalGain: capitalGain,
      qsbsExcludedGain: 0,
      qsbsTaxableGain: capitalGain,
      qsbsSavings: 0,
      federalTax: round2(federalTax),
      stateTax: round2(stateTax),
      totalTaxLiability: round2(totalTax),
      netProceeds: round2(input.equityValue - totalTax),
      effectiveTaxRate: round1((totalTax / input.equityValue) * 100),
    };
  }

  const cappedGain = Math.min(capitalGain, input.perIssuerCap);
  const qsbsExcludedGain = cappedGain * (input.exclusionPercent / 100);
  const qsbsTaxableGain = capitalGain - qsbsExcludedGain;
  const qsbsFederalTax = qsbsTaxableGain * params.qsbsFederalRate;
  const qsbsNiitTax = input.niitApplies ? qsbsTaxableGain * params.niitRate : 0;
  const federalTax = qsbsFederalTax + qsbsNiitTax;
  const stateTax = capitalGain * stateRate;
  const totalTax = federalTax + stateTax;
  const qsbsSavings =
    qsbsExcludedGain * (params.qsbsFederalRate + (input.niitApplies ? params.niitRate : 0));

  return {
    grossCapitalGain: capitalGain,
    qsbsExcludedGain: round2(qsbsExcludedGain),
    qsbsTaxableGain: round2(qsbsTaxableGain),
    qsbsSavings: round2(qsbsSavings),
    federalTax: round2(federalTax),
    stateTax: round2(stateTax),
    totalTaxLiability: round2(totalTax),
    netProceeds: round2(input.equityValue - totalTax),
    effectiveTaxRate: round1((totalTax / input.equityValue) * 100),
  };
}

export function calculateUsExitSnapshot(
  inputs: UsSnapshotFormData,
  disposalDate: Date = new Date(),
): UsSnapshotCalculated {
  const businessValue = safeDecimal(inputs.businessValue) ?? 0;
  const ownershipPercent = safeDecimal(inputs.ownershipPercentage) ?? 0;
  const netWorth = safeDecimal(inputs.netWorth) ?? 0;
  const costBasis = safeDecimal(inputs.costBasis) ?? 0;
  const magi = safeDecimal(inputs.modifiedAdjustedGrossIncome) ?? 0;

  const equityValue = businessValue * (ownershipPercent / 100);
  const grossCapitalGain = equityValue - costBasis;
  const concentration = calculateConcentrationRisk(businessValue, ownershipPercent, netWorth) ?? 0;
  const appliesNiit = niitApplies(magi, inputs.filingStatus);

  const qsbsResult = validateQsbsEligibility({
    entityType: inputs.entityType,
    qsbsEligible: inputs.qsbsEligible,
    corporationQsbsQualified: inputs.corporationQsbsQualified,
    shareholderQsbsQualified: inputs.shareholderQsbsQualified,
    activeBusinessRequirementsMet: inputs.activeBusinessRequirementsMet,
    serviceBusinessExclusionApplies: inputs.serviceBusinessExclusionApplies,
    shareAcquisitionDate: inputs.shareAcquisitionDate,
    disposalDate,
    ownershipPercentage: ownershipPercent,
    costBasis,
    currentGain: Math.max(0, grossCapitalGain),
  });

  const tax = calculateUsQsbsScenario({
    equityValue,
    costBasis,
    qsbsEligible: qsbsResult.isEligible,
    exclusionPercent: qsbsResult.exclusionPercent,
    perIssuerCap: qsbsResult.perIssuerCap,
    niitApplies: appliesNiit,
  });

  return {
    grossProceeds: round2(equityValue),
    equityValue: round2(equityValue),
    grossCapitalGain: round2(tax.grossCapitalGain),
    qsbsExcludedGain: tax.qsbsExcludedGain,
    qsbsTaxableGain: tax.qsbsTaxableGain,
    qsbsSavings: tax.qsbsSavings,
    federalTax: tax.federalTax,
    stateTax: tax.stateTax,
    totalTaxLiability: tax.totalTaxLiability,
    netProceeds: tax.netProceeds,
    effectiveTaxRate: tax.effectiveTaxRate,
    businessValueShareOfNetWorth: round1(concentration),
    qsbsExclusionPercent: qsbsResult.exclusionPercent,
    qsbsPerIssuerCap: qsbsResult.perIssuerCap,
    holdingPeriodYears: round1(qsbsResult.holdingPeriodYears),
    ownershipPercent,
    qsbsEligible: qsbsResult.isEligible,
    qsbsCheckResults: qsbsResult.checkResults,
    niitApplies: appliesNiit,
    calculationDate: disposalDate.toISOString().split('T')[0],
    taxYear: US_TAX_YEAR_LABEL,
    strategyLabel: qsbsResult.isEligible ? 'QSBS Exclusion' : 'Standard capital gains',
  };
}

export function buildUsSnapshotFlags(calculated: UsSnapshotCalculated): import('./types').UsSnapshotFlags {
  const concentration = calculated.businessValueShareOfNetWorth;
  return {
    qsbsEligible: calculated.qsbsEligible,
    concentrationModerate: concentration >= CONCENTRATION_MODERATE_THRESHOLD,
    concentrationHigh: concentration >= CONCENTRATION_HIGH_THRESHOLD,
    concentrationExtreme: concentration >= CONCENTRATION_EXTREME_THRESHOLD,
    effectiveTaxHigh: calculated.effectiveTaxRate > 25,
  };
}
