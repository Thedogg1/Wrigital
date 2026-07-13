import { formatCurrency } from '@/lib/validation/validation-library-core';
import type {
  MatchedNarrativeRule,
  NarrativeRule,
  RuleCondition,
  SnapshotContext,
} from './types';
import { NARRATIVE_RULES } from './narrativeRules';

const SEVERITY_ORDER: Record<string, number> = {
  critical: 0,
  warning: 1,
  info: 2,
};

type ContextValue = string | number | boolean | null | undefined;

function getContextValue(context: SnapshotContext, field: string): ContextValue {
  if (field in context.flags) {
    return context.flags[field as keyof typeof context.flags];
  }
  if (field in context.calculated) {
    return context.calculated[field as keyof typeof context.calculated] as ContextValue;
  }
  return undefined;
}

function evaluateCondition(context: SnapshotContext, condition: RuleCondition): boolean {
  const fieldValue = getContextValue(context, condition.field);
  const compareValue =
    condition.valueField !== undefined
      ? getContextValue(context, condition.valueField)
      : condition.value;

  switch (condition.operator) {
    case 'exists':
      return fieldValue !== null && fieldValue !== undefined && fieldValue !== '';
    case 'missing':
      return fieldValue === null || fieldValue === undefined || fieldValue === '';
    case 'eq':
      return fieldValue === compareValue;
    case 'neq':
      return fieldValue !== compareValue;
    case 'gt':
      return typeof fieldValue === 'number' && typeof compareValue === 'number' && fieldValue > compareValue;
    case 'gte':
      return typeof fieldValue === 'number' && typeof compareValue === 'number' && fieldValue >= compareValue;
    case 'lt':
      return typeof fieldValue === 'number' && typeof compareValue === 'number' && fieldValue < compareValue;
    case 'lte':
      return typeof fieldValue === 'number' && typeof compareValue === 'number' && fieldValue <= compareValue;
    case 'between': {
      if (typeof fieldValue !== 'number') return false;
      const range = compareValue as { min: number; max: number };
      return fieldValue >= range.min && fieldValue <= range.max;
    }
    case 'in':
      return Array.isArray(compareValue) && compareValue.includes(fieldValue as string | number);
    case 'notIn':
      return Array.isArray(compareValue) && !compareValue.includes(fieldValue as string | number);
    default:
      return false;
  }
}

function allConditionsMatch(context: SnapshotContext, rule: NarrativeRule): boolean {
  return rule.conditions.every((c) => evaluateCondition(context, c));
}

function formatVariable(context: SnapshotContext, key: string): string {
  const value = getContextValue(context, key);
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') {
    const currencyKeys = [
      'grossCapitalGain',
      'gainsAfterLosses',
      'badrQualifyingGain',
      'badrHeadroomRemaining',
      'basicRatePortion',
      'higherRatePortion',
      'nonBadrGainTax',
      'netProceeds',
      'equityValue',
      'totalTaxLiability',
    ];
    if (currencyKeys.includes(key)) return formatCurrency(value);
    if (key === 'effectiveTaxRate' || key === 'businessValueShareOfNetWorth' || key === 'ownershipPercent') {
      return `${value}%`;
    }
    if (key === 'holdingPeriodYears') return `${value} years`;
    return String(value);
  }
  return String(value);
}

function interpolateTemplate(context: SnapshotContext, rule: NarrativeRule): string {
  let text = rule.template;
  for (const variable of rule.variables) {
    text = text.replace(`{${variable}}`, formatVariable(context, variable));
  }
  return text;
}

function sortRules(rules: NarrativeRule[]): NarrativeRule[] {
  return [...rules].sort((a, b) => {
    const sevDiff = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
    if (sevDiff !== 0) return sevDiff;
    if (b.priority !== a.priority) return b.priority - a.priority;
    return a.displayOrder - b.displayOrder;
  });
}

function applyMutualExclusion(rules: NarrativeRule[]): NarrativeRule[] {
  const seen = new Set<string>();
  const result: NarrativeRule[] = [];
  for (const rule of rules) {
    if (rule.mutualExclusionGroup) {
      if (seen.has(rule.mutualExclusionGroup)) continue;
      seen.add(rule.mutualExclusionGroup);
    }
    result.push(rule);
  }
  return result;
}

export function evaluateNarrativeRules(context: SnapshotContext): MatchedNarrativeRule[] {
  const matched = NARRATIVE_RULES.filter(
    (rule) => rule.appliesWhen === 'clientFacing' && allConditionsMatch(context, rule),
  );
  const sorted = sortRules(matched);
  const deduped = applyMutualExclusion(sorted);
  return deduped.map((rule) => ({
    rule,
    renderedText: interpolateTemplate(context, rule),
  }));
}

export function collectDisclaimerTags(matchedRules: MatchedNarrativeRule[]): string[] {
  const tags = new Set<string>();
  for (const { rule } of matchedRules) {
    for (const tag of rule.disclaimerTags) tags.add(tag);
  }
  return Array.from(tags);
}
