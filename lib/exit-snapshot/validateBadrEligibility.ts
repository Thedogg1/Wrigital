import { BADR_HOLDING_PERIOD_YEARS } from '@/lib/validation/validation-library-core';
import type { BadrCheckResult, BadrEligibilityResult } from './types';

const LIFETIME_LIMIT = 1_000_000;
const MIN_OWNERSHIP_PERCENT = 5;
const MIN_VOTING_RIGHTS_PERCENT = 5;

export interface BadrEligibilityInput {
  isTradingCompany: boolean;
  shareAcquisitionDate: string;
  disposalDate: Date;
  ownershipPercentage: number;
  votingRightsPercentage: number;
  isOfficerOrEmployeeForQualifyingPeriod: boolean;
  previousBadrClaimed: number;
  currentGain: number;
}

function parseIsoDate(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00');
}

function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

function yearsBetween(date1: Date, date2: Date): number {
  return (date2.getTime() - date1.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
}

export function validateBadrEligibility(input: BadrEligibilityInput): BadrEligibilityResult {
  const checks: BadrCheckResult[] = [];

  checks.push({
    checkNumber: 1,
    checkName: 'Trading Company',
    passed: input.isTradingCompany,
    detail: input.isTradingCompany
      ? 'Company confirmed as trading company (not a close investment-holding company).'
      : 'FAIL: Company is not a trading company. BADR requires a trading company or holding company of a trading group (CG64055).',
    hmrcReference: 'CG64055/CG64060',
  });

  const acquisitionDate = parseIsoDate(input.shareAcquisitionDate);
  const threshold = addYears(input.disposalDate, -BADR_HOLDING_PERIOD_YEARS);
  const holdingPeriodPassed = acquisitionDate <= threshold;
  const holdingYears = yearsBetween(acquisitionDate, input.disposalDate);

  checks.push({
    checkNumber: 2,
    checkName: 'Share Holding Period',
    passed: holdingPeriodPassed,
    detail: holdingPeriodPassed
      ? `Shares acquired ${input.shareAcquisitionDate}, disposal ${input.disposalDate.toISOString().split('T')[0]} — ≥${BADR_HOLDING_PERIOD_YEARS}-year holding period satisfied.`
      : `FAIL: Shares acquired ${input.shareAcquisitionDate} — less than ${BADR_HOLDING_PERIOD_YEARS} years of ownership.`,
    hmrcReference: 'HS275',
  });

  const ownershipPassed = input.ownershipPercentage >= MIN_OWNERSHIP_PERCENT;
  checks.push({
    checkNumber: 3,
    checkName: 'Ownership Percentage',
    passed: ownershipPassed,
    detail: ownershipPassed
      ? `Ownership ${input.ownershipPercentage.toFixed(1)}% — meets ≥${MIN_OWNERSHIP_PERCENT}% threshold.`
      : `FAIL: Ownership ${input.ownershipPercentage.toFixed(1)}% — below the ≥${MIN_OWNERSHIP_PERCENT}% minimum.`,
    hmrcReference: 'HS275 / Personal Company definition',
  });

  const votingPassed = input.votingRightsPercentage >= MIN_VOTING_RIGHTS_PERCENT;
  checks.push({
    checkNumber: 4,
    checkName: 'Voting Rights',
    passed: votingPassed,
    detail: votingPassed
      ? `Voting rights ${input.votingRightsPercentage.toFixed(1)}% — meets ≥${MIN_VOTING_RIGHTS_PERCENT}% threshold.`
      : `FAIL: Voting rights ${input.votingRightsPercentage.toFixed(1)}% — below the ≥${MIN_VOTING_RIGHTS_PERCENT}% minimum.`,
    hmrcReference: 'HS275 / Personal Company definition',
  });

  checks.push({
    checkNumber: 5,
    checkName: 'Officer or Employee Status',
    passed: input.isOfficerOrEmployeeForQualifyingPeriod,
    detail: input.isOfficerOrEmployeeForQualifyingPeriod
      ? `Advisor confirms: individual was an officer or employee for the ${BADR_HOLDING_PERIOD_YEARS}-year qualifying period.`
      : `FAIL: Individual was NOT an officer or employee for the ${BADR_HOLDING_PERIOD_YEARS}-year qualifying period.`,
    hmrcReference: 'HS275 / CG64000+',
  });

  const headroom = Math.max(0, LIFETIME_LIMIT - input.previousBadrClaimed);
  const gainQualifying = Math.min(input.currentGain, headroom);
  const gainAtStandard = input.currentGain - gainQualifying;
  const lifetimeCapPassed = headroom > 0;

  let lifetimeDetail: string;
  if (headroom <= 0) {
    lifetimeDetail = `EXHAUSTED: Previous claims £${input.previousBadrClaimed.toLocaleString('en-GB')} have fully consumed the £${LIFETIME_LIMIT.toLocaleString('en-GB')} lifetime limit.`;
  } else if (gainAtStandard > 0) {
    lifetimeDetail = `PARTIALLY AVAILABLE: Remaining headroom £${headroom.toLocaleString('en-GB')}. £${gainQualifying.toLocaleString('en-GB')} of current gain qualifies for BADR.`;
  } else {
    lifetimeDetail = `AVAILABLE: Remaining headroom £${headroom.toLocaleString('en-GB')}. Full current gain qualifies for BADR rate.`;
  }

  checks.push({
    checkNumber: 6,
    checkName: 'Lifetime Limit',
    passed: lifetimeCapPassed,
    detail: lifetimeDetail,
    hmrcReference: 'HS275 / BADR Lifetime Limit',
  });

  const coreEligible =
    input.isTradingCompany &&
    holdingPeriodPassed &&
    ownershipPassed &&
    votingPassed &&
    input.isOfficerOrEmployeeForQualifyingPeriod;

  const isEligible = coreEligible && lifetimeCapPassed;

  return {
    isEligible,
    remainingLifetimeCap: headroom,
    gainQualifyingForBadr: isEligible ? gainQualifying : 0,
    gainAtStandardRates: isEligible ? gainAtStandard : input.currentGain,
    checkResults: checks,
    holdingPeriodYears: holdingYears,
  };
}
