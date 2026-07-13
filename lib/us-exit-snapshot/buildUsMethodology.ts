import { safeDecimal } from '@/lib/validation/validation-library-core';
import { formatUsd } from '@/lib/validation/validateUsSnapshotInputs';
import { US_TAX_PARAMETERS, US_TAX_YEAR_LABEL } from './taxParameters';
import type { UsSnapshotCalculated, UsSnapshotFormData } from './types';
import type { ExitSnapshotMethodology } from '@/lib/exit-snapshot/methodologyTypes';

function pct(n: number): string {
  return `${n}%`;
}

function formatUsInputRows(inputs: UsSnapshotFormData): ExitSnapshotMethodology['inputs'] {
  return [
    { label: 'Business value', value: formatUsd(safeDecimal(inputs.businessValue) ?? 0) },
    { label: 'Ownership %', value: `${safeDecimal(inputs.ownershipPercentage) ?? 0}%` },
    { label: 'Net worth', value: formatUsd(safeDecimal(inputs.netWorth) ?? 0) },
    { label: 'Cost basis', value: formatUsd(safeDecimal(inputs.costBasis) ?? 0) },
    { label: 'Share acquisition date', value: inputs.shareAcquisitionDate || '—' },
    {
      label: 'Modified adjusted gross income (MAGI)',
      value: formatUsd(safeDecimal(inputs.modifiedAdjustedGrossIncome) ?? 0),
    },
    { label: 'Entity type', value: inputs.entityType },
    { label: 'Filing status', value: inputs.filingStatus },
    { label: 'QSBS eligible (user attestation)', value: inputs.qsbsEligible ? 'Yes' : 'No' },
    {
      label: 'Corporation QSBS qualified',
      value: inputs.corporationQsbsQualified ? 'Yes (assumed)' : 'No',
    },
    {
      label: 'Shareholder QSBS qualified',
      value: inputs.shareholderQsbsQualified ? 'Yes (assumed)' : 'No',
    },
    {
      label: 'Active business requirements met',
      value: inputs.activeBusinessRequirementsMet ? 'Yes (assumed)' : 'No',
    },
    {
      label: 'Service business exclusion applies',
      value: inputs.serviceBusinessExclusionApplies ? 'Yes' : 'No (assumed)',
    },
  ];
}

