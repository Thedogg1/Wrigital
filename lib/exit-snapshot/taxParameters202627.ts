import type { TaxParameters } from './types';

/**
 * Frozen 2026/27 parameters.
 * BADR rate: 18% for disposals on or after 6 April 2026 (GOV.UK HS275).
 * Standard CGT: 18% basic / 24% higher; AEA £3,000; BADR lifetime limit £1m.
 */
export const TAX_PARAMETERS_2026_27: TaxParameters = {
  capitalGainsTaxBasicRate: 0.18,
  capitalGainsTaxHigherRate: 0.24,
  annualCgtExemption: 3_000,
  badrRate: 0.18,
  badrLifetimeLimit: 1_000_000,
  basicRateBand: 37_700,
};

export const TAX_YEAR_LABEL = '2026/27';
export const BADR_RATE_LABEL = '18%';
