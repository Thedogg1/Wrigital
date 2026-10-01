import { z } from 'zod';
import {
  ALL_BLUEPRINT_FIELDS,
  BUSINESS_UK_NICHE_ID,
  UK_ENTITY_TYPES,
  type BlueprintField,
} from '@/lib/uk-landing/blueprintFields';

export const FINPRINT_SAMPLE_HONEYPOT_FIELD = 'b_hp';

export const PROVENANCE = {
  adviser: 'ADVISER PROVIDED',
  defaultDemo: 'DEFAULT - DEMONSTRATION',
  calculated: 'CALCULATED',
  notProvided: 'NOT PROVIDED',
} as const;

export type ProvenanceLabel = (typeof PROVENANCE)[keyof typeof PROVENANCE];

export interface SubmittedField {
  path: string;
  label: string;
  section: BlueprintField['section'];
  display: string;
  provenance: ProvenanceLabel;
  wireValue: string | number | boolean;
}

export interface CalculatedPicture {
  ownerStakeGbp: number;
  businessConcentration: number;
}

export interface PreparedBlueprintRequest {
  niche: typeof BUSINESS_UK_NICHE_ID;
  description: string;
  adviserName: string;
  firmName: string;
  email: string;
  fields: SubmittedField[];
  clientProfile: Record<string, unknown>;
  calculated: CalculatedPicture | null;
  machineReadable: Record<string, unknown>;
}

export interface BlueprintLeadInput {
  description: string;
  adviserName: string;
  firmName: string;
  email: string;
  fields: Record<string, string>;
}

