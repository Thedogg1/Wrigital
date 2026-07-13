/** Frozen US tax parameters — aligned with business_usa niche parameters.json */
export const US_TAX_PARAMETERS = {
  federalLtcgRate: 0.2,
  federalOrdinaryIncomeRate: 0.37,
  qsbsFederalRate: 0.28,
  niitRate: 0.038,
  stateCapitalGainsRate: 0.133,
  niitThresholdSingle: 200_000,
  niitThresholdMarriedFilingJoint: 250_000,
  qsbsLegacyPerIssuerCap: 10_000_000,
  qsbsPost2025PerIssuerCap: 15_000_000,
} as const;

export const US_TAX_YEAR_LABEL = '2026';
