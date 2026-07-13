import type { NarrativeRule } from './types';

export const US_NARRATIVE_RULES: NarrativeRule[] = [
  {
    id: 'us.exit.concentration.extreme.01',
    category: 'concentration',
    priority: 90,
    severity: 'critical',
    conditions: [{ field: 'concentrationExtreme', operator: 'eq', value: true }],
    template:
      'Approximately {businessValueShareOfNetWorth} of total net worth is concentrated in the business stake — an extreme concentration position based on the assumptions entered.',
    variables: ['businessValueShareOfNetWorth'],
    displayOrder: 10,
    jurisdiction: 'US',
  },
  {
    id: 'us.exit.concentration.high.01',
    category: 'concentration',
    priority: 80,
    severity: 'warning',
    conditions: [{ field: 'concentrationHigh', operator: 'eq', value: true }],
    template:
      'Approximately {businessValueShareOfNetWorth} of net worth is concentrated in the business stake, based on the assumptions entered.',
    variables: ['businessValueShareOfNetWorth'],
    displayOrder: 20,
    jurisdiction: 'US',
  },
  {
    id: 'us.qsbs.eligible.01',
    category: 'qsbs',
    priority: 85,
    severity: 'info',
    conditions: [{ field: 'qsbsEligible', operator: 'eq', value: true }],
    template:
      'Based on the inputs entered, the position meets the stated QSBS tests with a {qsbsExclusionPercent}% exclusion tier, subject to adviser verification.',
    variables: ['qsbsExclusionPercent'],
    displayOrder: 30,
    jurisdiction: 'US',
  },
  {
    id: 'us.qsbs.ineligible.01',
    category: 'qsbs',
    priority: 84,
    severity: 'warning',
    conditions: [{ field: 'qsbsEligible', operator: 'eq', value: false }],
    template:
      'QSBS exclusion does not apply on the current assumptions. Tax is modelled on standard federal long-term capital gains and state rates.',
    variables: [],
    displayOrder: 31,
    jurisdiction: 'US',
  },
  {
    id: 'us.tax.effective.high.01',
    category: 'tax',
    priority: 70,
    severity: 'warning',
    conditions: [{ field: 'effectiveTaxHigh', operator: 'eq', value: true }],
    template:
      'The effective tax rate on exit proceeds is {effectiveTaxRate}% on the assumptions entered — worth exploring QSBS, relocation, and installment strategies in a full report.',
    variables: ['effectiveTaxRate'],
    displayOrder: 40,
    jurisdiction: 'US',
  },
];
