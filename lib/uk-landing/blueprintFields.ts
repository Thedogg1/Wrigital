import nicheFile from '@/lib/uk-landing/businessUkNicheFields.json';

/**
 * Host-standard fields: velocityiqukfrontend/docs/QUESTIONNAIRE_REQUIRED_FIELDS.md
 * Niche fields: velocityiqukfrontend/app/admin/niche-wizard/book_outlines/BusinessUK/required_client_fields.json
 *
 * Payload niche id is business_uk. The niche pack folder name is BusinessUK.
 * Niche "required" metadata is not blocking on this lead magnet.
 */

export const BUSINESS_UK_NICHE_ID = 'business_uk' as const;

export const UK_ENTITY_TYPES = [
  'Ltd',
  'PLC',
  'LLP',
  'Partnership',
  'SoleTrader',
] as const;

export type FieldKind =
  | 'text'
  | 'integer'
  | 'gbp'
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

const NICHE_GUIDANCE: Record<string, string> = {
  'client_profile.primary_business.total_assets':
    'Can support asset-based and net-asset-value approaches.',
  'client_profile.primary_business.total_liabilities':
    'Can support net-asset-value and working-capital approaches.',
  'client_profile.primary_business.industry_multiplier':
    'Used where an earnings or EBITDA multiple is an appropriate valuation methodology.',
  'client_profile.primary_business.revenue_multiplier':
    'Used where a revenue multiple is an appropriate valuation methodology.',
  'client_profile.primary_business.pe_ratio':
    'Can support a profit-based valuation where a price-to-earnings approach is appropriate.',
  'client_profile.primary_business.annual_cash_flow':
    'Can support cash-flow-based valuation approaches.',
  'client_profile.primary_business.capitalization_rate':
    'Used where cash flow is converted to a present value with a capitalisation rate.',
  'client_profile.primary_business.discount_rate':
    'Used when future cash flows are assessed using a discounted cash-flow methodology.',
  'client_profile.primary_business.current_assets':
    'Can help assess working capital and short-term financial resilience.',
  'client_profile.primary_business.current_liabilities':
    'Can help assess working capital and short-term financial resilience.',
  'client_profile.primary_business.net_annual_profits':
    'Can support profit-based valuation approaches.',
  'client_profile.primary_business.free_cash_flows':
    'The niche definition describes projected free cash flows. Enter one representative annual figure. A live FinPrint can hold a year-by-year projection. Adviser review required in a live FinPrint.',
};

function nicheHelp(field: NicheFieldJson): string {
  const guidance = NICHE_GUIDANCE[field.path];
  const unit =
    field.data_type === 'percentage'
      ? ' Enter a decimal. 0.10 means 10%.'
      : field.data_type === 'currency_gbp'
        ? ' Enter a GBP amount.'
        : '';
  return `${guidance ?? field.description}${unit}`;
}

function nicheKind(dataType: string): FieldKind {
  if (dataType === 'currency_gbp') return 'gbp';
  if (dataType === 'percentage') return 'decimal_0_1';
  if (dataType === 'number') return 'number';
  return 'text';
}

