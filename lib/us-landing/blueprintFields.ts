import nicheFile from '@/lib/us-landing/businessUsaNicheFields.json';

/**
 * Host-standard fields: financialinsights/docs/QUESTIONNAIRE_REQUIRED_FIELDS.md
 * and financialinsights/lib/viq-workflow/masterFieldList.ts.
 * Niche fields: financialinsights/app/admin/niche-wizard/book_outlines/BusinessUSA/required_client_fields.json
 *
 * Payload niche id is business_usa. The niche pack folder name is BusinessUSA.
 * Niche "required" metadata is not blocking on this lead magnet.
 * UK-only fields (BADR, EIS, Gift Aid, and similar) are not included.
 */

export const BUSINESS_USA_NICHE_ID = 'business_usa' as const;

export const US_ENTITY_TYPES = [
  'C-Corp',
  'S-Corp',
  'LLC',
  'Partnership',
] as const;

export type FieldKind =
  | 'text'
  | 'integer'
  | 'usd'
  | 'percent_0_100'
  | 'decimal_0_1'
  | 'number'
  | 'entity'
  | 'date'
  | 'boolean';

export type FieldSection = 'starting' | 'niche' | 'optional';

export interface BlueprintField {
  path: string;
  label: string;
  help: string;
  kind: FieldKind;
  section: FieldSection;
  group: string;
  blocking: boolean;
  defaultValue?: string;
}

interface NicheFieldJson {
  path: string;
  label: string;
  description: string;
  data_type: string;
  example_value?: string | number;
}

function nicheHelp(field: NicheFieldJson): string {
  const unit =
    field.data_type === 'percentage'
      ? ' Enter a decimal. 0.10 means 10%.'
      : field.data_type === 'currency'
        ? ' Enter a USD amount.'
        : field.data_type === 'integer'
          ? ' Enter a whole number.'
          : '';
  return `${field.description}${unit}`;
}

function nicheKind(dataType: string): FieldKind {
  if (dataType === 'currency') return 'usd';
  if (dataType === 'percentage') return 'decimal_0_1';
  if (dataType === 'number') return 'number';
  if (dataType === 'integer') return 'integer';
  return 'text';
}

function nicheGroup(path: string): string {
  if (
    /future_value_target|present_value_amount|discount_rate|time_horizon_years|cash_flow_schedule|initial_investment/.test(
      path,
    )
  ) {
    return 'Time value of money';
  }
  if (
    /market_value_of_equity|market_value_of_debt|cost_of_equity|cost_of_debt|marginal_tax_rate|risk_free_rate|market_expected_return|equity_beta/.test(
      path,
    )
  ) {
    return 'Cost of capital';
  }
  if (/current_assets|current_liabilities|total_liabilities|total_equity/.test(path)) {
    return 'Liquidity and leverage';
  }
  if (/net_income|beginning_equity|ending_equity|net_sales/.test(path)) {
    return 'Profitability';
  }
  if (
    /above_the_line_deductions|standard_or_itemized_deductions|qualified_business_income|net_earnings_from_self_employment|social_security_wage_base|net_investment_income|modified_adjusted_gross_income|niit_threshold_amount|client_filing_status/.test(
      path,
    )
  ) {
    return 'Tax';
  }
  if (
    /taxable_estate_value|applicable_estate_tax_credit|estate_tax_rate_schedule_reference|prior_year_retirement_account_balance|irs_distribution_period_factor/.test(
      path,
    )
  ) {
    return 'Estate and retirement';
  }
  if (/portfolio_expected_return|portfolio_return_series/.test(path)) {
    return 'Portfolio';
  }
  if (
    /net_operating_income|total_debt_service|total_sales|total_variable_costs/.test(
      path,
    )
  ) {
    return 'Operations';
  }
  return 'BusinessUSA fields';
}

const nicheJson = nicheFile as {
  niche_specific_fields: {
    required: NicheFieldJson[];
    optional: NicheFieldJson[];
  };
};

