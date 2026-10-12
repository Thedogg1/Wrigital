/**
 * One line per supplied field, in the Label: value shape the payload generator pastes.
 * Host labels match the questionnaire parser. Niche labels stay as supplied.
 */

const PAYLOAD_LABEL_BY_PATH: Record<string, string> = {
  'client_profile.name': 'Name',
  'client_profile.age': 'Age',
  'client_profile.net_worth': 'Net Worth',
  'client_profile.primary_business.entity_type': 'Entity Type',
  'client_profile.primary_business.ownership_percentage': 'Ownership Percentage',
  'client_profile.primary_business.annual_revenue': 'Annual Revenue',
  'client_profile.primary_business.ebitda': 'EBITDA',
  'client_profile.primary_business.business_value': 'Business Value',
  'client_profile.financial_situation.gross_income': 'Gross Income',
  'client_profile.financial_situation.annual_lifestyle': 'Annual Lifestyle',
  'client_profile.financial_situation.annual_tax_burden': 'Annual Tax Burden',
  'client_profile.current_allocation.liquid_cash': 'Liquid Cash',
  'client_profile.primary_business.years_owned': 'Years Owned',
  'client_profile.primary_business.cost_basis': 'Cost Basis',
  'client_profile.primary_business.share_issuance_date': 'Share Issuance Date',
  'client_profile.primary_business.acquisition_date': 'Acquisition Date',
  'client_profile.primary_business.share_acquisition_date': 'Share Acquisition Date',
  'client_profile.primary_business.exit_timeline': 'Exit Timeline',
  'client_profile.primary_business.business_name': 'Business Name',
  'client_profile.primary_business.industry': 'Industry',
  'client_profile.primary_business.qsbs_eligible': 'QSBS Eligible',
  'client_profile.financial_situation.annual_salary': 'Annual Salary',
  'client_profile.financial_situation.concentration_risk': 'Concentration Risk',
  'client_profile.current_allocation.unvested_equity': 'Unvested Equity',
  'client_profile.current_allocation.angel_investments': 'Angel Investments',
  'client_profile.current_allocation.public_equities': 'Public Equities',
  'client_profile.current_allocation.real_estate': 'Real Estate',
  'client_profile.financial_situation.current_distributions': 'Current Distributions',
  'client_profile.financial_situation.dividend_income': 'Dividend Income',
  'client_profile.financial_situation.capital_gains': 'Capital Gains',
  'client_profile.financial_situation.other_income': 'Other Income',
};

export interface PayloadPasteField {
  path: string;
  label: string;
  display: string;
}

export function payloadGeneratorLines(fields: PayloadPasteField[]): string {
  return fields
    .map((field) => {
      const label = PAYLOAD_LABEL_BY_PATH[field.path] ?? field.label;
      const value = field.display.replace(/\r?\n/g, ' ').trim();
      return `${label}: ${value}`;
    })
    .join('\n');
}
