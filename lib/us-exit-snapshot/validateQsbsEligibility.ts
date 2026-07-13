import { US_TAX_PARAMETERS } from './taxParameters';
import type { QsbsCheckResult } from './types';

const POST_2025_CUTOFF = new Date('2025-07-04');
const LEGACY_2009_02_18 = new Date('2009-02-18');
const LEGACY_2010_09_27 = new Date('2010-09-27');

export interface QsbsEligibilityInput {
  entityType: string;
  qsbsEligible: boolean;
  corporationQsbsQualified: boolean;
  shareholderQsbsQualified: boolean;
  activeBusinessRequirementsMet: boolean;
  serviceBusinessExclusionApplies: boolean;
  shareAcquisitionDate: string;
  disposalDate: Date;
  ownershipPercentage: number;
  costBasis: number;
  currentGain: number;
}

export interface QsbsEligibilityResult {
  isEligible: boolean;
  exclusionPercent: number;
  perIssuerCap: number;
  holdingPeriodYears: number;
  checkResults: QsbsCheckResult[];
  ineligibleReason?: string;
}

function parseDate(value: string): Date | null {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function yearsBetween(start: Date, end: Date): number {
  return (end.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
}

function computePerIssuerCap(acquisitionDate: Date, costBasis: number): number {
  if (acquisitionDate >= POST_2025_CUTOFF) {
    return US_TAX_PARAMETERS.qsbsPost2025PerIssuerCap;
  }
  return Math.max(US_TAX_PARAMETERS.qsbsLegacyPerIssuerCap, 10 * costBasis);
}

function computeExclusionPercent(
  acquisitionDate: Date,
  holdingPeriodYears: number,
): { percent: number; reason?: string } {
  if (acquisitionDate >= POST_2025_CUTOFF) {
    if (holdingPeriodYears >= 5) return { percent: 100 };
    if (holdingPeriodYears >= 4) return { percent: 75 };
    if (holdingPeriodYears >= 3) return { percent: 50 };
    return {
      percent: 0,
      reason: `Post-2025 QSBS requires holding period ≥ 3 years. Found: ${holdingPeriodYears.toFixed(1)} years.`,
    };
  }

  if (holdingPeriodYears < 5) {
    return {
      percent: 0,
      reason: `Legacy QSBS requires more-than-five-year holding period. Found: ${holdingPeriodYears.toFixed(1)} years.`,
    };
  }

  if (acquisitionDate < LEGACY_2009_02_18) return { percent: 50 };
  if (acquisitionDate < LEGACY_2010_09_27) return { percent: 75 };
  return { percent: 100 };
}

export function validateQsbsEligibility(input: QsbsEligibilityInput): QsbsEligibilityResult {
  const acquisitionDate = parseDate(input.shareAcquisitionDate);
  const checkResults: QsbsCheckResult[] = [];
  let checkNumber = 1;

  const addCheck = (name: string, passed: boolean, detail: string, reference: string) => {
    checkResults.push({ checkNumber: checkNumber++, checkName: name, passed, detail, reference });
  };

  if (input.entityType !== 'C-Corp') {
    addCheck(
      'C-Corporation entity',
      false,
      `QSBS requires C-Corporation entity type. Found: ${input.entityType}.`,
      'IRC §1202',
    );
    return {
      isEligible: false,
      exclusionPercent: 0,
      perIssuerCap: 0,
      holdingPeriodYears: 0,
      checkResults,
      ineligibleReason: `QSBS requires C-Corporation entity type. Found: ${input.entityType}.`,
    };
  }
  addCheck('C-Corporation entity', true, 'Entity type is C-Corporation.', 'IRC §1202');

  if (!input.qsbsEligible) {
    addCheck('QSBS election', false, 'QSBS eligibility is explicitly false.', 'IRC §1202');
    return {
      isEligible: false,
      exclusionPercent: 0,
      perIssuerCap: 0,
      holdingPeriodYears: acquisitionDate ? yearsBetween(acquisitionDate, input.disposalDate) : 0,
      checkResults,
      ineligibleReason: 'QSBS eligibility is explicitly false.',
    };
  }
  addCheck('QSBS election', true, 'QSBS eligibility flagged true.', 'IRC §1202');

  if (!input.corporationQsbsQualified) {
    addCheck('Corporation qualification', false, 'Corporation does not meet QSBS qualification requirements.', 'IRC §1202');
    return {
      isEligible: false,
      exclusionPercent: 0,
      perIssuerCap: 0,
      holdingPeriodYears: 0,
      checkResults,
      ineligibleReason: 'Corporation does not meet QSBS qualification requirements.',
    };
  }
  addCheck('Corporation qualification', true, 'Corporation meets stated QSBS tests.', 'IRC §1202');

  if (!input.shareholderQsbsQualified) {
    addCheck('Shareholder qualification', false, 'Shareholder does not meet QSBS qualification requirements.', 'IRC §1202');
    return {
      isEligible: false,
      exclusionPercent: 0,
      perIssuerCap: 0,
      holdingPeriodYears: 0,
      checkResults,
      ineligibleReason: 'Shareholder does not meet QSBS qualification requirements.',
    };
  }
  addCheck('Shareholder qualification', true, 'Shareholder meets stated QSBS tests.', 'IRC §1202');

  if (!input.activeBusinessRequirementsMet) {
    addCheck('Active business test', false, 'Active business requirements for QSBS are not met.', 'IRC §1202');
    return {
      isEligible: false,
      exclusionPercent: 0,
      perIssuerCap: 0,
      holdingPeriodYears: 0,
      checkResults,
      ineligibleReason: 'Active business requirements for QSBS are not met.',
    };
  }
  addCheck('Active business test', true, 'Active business requirements met.', 'IRC §1202');

  if (input.serviceBusinessExclusionApplies) {
    addCheck('Service business exclusion', false, 'Service business exclusion applies — QSBS not available.', 'IRC §1202');
    return {
      isEligible: false,
      exclusionPercent: 0,
      perIssuerCap: 0,
      holdingPeriodYears: 0,
      checkResults,
      ineligibleReason: 'Service business exclusion applies — QSBS not available.',
    };
  }
  addCheck('Service business exclusion', true, 'No service business exclusion applies.', 'IRC §1202');

  if (!acquisitionDate) {
    return {
      isEligible: false,
      exclusionPercent: 0,
      perIssuerCap: 0,
      holdingPeriodYears: 0,
      checkResults,
      ineligibleReason: 'Share acquisition date is invalid.',
    };
  }

  const holdingPeriodYears = yearsBetween(acquisitionDate, input.disposalDate);
  const exclusion = computeExclusionPercent(acquisitionDate, holdingPeriodYears);
  addCheck(
    'Holding period',
    !exclusion.reason,
    exclusion.reason ??
      `Shares held ${holdingPeriodYears.toFixed(1)} years — ${exclusion.percent}% QSBS exclusion tier applies.`,
    'IRC §1202',
  );

  if (exclusion.reason) {
    return {
      isEligible: false,
      exclusionPercent: 0,
      perIssuerCap: computePerIssuerCap(acquisitionDate, input.costBasis),
      holdingPeriodYears,
      checkResults,
      ineligibleReason: exclusion.reason,
    };
  }

  return {
    isEligible: true,
    exclusionPercent: exclusion.percent,
    perIssuerCap: computePerIssuerCap(acquisitionDate, input.costBasis),
    holdingPeriodYears,
    checkResults,
  };
}
