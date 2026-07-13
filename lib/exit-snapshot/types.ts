import type { SnapshotFormData } from '@/lib/validation/validateSnapshotInputs';

export type { SnapshotFormData };

export interface TaxParameters {
  capitalGainsTaxBasicRate: number;
  capitalGainsTaxHigherRate: number;
  annualCgtExemption: number;
  badrRate202526: number;
  badrLifetimeLimit: number;
  basicRateBand: number;
}

export interface BadrCheckResult {
  checkNumber: number;
  checkName: string;
  passed: boolean;
  detail: string;
  hmrcReference: string;
}

export interface BadrEligibilityResult {
  isEligible: boolean;
  remainingLifetimeCap: number;
  gainQualifyingForBadr: number;
  gainAtStandardRates: number;
  checkResults: BadrCheckResult[];
  holdingPeriodYears: number;
}

export interface SnapshotCalculated {
  grossProceeds: number;
  equityValue: number;
  grossCapitalGain: number;
  allowableLossesApplied: number;
  gainsAfterLosses: number;
  badrQualifyingGain: number;
  badrTax: number;
  nonBadrGain: number;
  aeaApplied: number;
  taxableNonBadrGain: number;
  basicRatePortion: number;
  higherRatePortion: number;
  nonBadrGainTax: number;
  totalTaxLiability: number;
  netProceeds: number;
  effectiveTaxRate: number;
  businessValueShareOfNetWorth: number;
  badrHeadroomRemaining: number;
  holdingPeriodYears: number;
  ownershipPercent: number;
  badrEligible: boolean;
  badrCheckResults: BadrCheckResult[];
  calculationDate: string;
  taxYear: string;
}

export interface SnapshotFlags {
  badrEligible: boolean;
  hasCapitalLoss: boolean;
  concentrationModerate: boolean;
  concentrationHigh: boolean;
  concentrationExtreme: boolean;
  effectiveTaxHigh: boolean;
  badrHeadroomExceeded: boolean;
  assumptionCount: number;
}

export interface SnapshotContext {
  inputs: SnapshotFormData;
  calculated: SnapshotCalculated;
  flags: SnapshotFlags;
}

export type Severity = 'info' | 'warning' | 'critical';

export type RuleOperator =
  | 'exists'
  | 'missing'
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'between'
  | 'in'
  | 'notIn'
  | 'dateBefore'
  | 'dateAfter';

export interface RuleCondition {
  field: string;
  operator: RuleOperator;
  value?: string | number | boolean | Array<string | number> | { min: number; max: number };
  valueField?: string;
}

export interface NarrativeRule {
  id: string;
  category: string;
  priority: number;
  severity: Severity;
  conditions: RuleCondition[];
  template: string;
  variables: string[];
  disclaimerTags: string[];
  displayOrder: number;
  jurisdiction: 'UK';
  appliesWhen: 'clientFacing' | 'adviserOnly';
  mutualExclusionGroup?: string;
  version: string;
  effectiveFrom: string;
  effectiveTo?: string;
}

export interface MatchedNarrativeRule {
  rule: NarrativeRule;
  renderedText: string;
}

export interface SnapshotReport {
  context: SnapshotContext;
  matchedRules: MatchedNarrativeRule[];
  fullHtml: string;
  previewHtml: string;
}
