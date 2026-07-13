/**
 * Validation Library Core — Wrigital UK
 * Shared utilities, constants, and formula functions.
 */

export interface ValidationError {
  field: string;
  type: string;
  message: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  calculatedValues?: {
    effectiveTaxRate?: number;
    revenueMultiple?: number;
    concentrationRisk?: number;
    capitalGain?: number;
    badrRelievedGain?: number;
    badrTax?: number;
  };
}

export const UK_ENTITY_TYPES = ['Ltd', 'PLC', 'LLP', 'Partnership', 'SoleTrader'] as const;
export type UkEntityType = (typeof UK_ENTITY_TYPES)[number];

export const BADR_HOLDING_PERIOD_YEARS = 2;
export const BADR_LIFETIME_LIMIT = 1_000_000;
export const BADR_RATE = 0.14;
export const CGT_BASIC_RATE = 0.18;
export const CGT_HIGHER_RATE = 0.24;
export const CGT_ANNUAL_EXEMPT_AMOUNT = 3_000;
export const EFFECTIVE_TAX_RATE_MAX = 0.5;

export const CONCENTRATION_EXTREME_THRESHOLD = 80;
export const CONCENTRATION_HIGH_THRESHOLD = 60;
export const CONCENTRATION_MODERATE_THRESHOLD = 40;
export const CONCENTRATION_MISMATCH_TOLERANCE = 5;

export const REVENUE_MULTIPLE_WARNING_THRESHOLD = 100;
export const BUSINESS_VALUE_HIGH_MULTIPLE = 5;
export const BUSINESS_VALUE_MODERATE_MULTIPLE = 3;

export function safeDecimal(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  const num =
    typeof value === 'string'
      ? parseFloat(value.replace(/[^0-9.-]/g, ''))
      : value;
  return isNaN(num) ? null : num;
}

export function safeString(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

export function isValidDateFormat(dateString: unknown): boolean {
  if (!dateString) return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(String(dateString));
}

export function parseDate(dateString: unknown): Date | null {
  if (!isValidDateFormat(dateString)) return null;
  const date = new Date(String(dateString) + 'T00:00:00');
  return isNaN(date.getTime()) ? null : date;
}

function yearsBetween(date1: Date, date2: Date): number {
  return (date2.getTime() - date1.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export interface UkHoldingPeriodResult {
  isValid: boolean;
  yearsHeld: number;
  eligibilityDate: Date | null;
}

export function validateBadrHoldingPeriod(
  shareIssuanceDate: string | null | undefined,
  referenceDate: Date = new Date(),
): UkHoldingPeriodResult {
  const issuanceDate = parseDate(shareIssuanceDate);
  if (!issuanceDate) return { isValid: false, yearsHeld: 0, eligibilityDate: null };

  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);
  if (issuanceDate > today) return { isValid: false, yearsHeld: 0, eligibilityDate: null };

  const yearsHeld = yearsBetween(issuanceDate, today);
  const eligibilityDate = new Date(issuanceDate);
  eligibilityDate.setFullYear(eligibilityDate.getFullYear() + BADR_HOLDING_PERIOD_YEARS);

  return {
    isValid: yearsHeld >= BADR_HOLDING_PERIOD_YEARS,
    yearsHeld,
    eligibilityDate,
  };
}

export function calculateConcentrationRisk(
  businessValue: number | null,
  ownershipPercentage: number | null,
  netWorth: number | null,
): number | null {
  if (!businessValue || !ownershipPercentage || !netWorth || netWorth === 0) return null;
  const ownershipFraction = ownershipPercentage / 100;
  const businessEquity = businessValue * ownershipFraction;
  return (businessEquity / netWorth) * 100;
}

export function calculateCapitalGain(
  businessValue: number | null,
  ownershipPercentage: number | null,
  costBasis: number | null,
): number | null {
  if (!businessValue || !ownershipPercentage) return null;
  const ownershipFraction = ownershipPercentage / 100;
  const equityStake = businessValue * ownershipFraction;
  return equityStake - (costBasis || 0);
}

export function calculateRevenueMultiple(
  businessValue: number | null,
  annualRevenue: number | null,
): number | null {
  if (!annualRevenue || annualRevenue === 0) return null;
  if (!businessValue || businessValue === 0) return null;
  return businessValue / annualRevenue;
}
