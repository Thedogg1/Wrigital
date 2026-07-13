import type { TaxParameters } from './types';

/** Frozen 2025/26 parameters from uk_generic / TestTaxParameters.Create() */
export const TAX_PARAMETERS_2025_26: TaxParameters = {
  capitalGainsTaxBasicRate: 0.18,
  capitalGainsTaxHigherRate: 0.24,
  annualCgtExemption: 3_000,
  badrRate202526: 0.14,
  badrLifetimeLimit: 1_000_000,
  basicRateBand: 37_700,
};

export const TAX_YEAR_LABEL = '2025/26';
export const BADR_RATE_LABEL = '14%';