function toNicheField(field: NicheFieldJson): BlueprintField {
  return {
    path: field.path,
    label: field.label,
    help: nicheHelp(field),
    kind: nicheKind(field.data_type),
    section: 'niche',
    group: nicheGroup(field.path),
    blocking: false,
  };
}

export const MANDATORY_FIELDS: BlueprintField[] = [
  {
    path: 'client_profile.name',
    label: 'Representative owner name',
    help: 'A fictional name for this demonstration. This is not your name, and it is not a real client.',
    kind: 'text',
    section: 'starting',
    group: 'Representative owner',
    blocking: true,
    defaultValue: 'Representative Business Owner',
  },
  {
    path: 'client_profile.age',
    label: 'Age',
    help: 'Used for planning horizon and age-related context.',
    kind: 'integer',
    section: 'starting',
    group: 'Representative owner',
    blocking: true,
    defaultValue: '55',
  },
  {
    path: 'client_profile.net_worth',
    label: 'Net worth',
    help: 'USD. Used with the business stake to calculate concentration.',
    kind: 'usd',
    section: 'starting',
    group: 'Representative owner',
    blocking: true,
    defaultValue: '12000000',
  },
  {
    path: 'client_profile.primary_business.entity_type',
    label: 'Entity type',
    help: 'Routes how tax questions are framed.',
    kind: 'entity',
    section: 'starting',
    group: 'Primary business',
    blocking: true,
    defaultValue: 'C-Corp',
  },
  {
    path: 'client_profile.primary_business.ownership_percentage',
    label: 'Ownership percentage',
    help: 'Percent from above 0 to 100. 80 means 80%.',
    kind: 'percent_0_100',
    section: 'starting',
    group: 'Primary business',
    blocking: true,
    defaultValue: '80',
  },
  {
    path: 'client_profile.primary_business.annual_revenue',
    label: 'Annual revenue',
    help: 'USD. Can support revenue-based context.',
    kind: 'usd',
    section: 'starting',
    group: 'Primary business',
    blocking: true,
    defaultValue: '10000000',
  },
  {
    path: 'client_profile.primary_business.ebitda',
    label: 'EBITDA',
    help: 'USD. The demonstration default is $1,800,000. At an illustrative 4.5x earnings multiple, that is consistent with the $8,100,000 business value default.',
    kind: 'usd',
    section: 'starting',
    group: 'Primary business',
    blocking: true,
    defaultValue: '1800000',
  },
  {
    path: 'client_profile.primary_business.business_value',
    label: 'Business value',
    help: 'USD. Demonstration default $8,100,000. Change it if you want to explore a different scenario. This figure is not automatically the right valuation.',
    kind: 'usd',
    section: 'starting',
    group: 'Primary business',
    blocking: true,
    defaultValue: '8100000',
  },
  {
    path: 'client_profile.financial_situation.gross_income',
    label: 'Gross income',
    help: 'USD. Personal income context for the representative owner.',
    kind: 'usd',
    section: 'starting',
    group: 'Financial situation',
    blocking: true,
    defaultValue: '300000',
  },
  {
    path: 'client_profile.financial_situation.annual_lifestyle',
    label: 'Annual lifestyle',
    help: 'USD. Spending the representative owner needs to sustain.',
    kind: 'usd',
    section: 'starting',
    group: 'Financial situation',
    blocking: true,
    defaultValue: '180000',
  },
  {
    path: 'client_profile.financial_situation.annual_tax_burden',
    label: 'Annual tax burden',
    help: 'USD. Cannot be higher than gross income.',
    kind: 'usd',
    section: 'starting',
    group: 'Financial situation',
    blocking: true,
    defaultValue: '100000',
  },
  {
    path: 'client_profile.current_allocation.liquid_cash',
    label: 'Liquid cash',
    help: 'USD. Cash available outside the business.',
    kind: 'usd',
    section: 'starting',
    group: 'Current allocation',
    blocking: true,
    defaultValue: '1200000',
  },
];