const contactSchema = z.object({
  description: z
    .string()
    .trim()
    .min(40, 'Please add a few sentences about the type of owner.')
    .max(8000, 'Please shorten the description.'),
  adviserName: z
    .string()
    .trim()
    .min(2, 'Please enter your name.')
    .max(120, 'Please enter a shorter name.'),
  firmName: z
    .string()
    .trim()
    .min(2, 'Please enter your firm name.')
    .max(160, 'Please enter a shorter firm name.'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid work email address.')
    .max(254, 'Please enter a valid work email address.'),
});

export function parseLooseNumber(raw: string): number | null {
  const cleaned = raw
    .trim()
    .replace(/£/g, '')
    .replace(/,/g, '')
    .replace(/\s/g, '');
  if (!cleaned || !/^\d+(\.\d+)?$/.test(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

export function parseDecimal0to1(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed || trimmed.includes('%')) return null;
  const value = parseLooseNumber(trimmed);
  if (value === null || value < 0 || value > 1) return null;
  return value;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function isValidIsoDate(raw: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return false;
  const parsed = new Date(`${raw}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return false;
  return parsed.toISOString().slice(0, 10) === raw && raw <= todayIso();
}

export function formatGbp(value: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercentFromDecimal(value: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'percent',
    maximumFractionDigits: 1,
  }).format(value);
}

export function ownerStakeGbp(
  businessValue: number,
  ownershipPercent: number,
): number {
  return businessValue * (ownershipPercent / 100);
}

export function businessConcentration(
  stake: number,
  netWorth: number,
): number | null {
  if (netWorth <= 0) return null;
  return stake / netWorth;
}

function numbersEqual(left: number | null, right: number | null): boolean {
  if (left === null || right === null) return false;
  return Math.abs(left - right) < 0.000001;
}

export function isDefaultValue(field: BlueprintField, raw: string): boolean {
  if (field.defaultValue === undefined) return false;
  if (
    field.kind === 'gbp' ||
    field.kind === 'number' ||
    field.kind === 'integer' ||
    field.kind === 'percent_0_100'
  ) {
    return numbersEqual(
      parseLooseNumber(raw),
      parseLooseNumber(field.defaultValue),
    );
  }
  return raw.trim() === field.defaultValue.trim();
}

export function provenanceFor(
  field: BlueprintField,
  raw: string,
): ProvenanceLabel {
  if (!raw.trim()) return PROVENANCE.notProvided;
  if (field.blocking && isDefaultValue(field, raw)) return PROVENANCE.defaultDemo;
  return PROVENANCE.adviser;
}

function invalidMessage(field: BlueprintField): string {
  switch (field.kind) {
    case 'gbp':
      return `Enter ${field.label} as a GBP amount of zero or more.`;
    case 'percent_0_100':
      return field.path.endsWith('ownership_percentage')
        ? 'Enter ownership as a percentage above 0 and up to 100.'
        : `Enter ${field.label} as a percentage from 0 to 100.`;
    case 'decimal_0_1':
      return `Enter ${field.label} as a decimal from 0 to 1. For 10%, enter 0.10.`;
    case 'integer':
      return field.path === 'client_profile.age'
        ? 'Enter age as a whole number from 18 to 120.'
        : `Enter ${field.label} as a whole number of zero or more.`;
    case 'number':
      return `Enter ${field.label} as a number of zero or more.`;
    case 'date':
      return `Enter ${field.label} as YYYY-MM-DD, not a future date.`;
    case 'entity':
      return 'Choose a UK entity type.';
    case 'boolean':
      return `Choose yes or no for ${field.label}, or leave it blank.`;
    default:
      return `Check ${field.label}.`;
  }
}

function wireValue(
  field: BlueprintField,
  raw: string,
): { ok: true; value: string | number | boolean; display: string } | { ok: false } {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false };

  if (field.kind === 'text') {
    if (trimmed.length > 500) return { ok: false };
    return { ok: true, value: trimmed, display: trimmed };
  }

  if (field.kind === 'entity') {
    if (!UK_ENTITY_TYPES.includes(trimmed as (typeof UK_ENTITY_TYPES)[number])) {
      return { ok: false };
    }
    const display = trimmed === 'SoleTrader' ? 'Sole trader' : trimmed;
    return { ok: true, value: trimmed, display };
  }

  if (field.kind === 'boolean') {
    if (trimmed !== 'true' && trimmed !== 'false') return { ok: false };
    const value = trimmed === 'true';
    return { ok: true, value, display: value ? 'Yes' : 'No' };
  }

  if (field.kind === 'date') {
    if (!isValidIsoDate(trimmed)) return { ok: false };
    return { ok: true, value: trimmed, display: trimmed };
  }

  if (field.kind === 'decimal_0_1') {
    const value = parseDecimal0to1(trimmed);
    if (value === null) return { ok: false };
    return {
      ok: true,
      value,
      display: `${value} (${formatPercentFromDecimal(value)})`,
    };
  }

  const value = parseLooseNumber(trimmed);
  if (value === null) return { ok: false };

  if (field.kind === 'gbp') {
    if (value < 0) return { ok: false };
    return { ok: true, value, display: formatGbp(value) };
  }

  if (field.kind === 'integer') {
    if (!Number.isInteger(value) || value < 0) return { ok: false };
    if (field.path === 'client_profile.age' && (value < 18 || value > 120)) {
      return { ok: false };
    }
    return { ok: true, value, display: String(value) };
  }

  if (field.kind === 'percent_0_100') {
    const min = field.path.endsWith('ownership_percentage') ? 0 : -0.000001;
    if (value <= min || value > 100) return { ok: false };
    return { ok: true, value, display: `${value}%` };
  }

  if (field.kind === 'number') {
    if (value < 0) return { ok: false };
    return { ok: true, value, display: String(value) };
  }

  return { ok: false };
}

function setPath(
  target: Record<string, unknown>,
  path: string,
  value: string | number | boolean,
) {
  const parts = path.split('.');
  let cursor = target;
  for (let index = 0; index < parts.length - 1; index += 1) {
    const key = parts[index];
    const next = cursor[key];
    if (typeof next !== 'object' || next === null || Array.isArray(next)) {
      cursor[key] = {};
    }
    cursor = cursor[key] as Record<string, unknown>;
  }
  cursor[parts[parts.length - 1]] = value;
}

function readNumber(
  fields: Record<string, string>,
  path: string,
): number | null {
  return parseLooseNumber(fields[path] ?? '');
}

export function calculatedPicture(
  fields: Record<string, string>,
): CalculatedPicture | null {
  const businessValue = readNumber(
    fields,
    'client_profile.primary_business.business_value',
  );
  const ownership = readNumber(
    fields,
    'client_profile.primary_business.ownership_percentage',
  );
  const netWorth = readNumber(fields, 'client_profile.net_worth');
  if (businessValue === null || ownership === null || netWorth === null) {
    return null;
  }
  const stake = ownerStakeGbp(businessValue, ownership);
  const concentration = businessConcentration(stake, netWorth);
  if (concentration === null) return null;
  return { ownerStakeGbp: stake, businessConcentration: concentration };
}

export function prepareBlueprintRequest(input: BlueprintLeadInput): {
  errors: Record<string, string>;
  request: PreparedBlueprintRequest | null;
} {
  const errors: Record<string, string> = {};
  const contact = contactSchema.safeParse(input);
  if (!contact.success) {
    for (const issue of contact.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      errors[key] ??= issue.message;
    }
  }

  const submitted: SubmittedField[] = [];
  const clientProfile: Record<string, unknown> = {};
  const provenance: Record<string, ProvenanceLabel> = {};

  for (const field of ALL_BLUEPRINT_FIELDS) {
    const raw = input.fields[field.path] ?? '';
    if (!raw.trim()) {
      if (field.blocking) {
        errors[field.path] = `Enter ${field.label}, or keep the demonstration default.`;
      }
      continue;
    }

    const parsed = wireValue(field, raw);
    if (!parsed.ok) {
      errors[field.path] = invalidMessage(field);
      continue;
    }

    const provenanceLabel = provenanceFor(field, raw);
    submitted.push({
      path: field.path,
      label: field.label,
      section: field.section,
      display: parsed.display,
      provenance: provenanceLabel,
      wireValue: parsed.value,
    });
    provenance[field.path] = provenanceLabel;
    setPath(clientProfile, field.path, parsed.value);
  }

  const gross = readNumber(
    input.fields,
    'client_profile.financial_situation.gross_income',
  );
  const tax = readNumber(
    input.fields,
    'client_profile.financial_situation.annual_tax_burden',
  );
  if (gross !== null && tax !== null && tax > gross) {
    errors['client_profile.financial_situation.annual_tax_burden'] =
      'Annual tax burden cannot be higher than gross income.';
  }

  const netWorth = readNumber(input.fields, 'client_profile.net_worth');
  if (netWorth !== null && netWorth <= 0) {
    errors['client_profile.net_worth'] =
      'Enter a net worth above zero so the business stake can be compared with total wealth.';
  }

  if (Object.keys(errors).length > 0 || !contact.success) {
    return { errors, request: null };
  }

  const calculated = calculatedPicture(input.fields);
  const data = contact.data;
  const machineReadable = {
    niche: BUSINESS_UK_NICHE_ID,
    description: data.description,
    contact: {
      name: data.adviserName,
      firm: data.firmName,
      email: data.email,
    },
    client_profile: clientProfile.client_profile ?? {},
    provenance,
    calculated: calculated
      ? {
          owner_stake_gbp: calculated.ownerStakeGbp,
          business_concentration: calculated.businessConcentration,
          provenance: PROVENANCE.calculated,
          formula:
            'owner stake = business value x ownership percentage / 100; concentration = owner stake / net worth',
        }
      : null,
    inference:
      'Not applied at submission. Missing niche and optional fields stay not provided. Later demonstration work may infer about 25% of eligible gaps, label those assumptions, and leave the rest unknown.',
  };

  return {
    errors: {},
    request: {
      niche: BUSINESS_UK_NICHE_ID,
      description: data.description,
      adviserName: data.adviserName,
      firmName: data.firmName,
      email: data.email,
      fields: submitted,
      clientProfile,
      calculated,
      machineReadable,
    },
  };
}
