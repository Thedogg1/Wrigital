import type { FigureEntry } from './types';

export const FIGURES: FigureEntry[] = [
  {
    id: 'cgt-annual-exempt-amount',
    label: 'Capital Gains Tax annual exempt amount',
    unit: 'gbp',
    currentValue: 3000,
    effectiveFrom: '2024-04-06',
    sourceUrl: 'https://www.gov.uk/guidance/capital-gains-tax-rates-and-allowances',
    sourceLabel: 'GOV.UK — Capital Gains Tax rates and allowances',
    keywords: [
      'capital gains tax',
      'cgt',
      'annual exempt amount',
      'capital gains allowance',
      'cgt allowance',
    ],
    priorValues: [
      { value: 6000, taxYear: '2023/24' },
      { value: 12300, taxYear: '2022/23' },
    ],
    verified: true,
  },
  {
    id: 'dividend-allowance',
    label: 'Dividend allowance',
    unit: 'gbp',
    currentValue: 500,
    effectiveFrom: '2024-04-06',
    sourceUrl:
      'https://www.gov.uk/government/publications/rates-and-allowances-income-tax/income-tax-rates-and-allowances-current-and-past',
    sourceLabel: 'GOV.UK — Income Tax rates and allowances, current and past',
    keywords: ['dividend allowance', 'dividend income', 'tax-free dividend'],
    priorValues: [
      { value: 1000, taxYear: '2023/24' },
      { value: 2000, taxYear: '2022/23' },
    ],
    verified: true,
  },
  {
    id: 'pension-annual-allowance',
    label: 'Pension annual allowance',
    unit: 'gbp',
    currentValue: 60000,
    effectiveFrom: '2023-04-06',
    sourceUrl:
      'https://www.gov.uk/government/publications/rates-and-allowances-pension-schemes/pension-schemes-rates',
    sourceLabel: 'GOV.UK — Pension schemes rates and allowances',
    keywords: [
      'annual allowance',
      'pension annual allowance',
      'pension contribution limit',
    ],
    priorValues: [{ value: 40000, taxYear: '2022/23' }],
    verified: true,
  },
  {
    id: 'isa-annual-subscription',
    label: 'ISA annual subscription limit',
    unit: 'gbp',
    currentValue: 20000,
    effectiveFrom: '2017-04-06',
    sourceUrl: 'https://www.gov.uk/individual-savings-accounts',
    sourceLabel: 'GOV.UK — Individual Savings Accounts',
    keywords: [
      'isa',
      'isa allowance',
      'isa limit',
      'isa subscription',
      'annual subscription',
      'individual savings account',
    ],
    priorValues: [],
    verified: true,
  },
  {
    id: 'personal-allowance',
    label: 'Income tax personal allowance',
    unit: 'gbp',
    currentValue: 12570,
    effectiveFrom: '2021-04-06',
    sourceUrl:
      'https://www.gov.uk/government/publications/rates-and-allowances-income-tax/income-tax-rates-and-allowances-current-and-past',
    sourceLabel: 'GOV.UK — Income Tax rates and allowances, current and past',
    keywords: ['personal allowance', 'tax-free allowance', 'income tax allowance'],
    priorValues: [],
    verified: true,
  },
  {
    id: 'iht-nil-rate-band',
    label: 'Inheritance Tax nil rate band',
    unit: 'gbp',
    currentValue: 325000,
    effectiveFrom: '2009-04-06',
    sourceUrl: 'https://www.gov.uk/inheritance-tax',
    sourceLabel: 'GOV.UK — Inheritance Tax',
    keywords: [
      'nil rate band',
      'nil-rate band',
      'inheritance tax threshold',
      'iht threshold',
    ],
    priorValues: [],
    verified: true,
  },
];

export function getUnverifiedFigureIds(): string[] {
  return FIGURES.filter((f) => !f.verified).map((f) => f.id);
}

export function getFigureById(id: string): FigureEntry | undefined {
  return FIGURES.find((f) => f.id === id);
}