export function buildUsMethodology(
  inputs: UsSnapshotFormData,
  calculated: UsSnapshotCalculated,
): ExitSnapshotMethodology {
  const params = US_TAX_PARAMETERS;
  const businessValue = safeDecimal(inputs.businessValue) ?? 0;
  const costBasis = safeDecimal(inputs.costBasis) ?? 0;
  const netWorth = safeDecimal(inputs.netWorth) ?? 0;
  const ownership = calculated.ownershipPercent;
  const niitLabel = calculated.niitApplies ? `${params.niitRate * 100}% (applies)` : 'Not applied';
  const federalLtcgPct = `${params.federalLtcgRate * 100}%`;
  const qsbsRatePct = `${params.qsbsFederalRate * 100}%`;
  const stateRatePct = `${params.stateCapitalGainsRate * 100}%`;

  const formulas: ExitSnapshotMethodology['formulas'] = [
    {
      step: 1,
      name: 'Equity value (gross proceeds)',
      expression: 'Business value × Ownership %',
      substitution: `${formatUsd(businessValue)} × ${pct(ownership)}`,
      result: formatUsd(calculated.equityValue),
    },
    {
      step: 2,
      name: 'Gross capital gain',
      expression: 'Equity value − Cost basis',
      substitution: `${formatUsd(calculated.equityValue)} − ${formatUsd(costBasis)}`,
      result: formatUsd(calculated.grossCapitalGain),
    },
  ];

  if (calculated.grossCapitalGain > 0) {
    if (calculated.qsbsEligible) {
      formulas.push(
        {
          step: 3,
          name: 'QSBS excluded gain',
          expression: `min(Capital gain, Per-issuer cap) × Exclusion %`,
          substitution: `min(${formatUsd(calculated.grossCapitalGain)}, ${formatUsd(calculated.qsbsPerIssuerCap)}) × ${pct(calculated.qsbsExclusionPercent)}`,
          result: formatUsd(calculated.qsbsExcludedGain),
        },
        {
          step: 4,
          name: 'QSBS taxable gain',
          expression: 'Capital gain − QSBS excluded gain',
          substitution: `${formatUsd(calculated.grossCapitalGain)} − ${formatUsd(calculated.qsbsExcludedGain)}`,
          result: formatUsd(calculated.qsbsTaxableGain),
        },
        {
          step: 5,
          name: 'Federal tax (QSBS path)',
          expression: `QSBS taxable gain × ${qsbsRatePct} + NIIT on taxable gain (${niitLabel})`,
          substitution: `${formatUsd(calculated.qsbsTaxableGain)} × ${qsbsRatePct}${calculated.niitApplies ? ` + ${formatUsd(calculated.qsbsTaxableGain)} × ${params.niitRate * 100}%` : ''}`,
          result: formatUsd(calculated.federalTax),
        },
      );
    } else {
      const federalCombined = params.federalLtcgRate + (calculated.niitApplies ? params.niitRate : 0);
      formulas.push({
        step: 3,
        name: 'Federal tax (standard LTCG path)',
        expression: `Capital gain × (${federalLtcgPct}${calculated.niitApplies ? ` + ${params.niitRate * 100}% NIIT` : ''})`,
        substitution: `${formatUsd(calculated.grossCapitalGain)} × ${(federalCombined * 100).toFixed(1)}%`,
        result: formatUsd(calculated.federalTax),
      });
    }

    formulas.push(
      {
        step: formulas.length + 1,
        name: 'State tax',
        expression: `Capital gain × State rate (${stateRatePct} default)`,
        substitution: `${formatUsd(calculated.grossCapitalGain)} × ${stateRatePct}`,
        result: formatUsd(calculated.stateTax),
      },
      {
        step: formulas.length + 1,
        name: 'Total tax liability',
        expression: 'Federal tax + State tax',
        substitution: `${formatUsd(calculated.federalTax)} + ${formatUsd(calculated.stateTax)}`,
        result: formatUsd(calculated.totalTaxLiability),
      },
    );

    if (calculated.qsbsSavings > 0) {
      formulas.push({
        step: formulas.length + 1,
        name: 'QSBS tax savings (illustrative)',
        expression: 'Excluded gain × (Federal LTCG + NIIT if applicable)',
        substitution: `${formatUsd(calculated.qsbsExcludedGain)} × combined federal rate`,
        result: formatUsd(calculated.qsbsSavings),
      });
    }
  }

  formulas.push(
    {
      step: formulas.length + 1,
      name: 'Net proceeds',
      expression: 'Equity value − Total tax liability',
      substitution: `${formatUsd(calculated.equityValue)} − ${formatUsd(calculated.totalTaxLiability)}`,
      result: formatUsd(calculated.netProceeds),
    },
    {
      step: formulas.length + 1,
      name: 'Concentration risk',
      expression: '(Business value × Ownership %) ÷ Net worth × 100',
      substitution: `(${formatUsd(businessValue)} × ${pct(ownership)}) ÷ ${formatUsd(netWorth)} × 100`,
      result: pct(calculated.businessValueShareOfNetWorth),
    },
    {
      step: formulas.length + 1,
      name: 'Effective tax rate',
      expression: 'Total tax liability ÷ Equity value × 100',
      substitution:
        calculated.equityValue > 0
          ? `${formatUsd(calculated.totalTaxLiability)} ÷ ${formatUsd(calculated.equityValue)} × 100`
          : '—',
      result: pct(calculated.effectiveTaxRate),
    },
  );

  const renumberedFormulas = formulas.map((row, index) => ({ ...row, step: index + 1 }));

  return {
    taxYear: calculated.taxYear || US_TAX_YEAR_LABEL,
    calculationDate: calculated.calculationDate,
    inputs: formatUsInputRows(inputs),
    parameters: [
      { label: 'Federal LTCG rate', value: federalLtcgPct },
      { label: 'QSBS federal rate', value: qsbsRatePct },
      { label: 'NIIT rate', value: `${params.niitRate * 100}%` },
      { label: 'State capital gains rate (default)', value: stateRatePct },
      {
        label: 'NIIT threshold',
        value:
          inputs.filingStatus === 'Married Filing Jointly'
            ? formatUsd(params.niitThresholdMarriedFilingJoint)
            : formatUsd(params.niitThresholdSingle),
      },
      { label: 'QSBS per-issuer cap (applied)', value: formatUsd(calculated.qsbsPerIssuerCap) },
      { label: 'QSBS exclusion percent (applied)', value: pct(calculated.qsbsExclusionPercent) },
      { label: 'Strategy applied', value: calculated.strategyLabel },
    ],
    formulas: renumberedFormulas,
    outputs: [
      { label: 'Exit value (your share)', value: formatUsd(calculated.equityValue) },
      { label: 'Gross capital gain', value: formatUsd(calculated.grossCapitalGain) },
      { label: 'QSBS excluded gain', value: formatUsd(calculated.qsbsExcludedGain) },
      { label: 'Federal tax', value: formatUsd(calculated.federalTax) },
      { label: 'State tax', value: formatUsd(calculated.stateTax) },
      { label: 'Total tax liability', value: formatUsd(calculated.totalTaxLiability) },
      { label: 'Net proceeds', value: formatUsd(calculated.netProceeds), highlight: true },
      { label: 'Effective tax rate', value: pct(calculated.effectiveTaxRate) },
      { label: 'Concentration risk', value: pct(calculated.businessValueShareOfNetWorth) },
      {
        label: 'QSBS eligibility',
        value: calculated.qsbsEligible ? 'Meets stated tests' : 'Does not meet stated tests',
      },
    ],
  };
}