export const OPTIONAL_HOST_FIELDS: BlueprintField[] = [
  {
    path: 'client_profile.primary_business.years_owned',
    label: 'Years owned',
    help: 'Whole number of years. Can support holding-period checks. Leave blank if unknown.',
    kind: 'integer',
    section: 'optional',
    group: 'Ownership and holding period',
    blocking: false,
  },
  {
    path: 'client_profile.primary_business.cost_basis',
    label: 'Cost basis',
    help: 'USD. Used when a gain on sale is calculated. Leave blank if unknown.',
    kind: 'usd',
    section: 'optional',
    group: 'Ownership and holding period',
    blocking: false,
  },
  {
    path: 'client_profile.primary_business.share_issuance_date',
    label: 'Share issuance date',
    help: 'YYYY-MM-DD. Relevant to the QSBS holding period. Leave blank if unknown.',
    kind: 'date',
    section: 'optional',
    group: 'Ownership and holding period',
    blocking: false,
  },
  {
    path: 'client_profile.primary_business.acquisition_date',
    label: 'Acquisition date',
    help: 'YYYY-MM-DD. Used for QSBS holding-period checks. If omitted, a later FinPrint can fall back to the share issuance date. Leave blank if unknown.',
    kind: 'date',
    section: 'optional',
    group: 'Ownership and holding period',
    blocking: false,
  },
  {
    path: 'client_profile.primary_business.exit_timeline',
    label: 'Exit timeline',
    help: 'For example: still growing, or considering a sale within five years. Leave blank if unknown.',
    kind: 'text',
    section: 'optional',
    group: 'Exit timeline',
    blocking: false,
  },
  {
    path: 'client_profile.primary_business.business_name',
    label: 'Business name',
    help: 'A representative name only. Leave blank if a name would identify a real business.',
    kind: 'text',
    section: 'optional',
    group: 'Business context',
    blocking: false,
  },
  {
    path: 'client_profile.primary_business.industry',
    label: 'Industry',
    help: 'Sector context for the representative business. Leave blank if unknown.',
    kind: 'text',
    section: 'optional',
    group: 'Business context',
    blocking: false,
  },
  {
    path: 'client_profile.primary_business.qsbs_eligible',
    label: 'QSBS eligible',
    help: 'Whether QSBS may apply. Leave blank if not established.',
    kind: 'boolean',
    section: 'optional',
    group: 'QSBS-related information',
    blocking: false,
  },
  {
    path: 'client_profile.primary_business.corporation_qsbs_qualified',
    label: 'Corporation QSBS qualified',
    help: 'Whether the corporation meets QSBS qualification. Leave blank if not established.',
    kind: 'boolean',
    section: 'optional',
    group: 'QSBS-related information',
    blocking: false,
  },
  {
    path: 'client_profile.primary_business.shareholder_qsbs_qualified',
    label: 'Shareholder QSBS qualified',
    help: 'Whether the shareholder meets QSBS qualification. Leave blank if not established.',
    kind: 'boolean',
    section: 'optional',
    group: 'QSBS-related information',
    blocking: false,
  },
  {
    path: 'client_profile.primary_business.active_business_requirements_met',
    label: 'Active business requirements met',
    help: 'Whether the active-business test is met. Leave blank if not established.',
    kind: 'boolean',
    section: 'optional',
    group: 'QSBS-related information',
    blocking: false,
  },
  {
    path: 'client_profile.primary_business.service_business_exclusion_applies',
    label: 'Service business exclusion applies',
    help: 'Whether a service-business exclusion applies. Leave blank if not established.',
    kind: 'boolean',
    section: 'optional',
    group: 'QSBS-related information',
    blocking: false,
  },
  {
    path: 'client_profile.financial_situation.annual_salary',
    label: 'Annual salary',
    help: 'USD salary, as distinct from total gross income. Leave blank if unknown.',
    kind: 'usd',
    section: 'optional',
    group: 'Income',
    blocking: false,
  },
  {
    path: 'client_profile.financial_situation.current_distributions',
    label: 'Current distributions',
    help: 'USD currently taken from the business. Leave blank if unknown.',
    kind: 'usd',
    section: 'optional',
    group: 'Income',
    blocking: false,
  },
  {
    path: 'client_profile.financial_situation.dividend_income',
    label: 'Dividend income',
    help: 'USD. Leave blank if unknown.',
    kind: 'usd',
    section: 'optional',
    group: 'Income',
    blocking: false,
  },
  {
    path: 'client_profile.financial_situation.capital_gains',
    label: 'Capital gains',
    help: 'USD. Leave blank if unknown.',
    kind: 'usd',
    section: 'optional',
    group: 'Income',
    blocking: false,
  },
  {
    path: 'client_profile.financial_situation.other_income',
    label: 'Other income',
    help: 'USD. Leave blank if unknown.',
    kind: 'usd',
    section: 'optional',
    group: 'Income',
    blocking: false,
  },
  {
    path: 'client_profile.family.marital_status',
    label: 'Marital status',
    help: 'Leave blank if unknown. Do not include a name.',
    kind: 'text',
    section: 'optional',
    group: 'Family',
    blocking: false,
  },
  {
    path: 'client_profile.family.succession_plans',
    label: 'Succession plans',
    help: 'A short description with nothing that identifies a person or the business. Leave blank if unknown.',
    kind: 'text',
    section: 'optional',
    group: 'Family',
    blocking: false,
  },
  {
    path: 'client_profile.current_allocation.unvested_equity',
    label: 'Unvested equity',
    help: 'USD. Leave blank if unknown.',
    kind: 'usd',
    section: 'optional',
    group: 'Current allocation',
    blocking: false,
  },
  {
    path: 'client_profile.current_allocation.angel_investments',
    label: 'Angel investments',
    help: 'USD. Leave blank if unknown.',
    kind: 'usd',
    section: 'optional',
    group: 'Current allocation',
    blocking: false,
  },
  {
    path: 'client_profile.current_allocation.public_equities',
    label: 'Public equities',
    help: 'USD. Leave blank if unknown.',
    kind: 'usd',
    section: 'optional',
    group: 'Current allocation',
    blocking: false,
  },
  {
    path: 'client_profile.current_allocation.real_estate',
    label: 'Real estate',
    help: 'USD. Leave blank if unknown.',
    kind: 'usd',
    section: 'optional',
    group: 'Current allocation',
    blocking: false,
  },
  {
    path: 'client_profile.financial_situation.concentration_risk',
    label: 'Concentration you want recorded',
    help: 'Optional. Enter a decimal from 0 to 1. 0.54 means 54%. Leave blank to keep the calculated concentration from the starting picture, rather than a second independent figure.',
    kind: 'decimal_0_1',
    section: 'optional',
    group: 'Concentration',
    blocking: false,
  },
];

export const NICHE_FIELDS: BlueprintField[] = [
  ...nicheJson.niche_specific_fields.required.map(toNicheField),
  ...nicheJson.niche_specific_fields.optional.map(toNicheField),
];

export const ALL_BLUEPRINT_FIELDS: BlueprintField[] = [
  ...MANDATORY_FIELDS,
  ...NICHE_FIELDS,
  ...OPTIONAL_HOST_FIELDS,
];

const fieldByPath = new Map(ALL_BLUEPRINT_FIELDS.map((field) => [field.path, field]));

export function getBlueprintField(path: string): BlueprintField | undefined {
  return fieldByPath.get(path);
}

export function defaultFieldValues(): Record<string, string> {
  const values: Record<string, string> = {};
  for (const field of MANDATORY_FIELDS) {
    values[field.path] = field.defaultValue ?? '';
  }
  return values;
}

export function uniqueGroups(fields: BlueprintField[]): string[] {
  const seen = new Set<string>();
  const groups: string[] = [];
  for (const field of fields) {
    if (!seen.has(field.group)) {
      seen.add(field.group);
      groups.push(field.group);
    }
  }
  return groups;
}
