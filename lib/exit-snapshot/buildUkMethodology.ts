import { formatCurrency, safeDecimal } from '@/lib/validation/validation-library-core';
import { formatAssumptionRows } from './formatAssumptionDisplay';
import { BADR_RATE_LABEL, TAX_PARAMETERS_2025_26, TAX_YEAR_LABEL } from './taxParameters202526';
import type { SnapshotCalculated, SnapshotFormData } from './types';
import type { ExitSnapshotMethodology } from './methodologyTypes';

function pct(n: number): string {
  return `${n}%`;
}

export function buildUkMethodology(
  inputs: SnapshotFormData,
  calculated: SnapshotCalculated,
): ExitSnapshotMethodology {
  const params = TAX_PARAMETERS_2025_26;
  const businessValue = safeDecimal(inputs.businessValue) ?? 0;
  const costBasis = safeDecimal(inputs.costBasis) ?? 0;
  const taxableIncome = safeDecimal(inputs.taxableIncome) ?? 0;
  const allowableLosses = safeDecimal(inputs.allowableLosses) ?? 0;
  const previousBadrClaimed = safeDecimal(inputs.previousBadrClaimed) ?? 0;
  const netWorth = safeDecimal(inputs.netWorth) ?? 0;
  const ownership = calculated.ownershipPercent;

  const formulas: ExitSnapshotMethodology['formulas'] = [
    {
      step: 1,
      name: 'Equity value (gross proceeds)',
      expression: 'Business value × Ownership %',
      substitution: `${formatCurrency(businessValue)} × ${pct(ownership)}`,
      result: formatCurrency(calculated.equityValue),
    },
    {
      step: 2,
      name: 'Gross capital gain',
      expression: 'Equity value − Cost basis',
      substitution: `${formatCurrency(calculated.equityValue)} − ${formatCurrency(costBasis)}`,
      result: formatCurrency(calculated.grossCapitalGain),
    },
  ];

  if (calculated.grossCapitalGain > 0) {
    formulas.push(
      {
        step: 3,
        name: 'Gains after allowable losses',
        expression: 'max(0, Gross capital gain − Allowable losses)',
        substitution: `max(0, ${formatCurrency(calculated.grossCapitalGain)} − ${formatCurrency(allowableLosses)})`,
        result: formatCurrency(calculated.gainsAfterLosses),
      },
      {
        step: 4,
        name: 'BADR qualifying gain',
        expression: calculated.badrEligible
          ? 'min(Gains after losses, BADR lifetime headroom remaining)'
          : 'Not eligible — BADR gain = 0',
        substitution: calculated.badrEligible
          ? `min(${formatCurrency(calculated.gainsAfterLosses)}, ${formatCurrency(calculated.badrHeadroomRemaining)})`
          : 'BADR eligibility tests not met',
        result: formatCurrency(calculated.badrQualifyingGain),
      },
      {
        step: 5,
        name: 'Non-BADR gain',
        expression: 'Gains after losses − BADR qualifying gain',
        substitution: `${formatCurrency(calculated.gainsAfterLosses)} − ${formatCurrency(calculated.badrQualifyingGain)}`,
        result: formatCurrency(calculated.nonBadrGain),
      },
      {
        step: 6,
        name: 'Annual exempt amount (AEA) applied',
        expression: 'AEA applied to non-BADR gain first, then remaining AEA to BADR gain',
        substitution: `AEA limit ${formatCurrency(params.annualCgtExemption)}`,
        result: formatCurrency(calculated.aeaApplied),
      },
      {
        step: 7,
        name: 'BADR tax',
        expression: `(BADR qualifying gain after AEA) × ${BADR_RATE_LABEL}`,
        substitution:
          calculated.badrTax > 0
            ? `Qualifying gain after AEA × ${BADR_RATE_LABEL}`
            : '—',
        result: formatCurrency(calculated.badrTax),
      },
      {
        step: 8,
        name: 'Standard CGT tax',
        expression: 'Basic-rate portion × 18% + Higher-rate portion × 24%',
        substitution: `${formatCurrency(calculated.basicRatePortion)} × 18% + ${formatCurrency(calculated.higherRatePortion)} × 24% (unused BRB after taxable income ${formatCurrency(taxableIncome)})`,
        result: formatCurrency(calculated.nonBadrGainTax),
      },
      {
        step: 9,
        name: 'Total tax liability',
        expression: 'BADR tax + Standard CGT tax',
        substitution: `${formatCurrency(calculated.badrTax)} + ${formatCurrency(calculated.nonBadrGainTax)}`,
        result: formatCurrency(calculated.totalTaxLiability),
      },
    );
  }

  formulas.push(
    {
      step: formulas.length + 1,
      name: 'Net proceeds',
      expression: 'Equity value − Total tax liability',
      substitution: `${formatCurrency(calculated.equityValue)} − ${formatCurrency(calculated.totalTaxLiability)}`,
      result: formatCurrency(calculated.netProceeds),
    },
    {
      step: formulas.length + 1,
      name: 'Concentration risk',
      expression: '(Business value × Ownership %) ÷ Net worth × 100',
      substitution: `(${formatCurrency(businessValue)} × ${pct(ownership)}) ÷ ${formatCurrency(netWorth)} × 100`,
      result: pct(calculated.businessValueShareOfNetWorth),
    },
    {
      step: formulas.length + 1,
      name: 'Effective tax rate',
      expression: 'Total tax liability ÷ Gross capital gain × 100',
      substitution:
        calculated.grossCapitalGain > 0
          ? `${formatCurrency(calculated.totalTaxLiability)} ÷ ${formatCurrency(calculated.grossCapitalGain)} × 100`
          : 'No gain — 0%',
      result: pct(calculated.effectiveTaxRate),
    },
  );

  const renumberedFormulas = formulas.map((row, index) => ({ ...row, step: index + 1 }));

  return {
    taxYear: calculated.taxYear || TAX_YEAR_LABEL,
    calculationDate: calculated.calculationDate,
    inputs: formatAssumptionRows(inputs).map(([label, value]) => ({ label, value })),
    parameters: [
      { label: 'CGT basic rate', value: '18%' },
      { label: 'CGT higher rate', value: '24%' },
      { label: 'BADR rate', value: BADR_RATE_LABEL },
      { label: 'BADR lifetime limit', value: formatCurrency(params.badrLifetimeLimit) },
      { label: 'Annual exempt amount (AEA)', value: formatCurrency(params.annualCgtExemption) },
      { label: 'Basic rate band (extended)', value: formatCurrency(params.basicRateBand) },
      { label: 'Previous BADR claimed (input)', value: formatCurrency(previousBadrClaimed) },
    ],
    formulas: renumberedFormulas,
    outputs: [
      { label: 'Exit value (your share)', value: formatCurrency(calculated.equityValue) },
      { label: 'Gross capital gain', value: formatCurrency(calculated.grossCapitalGain) },
      { label: 'BADR qualifying gain', value: formatCurrency(calculated.badrQualifyingGain) },
      { label: 'Total tax liability', value: formatCurrency(calculated.totalTaxLiability) },
      { label: 'Net proceeds', value: formatCurrency(calculated.netProceeds), highlight: true },
      { label: 'Effective tax rate', value: pct(calculated.effectiveTaxRate) },
      { label: 'Concentration risk', value: pct(calculated.businessValueShareOfNetWorth) },
      {
        label: 'BADR eligibility',
        value: calculated.badrEligible ? 'Meets stated tests' : 'Does not meet stated tests',
      },
    ],
  };
}
