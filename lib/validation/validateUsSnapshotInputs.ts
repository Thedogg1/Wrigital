import {
  ValidationError,
  ValidationWarning,
  ValidationResult,
  safeDecimal,
  isValidDateFormat,
  parseDate,
  calculateConcentrationRisk,
  BUSINESS_VALUE_HIGH_MULTIPLE,
  BUSINESS_VALUE_MODERATE_MULTIPLE,
} from './validation-library-core';

export interface UsSnapshotFormData {
  businessValue: string;
  ownershipPercentage: string;
  netWorth: string;
  costBasis: string;
  shareAcquisitionDate: string;
  modifiedAdjustedGrossIncome: string;
  entityType: 'C-Corp' | 'S-Corp' | 'LLC' | 'Partnership';
  qsbsEligible: boolean;
  corporationQsbsQualified: boolean;
  shareholderQsbsQualified: boolean;
  activeBusinessRequirementsMet: boolean;
  serviceBusinessExclusionApplies: boolean;
  filingStatus: 'Single' | 'Married Filing Jointly';
}

export const EMPTY_US_SNAPSHOT_FORM: UsSnapshotFormData = {
  businessValue: '',
  ownershipPercentage: '',
  netWorth: '',
  costBasis: '',
  shareAcquisitionDate: '',
  modifiedAdjustedGrossIncome: '',
  entityType: 'C-Corp',
  qsbsEligible: true,
  corporationQsbsQualified: true,
  shareholderQsbsQualified: true,
  activeBusinessRequirementsMet: true,
  serviceBusinessExclusionApplies: false,
  filingStatus: 'Married Filing Jointly',
};

const MANDATORY_FIELDS: (keyof UsSnapshotFormData)[] = [
  'businessValue',
  'ownershipPercentage',
  'netWorth',
  'costBasis',
  'shareAcquisitionDate',
  'modifiedAdjustedGrossIncome',
];

const FIELD_LABELS: Record<string, string> = {
  businessValue: 'Business value',
  ownershipPercentage: 'Ownership %',
  netWorth: 'Net worth',
  costBasis: 'Cost basis',
  shareAcquisitionDate: 'Share acquisition date',
  modifiedAdjustedGrossIncome: 'Modified adjusted gross income (MAGI)',
  entityType: 'Entity type',
  filingStatus: 'Filing status',
};

export function formatUsd(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function getUsFieldLabel(field: string): string {
  return FIELD_LABELS[field] ?? field;
}

export function isUsMandatoryField(field: keyof UsSnapshotFormData): boolean {
  return MANDATORY_FIELDS.includes(field);
}

export function validateUsSnapshotInputs(formData: UsSnapshotFormData): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  const businessValue = safeDecimal(formData.businessValue);
  const ownershipPercentage = safeDecimal(formData.ownershipPercentage);
  const netWorth = safeDecimal(formData.netWorth);
  const costBasis = safeDecimal(formData.costBasis);
  const magi = safeDecimal(formData.modifiedAdjustedGrossIncome);

  if (businessValue === null) {
    errors.push({ field: 'businessValue', type: 'MISSING_FIELD', message: 'Business value is required' });
  } else if (businessValue <= 0) {
    errors.push({
      field: 'businessValue',
      type: 'INVALID_VALUE',
      message: `Business value must be positive. Found: ${formatUsd(businessValue)}.`,
    });
  } else if (netWorth !== null && netWorth > 0) {
    const multiple = businessValue / netWorth;
    if (multiple > BUSINESS_VALUE_HIGH_MULTIPLE) {
      warnings.push({
        field: 'businessValue',
        message: `Business value (${formatUsd(businessValue)}) seems very high relative to net worth (${formatUsd(netWorth)}) — verify accuracy`,
      });
    } else if (multiple > BUSINESS_VALUE_MODERATE_MULTIPLE) {
      warnings.push({
        field: 'businessValue',
        message: `Business value (${formatUsd(businessValue)}) is high relative to net worth (${formatUsd(netWorth)}) — verify accuracy`,
      });
    }
  }

  if (ownershipPercentage === null) {
    errors.push({ field: 'ownershipPercentage', type: 'MISSING_FIELD', message: 'Ownership % is required' });
  } else if (ownershipPercentage <= 0 || ownershipPercentage > 100) {
    errors.push({
      field: 'ownershipPercentage',
      type: 'INVALID_VALUE',
      message: 'Ownership % must be between 0 and 100',
    });
  }

  if (netWorth === null) {
    errors.push({ field: 'netWorth', type: 'MISSING_FIELD', message: 'Net worth is required' });
  } else if (netWorth < 0) {
    errors.push({ field: 'netWorth', type: 'INVALID_VALUE', message: 'Net worth cannot be negative' });
  }

  if (costBasis === null) {
    errors.push({ field: 'costBasis', type: 'MISSING_FIELD', message: 'Cost basis is required' });
  } else if (costBasis < 0) {
    errors.push({ field: 'costBasis', type: 'INVALID_VALUE', message: 'Cost basis cannot be negative' });
  }

  if (!formData.shareAcquisitionDate?.trim()) {
    errors.push({
      field: 'shareAcquisitionDate',
      type: 'MISSING_FIELD',
      message: 'Share acquisition date is required',
    });
  } else if (!isValidDateFormat(formData.shareAcquisitionDate)) {
    errors.push({
      field: 'shareAcquisitionDate',
      type: 'INVALID_VALUE',
      message: 'Share acquisition date must be YYYY-MM-DD',
    });
  }

  if (magi === null) {
    errors.push({
      field: 'modifiedAdjustedGrossIncome',
      type: 'MISSING_FIELD',
      message: 'Modified adjusted gross income is required',
    });
  } else if (magi < 0) {
    errors.push({
      field: 'modifiedAdjustedGrossIncome',
      type: 'INVALID_VALUE',
      message: 'MAGI cannot be negative',
    });
  }

  if (
    businessValue !== null &&
    ownershipPercentage !== null &&
    netWorth !== null &&
    netWorth > 0
  ) {
    const concentration = calculateConcentrationRisk(businessValue, ownershipPercentage, netWorth);
    if (concentration !== null && concentration >= 70) {
      warnings.push({
        field: 'netWorth',
        message: `Concentration risk is ${concentration}% — verify net worth and business value`,
      });
    }
  }

  if (formData.shareAcquisitionDate && isValidDateFormat(formData.shareAcquisitionDate)) {
    const acquired = parseDate(formData.shareAcquisitionDate);
    if (acquired) {
      const years =
        (Date.now() - acquired.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      if (years < 5 && formData.entityType === 'C-Corp' && formData.qsbsEligible) {
        warnings.push({
          field: 'shareAcquisitionDate',
          message: `Holding period is ${years.toFixed(1)} years — legacy QSBS typically requires more than five years`,
        });
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
