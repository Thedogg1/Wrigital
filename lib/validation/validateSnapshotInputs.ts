/**
 * Exit Snapshot input validation — MVP mandatory fields only.
 */

import {
  ValidationError,
  ValidationWarning,
  ValidationResult,
  safeDecimal,
  safeString,
  isValidDateFormat,
  parseDate,
  validateBadrHoldingPeriod,
  formatCurrency,
  calculateConcentrationRisk,
  calculateCapitalGain,
  BADR_HOLDING_PERIOD_YEARS,
  BUSINESS_VALUE_HIGH_MULTIPLE,
  BUSINESS_VALUE_MODERATE_MULTIPLE,
} from './validation-library-core';

export interface SnapshotFormData {
  businessValue: string;
  ownershipPercentage: string;
  netWorth: string;
  costBasis: string;
  shareAcquisitionDate: string;
  taxableIncome: string;
  allowableLosses: string;
  previousBadrClaimed: string;
  isTradingCompany: boolean;
  votingRightsPercentage: string;
  isOfficerOrEmployee: boolean;
  annualRevenue: string;
}

export const EMPTY_SNAPSHOT_FORM: SnapshotFormData = {
  businessValue: '',
  ownershipPercentage: '',
  netWorth: '',
  costBasis: '',
  shareAcquisitionDate: '',
  taxableIncome: '',
  allowableLosses: '',
  previousBadrClaimed: '',
  isTradingCompany: true,
  votingRightsPercentage: '',
  isOfficerOrEmployee: true,
  annualRevenue: '',
};

const MANDATORY_FIELDS: (keyof SnapshotFormData)[] = [
  'businessValue',
  'ownershipPercentage',
  'netWorth',
  'costBasis',
  'shareAcquisitionDate',
  'taxableIncome',
];

const FIELD_LABELS: Record<string, string> = {
  businessValue: 'Business value',
  ownershipPercentage: 'Ownership %',
  netWorth: 'Net worth',
  costBasis: 'Cost basis',
  shareAcquisitionDate: 'Share acquisition date',
  taxableIncome: 'Taxable income (after PA)',
  allowableLosses: 'Allowable losses',
  previousBadrClaimed: 'Previous BADR claimed',
  votingRightsPercentage: 'Voting rights %',
  annualRevenue: 'Annual revenue',
};

export function getFieldLabel(field: string): string {
  return FIELD_LABELS[field] ?? field;
}

export function isMandatoryField(field: keyof SnapshotFormData): boolean {
  return MANDATORY_FIELDS.includes(field);
}

