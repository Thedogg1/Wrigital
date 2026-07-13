import type { UsSnapshotFormData } from '@/lib/validation/validateUsSnapshotInputs';

export type { UsSnapshotFormData };

export interface QsbsCheckResult {
  checkNumber: number;
  checkName: string;
  passed: boolean;
  detail: string;
  reference: string;
}

export interface UsSnapshotCalculated {
  grossProceeds: number;
  equityValue: number;
  grossCapitalGain: number;
  qsbsExcludedGain: number;
  qsbsTaxableGain: number;
  qsbsSavings: number;
  federalTax: number;
  stateTax: number;
  totalTaxLiability: number;
  netProceeds: number;
  effectiveTaxRate: number;
  businessValueShareOfNetWorth: number;
  qsbsExclusionPercent: number;
  qsbsPerIssuerCap: number;
  holdingPeriodYears: number;
  ownershipPercent: number;
  qsbsEligible: boolean;
  qsbsCheckResults: QsbsCheckResult[];
  niitApplies: boolean;
  calculationDate: string;
  taxYear: string;
  strategyLabel: string;
}

export interface UsSnapshotFlags {
  qsbsEligible: boolean;
  concentrationModerate: boolean;
  concentrationHigh: boolean;
  concentrationExtreme: boolean;
  effectiveTaxHigh: boolean;
}

export interface UsSnapshotContext {
  inputs: UsSnapshotFormData;
  calculated: UsSnapshotCalculated;
  flags: UsSnapshotFlags;
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
  | 'lte';

export interface RuleCondition {
  field: string;
  operator: RuleOperator;
  value?: string | number | boolean;
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
  displayOrder: number;
  jurisdiction: 'US';
}

export interface MatchedNarrativeRule {
  rule: NarrativeRule;
  renderedText: string;
}
