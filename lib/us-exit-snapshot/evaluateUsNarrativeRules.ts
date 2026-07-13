import { formatUsd } from '@/lib/validation/validateUsSnapshotInputs';
import { buildUsSnapshotFlags } from './calculateUsExitSnapshot';
import type {
  MatchedNarrativeRule,
  RuleCondition,
  UsSnapshotCalculated,
  UsSnapshotContext,
  UsSnapshotFormData,
} from './types';
import { US_NARRATIVE_RULES } from './narrativeRules';

const SEVERITY_ORDER: Record<string, number> = {
  critical: 0,
  warning: 1,
  info: 2,
};

type ContextValue = string | number | boolean | null | undefined;

function getContextValue(context: UsSnapshotContext, field: string): ContextValue {
  if (field in context.flags) {
    return context.flags[field as keyof typeof context.flags];
  }
  if (field in context.calculated) {
    return context.calculated[field as keyof typeof context.calculated] as ContextValue;
  }
  return undefined;
}

function evaluateCondition(context: UsSnapshotContext, condition: RuleCondition): boolean {
  const fieldValue = getContextValue(context, condition.field);
  const compareValue = condition.value;

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
    default:
      return false;
  }
}

function renderTemplate(template: string, context: UsSnapshotContext): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = getContextValue(context, key);
    if (typeof value === 'number' && key.toLowerCase().includes('proceeds')) {
      return formatUsd(value);
    }
    return value === undefined || value === null ? '' : String(value);
  });
}

export function buildUsSnapshotContext(
  inputs: UsSnapshotFormData,
  calculated: UsSnapshotCalculated,
): UsSnapshotContext {
  return {
    inputs,
    calculated,
    flags: buildUsSnapshotFlags(calculated),
  };
}

export function evaluateUsNarrativeRules(context: UsSnapshotContext): MatchedNarrativeRule[] {
  const matched: MatchedNarrativeRule[] = [];

  for (const rule of US_NARRATIVE_RULES) {
    const allMatch = rule.conditions.every((c) => evaluateCondition(context, c));
    if (!allMatch) continue;
    matched.push({
      rule,
      renderedText: renderTemplate(rule.template, context),
    });
  }

  return matched.sort((a, b) => {
    const sev = SEVERITY_ORDER[a.rule.severity] - SEVERITY_ORDER[b.rule.severity];
    if (sev !== 0) return sev;
    return a.rule.displayOrder - b.rule.displayOrder;
  });
}