export function validateSnapshotInputs(formData: SnapshotFormData): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  const businessValue = safeDecimal(formData.businessValue);
  const ownershipPercentage = safeDecimal(formData.ownershipPercentage);
  const netWorth = safeDecimal(formData.netWorth);
  const costBasis = safeDecimal(formData.costBasis);
  const taxableIncome = safeDecimal(formData.taxableIncome);

  if (businessValue === null) {
    errors.push({ field: 'businessValue', type: 'MISSING_FIELD', message: 'Business value is required' });
  } else if (businessValue <= 0) {
    errors.push({
      field: 'businessValue',
      type: 'IMPOSSIBLE_VALUE',
      message: `Business value must be positive. Found: ${formatCurrency(businessValue)}.`,
    });
  } else if (netWorth !== null && netWorth > 0) {
    const multiple = businessValue / netWorth;
    if (multiple > BUSINESS_VALUE_HIGH_MULTIPLE) {
      warnings.push({
        field: 'businessValue',
        message: `Business value (${formatCurrency(businessValue)}) seems very high relative to net worth (${formatCurrency(netWorth)}) — verify accuracy`,
      });
    } else if (multiple > BUSINESS_VALUE_MODERATE_MULTIPLE) {
      warnings.push({
        field: 'businessValue',
        message: `Business value (${formatCurrency(businessValue)}) is high relative to net worth (${formatCurrency(netWorth)}) — verify accuracy`,
      });
    }
  }

  if (ownershipPercentage === null) {
    errors.push({ field: 'ownershipPercentage', type: 'MISSING_FIELD', message: 'Ownership percentage is required' });
  } else if (ownershipPercentage <= 0 || ownershipPercentage > 100) {
    errors.push({
      field: 'ownershipPercentage',
      type: 'IMPOSSIBLE_VALUE',
      message: `Ownership percentage must be greater than 0 and not exceed 100. Current value: ${ownershipPercentage}.`,
    });
  } else if (ownershipPercentage < 5) {
    warnings.push({
      field: 'ownershipPercentage',
      message: `Ownership of ${ownershipPercentage}% is below the BADR 5% ordinary share capital threshold.`,
    });
  }

  if (netWorth === null) {
    errors.push({ field: 'netWorth', type: 'MISSING_FIELD', message: 'Net worth is required' });
  } else if (netWorth < 0) {
    errors.push({ field: 'netWorth', type: 'IMPOSSIBLE_VALUE', message: 'Net worth cannot be negative' });
  } else if (netWorth === 0) {
    warnings.push({ field: 'netWorth', message: 'Net worth is zero — verify this is accurate' });
  }

  if (costBasis === null) {
    errors.push({ field: 'costBasis', type: 'MISSING_FIELD', message: 'Cost basis is required' });
  } else if (costBasis < 0) {
    errors.push({ field: 'costBasis', type: 'IMPOSSIBLE_VALUE', message: `Cost basis cannot be negative: ${formatCurrency(costBasis)}` });
  } else if (businessValue !== null && ownershipPercentage !== null && costBasis > 0) {
    const equityStake = businessValue * (ownershipPercentage / 100);
    if (costBasis >= equityStake) {
      warnings.push({
        field: 'costBasis',
        message: `Cost basis (${formatCurrency(costBasis)}) equals or exceeds potential exit proceeds (${formatCurrency(equityStake)}). Verify this is accurate.`,
      });
    }
  }

  const dateStr = safeString(formData.shareAcquisitionDate);
  if (!dateStr) {
    errors.push({ field: 'shareAcquisitionDate', type: 'MISSING_FIELD', message: 'Share acquisition date is required' });
  } else if (!isValidDateFormat(dateStr)) {
    errors.push({
      field: 'shareAcquisitionDate',
      type: 'INVALID_FORMAT',
      message: `Invalid date format: "${dateStr}". Expected YYYY-MM-DD`,
    });
  } else {
    const parsed = parseDate(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!parsed) {
      errors.push({ field: 'shareAcquisitionDate', type: 'INVALID_DATE', message: `Invalid date: "${dateStr}"` });
    } else if (parsed > today) {
      errors.push({ field: 'shareAcquisitionDate', type: 'FUTURE_DATE', message: `Share acquisition date (${dateStr}) is in the future` });
    } else {
      const badr = validateBadrHoldingPeriod(dateStr);
      if (!badr.isValid) {
        const needed = (BADR_HOLDING_PERIOD_YEARS - badr.yearsHeld).toFixed(1);
        warnings.push({
          field: 'shareAcquisitionDate',
          message: `BADR requires a 2-year minimum holding period. ${badr.yearsHeld.toFixed(1)} years held (${needed} more needed).`,
        });
      }
    }
  }

  if (taxableIncome === null) {
    errors.push({ field: 'taxableIncome', type: 'MISSING_FIELD', message: 'Taxable income (after personal allowance) is required' });
  } else if (taxableIncome < 0) {
    errors.push({ field: 'taxableIncome', type: 'IMPOSSIBLE_VALUE', message: 'Taxable income cannot be negative' });
  }

  const allowableLosses = safeDecimal(formData.allowableLosses);
  if (allowableLosses !== null && allowableLosses < 0) {
    errors.push({ field: 'allowableLosses', type: 'IMPOSSIBLE_VALUE', message: 'Allowable losses cannot be negative' });
  }

  const previousBadr = safeDecimal(formData.previousBadrClaimed);
  if (previousBadr !== null && previousBadr < 0) {
    errors.push({ field: 'previousBadrClaimed', type: 'IMPOSSIBLE_VALUE', message: 'Previous BADR claimed cannot be negative' });
  }

  const votingRights = safeDecimal(formData.votingRightsPercentage);
  if (votingRights !== null && (votingRights < 0 || votingRights > 100)) {
    errors.push({ field: 'votingRightsPercentage', type: 'IMPOSSIBLE_VALUE', message: 'Voting rights must be between 0 and 100' });
  }

  const concentrationRisk = calculateConcentrationRisk(businessValue, ownershipPercentage, netWorth);
  const capitalGain = calculateCapitalGain(businessValue, ownershipPercentage, costBasis);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    calculatedValues: {
      concentrationRisk: concentrationRisk ?? undefined,
      capitalGain: capitalGain ?? undefined,
    },
  };
}