function nicheGroup(path: string): string {
  if (/discount_rate|free_cash_flows|residual_value/.test(path)) {
    return 'Discounted cash flow';
  }
  if (/current_assets|current_liabilities/.test(path)) {
    return 'Working capital';
  }
  if (
    /net_annual_profits|pre_tax_income|depreciation_amortization|discretionary_expenses|non_recurring_items|annual_income/.test(
      path,
    )
  ) {
    return 'Earnings normalisation';
  }
  if (
    /rnrb_applicable|total_gains|annual_exemption_used|gifts_from_surplus_income/.test(
      path,
    )
  ) {
    return 'Further tax and estate information';
  }
  return 'Valuation approaches';
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
    help: 'GBP. Used with the business stake to calculate concentration.',
    kind: 'gbp',
    section: 'starting',
    group: 'Representative owner',
    blocking: true,
    defaultValue: '12000000',
  },
  {
    path: 'client_profile.primary_business.entity_type',
    label: 'Entity type',
    help: 'Routes how tax and relief questions are framed.',
    kind: 'entity',
    section: 'starting',
    group: 'Primary business',
    blocking: true,
    defaultValue: 'Ltd',
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
    help: 'GBP. Can support revenue-based context.',
    kind: 'gbp',
    section: 'starting',
    group: 'Primary business',
    blocking: true,
    defaultValue: '10000000',
  },
  {
    path: 'client_profile.primary_business.ebitda',
    label: 'EBITDA',
    help: 'GBP. The demonstration default is £1,800,000. At an illustrative 4.5x earnings multiple, that is consistent with the £8,100,000 business value default.',
    kind: 'gbp',
    section: 'starting',
    group: 'Primary business',
    blocking: true,
    defaultValue: '1800000',
  },
  {
    path: 'client_profile.primary_business.business_value',
    label: 'Business value',
    help: 'GBP. Demonstration default £8,100,000. Change it if you want to explore a different scenario. This figure is not automatically the right valuation.',
    kind: 'gbp',
    section: 'starting',
    group: 'Primary business',
    blocking: true,
    defaultValue: '8100000',
  },
  {
    path: 'client_profile.financial_situation.gross_income',
    label: 'Gross income',
    help: 'GBP. Personal income context for the representative owner.',
    kind: 'gbp',
    section: 'starting',
    group: 'Financial situation',
    blocking: true,
    defaultValue: '300000',
  },
  {
    path: 'client_profile.financial_situation.annual_lifestyle',
    label: 'Annual lifestyle',
    help: 'GBP. Spending the representative owner needs to sustain.',
    kind: 'gbp',
    section: 'starting',
    group: 'Financial situation',
    blocking: true,
    defaultValue: '180000',
  },
  {
    path: 'client_profile.financial_situation.annual_tax_burden',
    label: 'Annual tax burden',
    help: 'GBP. Cannot be higher than gross income.',
    kind: 'gbp',
    section: 'starting',
    group: 'Financial situation',
    blocking: true,
    defaultValue: '100000',
  },
  {
    path: 'client_profile.current_allocation.liquid_cash',
    label: 'Liquid cash',
    help: 'GBP. Cash available outside the business.',
    kind: 'gbp',
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
    help: 'Can support holding-period questions such as BADR. Leave blank if unknown.',
    kind: 'integer',
    section: 'optional',
    group: 'Ownership and holding period',
    blocking: false,
  },
  {
    path: 'client_profile.primary_business.cost_basis',
    label: 'Cost basis',
    help: 'GBP. Used when a gain on sale is calculated. Leave blank if unknown.',
    kind: 'gbp',
    section: 'optional',
    group: 'Ownership and holding period',
    blocking: false,
  },
  {
    path: 'client_profile.primary_business.share_issuance_date',
    label: 'Share issuance date',
    help: 'YYYY-MM-DD. Relevant to some relief holding periods. Leave blank if unknown.',
    kind: 'date',
    section: 'optional',
    group: 'Ownership and holding period',
    blocking: false,
  },
  {
    path: 'client_profile.primary_business.share_acquisition_date',
    label: 'Share acquisition date',
    help: 'YYYY-MM-DD. Without this, BADR holding period is not assessed. Leave blank if unknown.',
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
    path: 'client_profile.primary_business.is_trading_company',
    label: 'Trading company',
    help: 'Whether the company would be treated as a trading company for BADR. Leave blank if not established.',
    kind: 'boolean',
    section: 'optional',
    group: 'BADR-related information',
    blocking: false,
  },
  {
    path: 'client_profile.primary_business.is_officer_or_employee',
    label: 'Officer or employee',
    help: 'Whether the owner is an officer or employee, which BADR can require. Leave blank if not established.',
    kind: 'boolean',
    section: 'optional',
    group: 'BADR-related information',
    blocking: false,
  },
  {
    path: 'client_profile.primary_business.voting_rights_percentage',
    label: 'Voting rights percentage',
    help: 'Percent from 0 to 100. If omitted, a live FinPrint can use ownership percentage. Leave blank if unknown.',
    kind: 'percent_0_100',
    section: 'optional',
    group: 'BADR-related information',
    blocking: false,
  },
  {
    path: 'client_profile.primary_business.previous_badr_claimed',
    label: 'Previous BADR claimed',
    help: 'GBP already claimed against the lifetime limit. Leave blank if unknown.',
    kind: 'gbp',
    section: 'optional',
    group: 'BADR-related information',
    blocking: false,
  },
  {
    path: 'client_profile.primary_business.eis_eligible',
    label: 'EIS or SEIS eligible',
    help: 'Only answer if you want the demonstration to treat EIS or SEIS as in point. Leave blank if unknown.',
    kind: 'boolean',
    section: 'optional',
    group: 'EIS-related information',
    blocking: false,
  },
  {
    path: 'client_profile.financial_situation.annual_salary',
    label: 'Annual salary',
    help: 'GBP salary, as distinct from total gross income. Leave blank if unknown.',
    kind: 'gbp',
    section: 'optional',
    group: 'Income and drawings',
    blocking: false,
  },
  {
    path: 'client_profile.financial_situation.annual_drawings',
    label: 'Annual drawings',
    help: 'GBP. Can refine a normalised earnings analysis. Leave blank if unknown.',
    kind: 'gbp',
    section: 'optional',
    group: 'Income and drawings',
    blocking: false,
  },
  {
    path: 'client_profile.financial_situation.taxable_income',
    label: 'Taxable income',
    help: 'GBP. Can differ from gross income when placing gains into tax bands. Leave blank if unknown.',
    kind: 'gbp',
    section: 'optional',
    group: 'Tax inputs',
    blocking: false,
  },
  {
    path: 'client_profile.financial_situation.allowable_losses',
    label: 'Allowable losses',
    help: 'GBP losses that could offset gains. Leave blank if unknown.',
    kind: 'gbp',
    section: 'optional',
    group: 'Tax inputs',
    blocking: false,
  },
  {
    path: 'client_profile.financial_situation.gift_aid_gross',
    label: 'Gift Aid (gross)',
    help: 'GBP. Can extend the basic-rate band. Leave blank if unknown.',
    kind: 'gbp',
    section: 'optional',
    group: 'Tax inputs',
    blocking: false,
  },
  {
    path: 'client_profile.financial_situation.pension_contributions_gross',
    label: 'Pension contributions (gross)',
    help: 'GBP. Relevant to some tax strategy comparisons. Leave blank if unknown.',
    kind: 'gbp',
    section: 'optional',
    group: 'Tax inputs',
    blocking: false,
  },
  {
    path: 'client_profile.financial_situation.eis_reinvestment',
    label: 'EIS reinvestment',
    help: 'GBP that might be reinvested into EIS. Leave blank if unknown.',
    kind: 'gbp',
    section: 'optional',
    group: 'EIS-related information',
    blocking: false,
  },
  {
    path: 'client_profile.financial_situation.annual_surplus_income',
    label: 'Annual surplus income',
    help: 'GBP income above spending. Can inform gifting capacity. Leave blank if unknown.',
    kind: 'gbp',
    section: 'optional',
    group: 'Income and drawings',
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
