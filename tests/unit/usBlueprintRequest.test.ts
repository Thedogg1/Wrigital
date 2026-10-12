import { describe, expect, it } from 'vitest';
import {
  BUSINESS_USA_NICHE_ID,
  MANDATORY_FIELDS,
  NICHE_FIELDS,
  defaultFieldValues,
} from '@/lib/us-landing/blueprintFields';
import { payloadGeneratorLines } from '@/lib/landing/payloadGeneratorPaste';
import {
  businessConcentration,
  calculatedPicture,
  formatUsd,
  isDefaultValue,
  ownerStakeUsd,
  parseLooseNumber,
  prepareBlueprintRequest,
  provenanceFor,
} from '@/lib/us-landing/blueprintRequest';

const description =
  'We work with owners of US manufacturing businesses who are starting to think about exit or succession.';

function validInput(fields: Record<string, string> = defaultFieldValues()) {
  return {
    description,
    advisorName: 'Alex Morgan',
    firmName: 'North Advisory',
    email: 'alex@northadvisory.example',
    fields,
  };
}

describe('US blueprint lead request', () => {
  it('uses the host payload niche id business_usa', () => {
    expect(BUSINESS_USA_NICHE_ID).toBe('business_usa');
  });

  it('labels every mandatory default and calculates concentration from them', () => {
    const fields = defaultFieldValues();
    expect(MANDATORY_FIELDS).toHaveLength(12);
    expect(fields['client_profile.primary_business.entity_type']).toBe('C-Corp');
    expect(fields['client_profile.net_worth']).toBe('12000000');
    expect(fields['client_profile.primary_business.business_value']).toBe('8100000');
    for (const field of MANDATORY_FIELDS) {
      expect(field.blocking).toBe(true);
      expect(provenanceFor(field, fields[field.path] ?? '')).toBe(
        'DEFAULT - DEMONSTRATION',
      );
    }

    expect(ownerStakeUsd(8_100_000, 80)).toBe(6_480_000);
    expect(businessConcentration(6_480_000, 12_000_000)).toBeCloseTo(0.54);

    const prepared = prepareBlueprintRequest(validInput());
    expect(prepared.errors).toEqual({});
    expect(prepared.request?.calculated?.ownerStakeUsd).toBe(6_480_000);
    expect(prepared.request?.calculated?.businessConcentration).toBeCloseTo(0.54);
    expect(prepared.request?.niche).toBe('business_usa');
    expect(prepared.request?.description).toBe(description);
    const machine = prepared.request?.machineReadable as {
      niche: string;
      client_profile: {
        primary_business: { entity_type: string };
        financial_situation: { concentration_risk?: number };
      };
      calculated: { owner_stake_usd: number; business_concentration: number };
    };
    expect(machine.niche).toBe('business_usa');
    expect(machine.client_profile.primary_business.entity_type).toBe('C-Corp');
    expect(machine.client_profile.financial_situation.concentration_risk).toBeUndefined();
    expect(machine.calculated.owner_stake_usd).toBe(6_480_000);
    expect(machine.calculated.business_concentration).toBeCloseTo(0.54);

    const paste = payloadGeneratorLines(prepared.request?.fields ?? []);
    expect(paste.split('\n').every((line) => /^[^:\n]+: .+$/.test(line))).toBe(true);
    expect(paste).toContain('Name: Representative Business Owner');
    expect(paste).toContain(`Net Worth: ${formatUsd(12_000_000)}`);
    expect(paste).toContain(`Business Value: ${formatUsd(8_100_000)}`);
    expect(paste).toContain(`EBITDA: ${formatUsd(1_800_000)}`);
    const netWorth = paste
      .split('\n')
      .find((line) => line.startsWith('Net Worth:'));
    expect(parseLooseNumber(netWorth?.split(': ')[1] ?? '')).toBe(12_000_000);
  });

  it('changes provenance when a default is edited, including formatted USD', () => {
    const ebitda = MANDATORY_FIELDS.find(
      (field) => field.path === 'client_profile.primary_business.ebitda',
    );
    expect(ebitda).toBeDefined();
    expect(isDefaultValue(ebitda!, '1,800,000')).toBe(true);
    expect(provenanceFor(ebitda!, '2100000')).toBe('ADVISOR PROVIDED');

    const fields = {
      ...defaultFieldValues(),
      'client_profile.primary_business.ebitda': '2100000',
    };
    const prepared = prepareBlueprintRequest(validInput(fields));
    const submitted = prepared.request?.fields.find(
      (field) => field.path === 'client_profile.primary_business.ebitda',
    );
    expect(submitted?.provenance).toBe('ADVISOR PROVIDED');
    expect(submitted?.wireValue).toBe(2_100_000);
  });

  it('allows niche and optional fields to stay blank', () => {
    expect(NICHE_FIELDS.length).toBeGreaterThan(0);
    expect(NICHE_FIELDS.every((field) => field.blocking === false)).toBe(true);
    expect(NICHE_FIELDS.every((field) => field.group !== 'BusinessUSA fields')).toBe(
      true,
    );
    const prepared = prepareBlueprintRequest(validInput());
    expect(prepared.request?.fields.some((field) => field.section === 'niche')).toBe(
      false,
    );
    expect(prepared.request?.fields.some((field) => field.section === 'optional')).toBe(
      false,
    );
  });

  it('includes a niche value only when the advisor supplies one', () => {
    const path = 'client_profile.primary_business.discount_rate';
    const fields = { ...defaultFieldValues(), [path]: '0.08' };
    const prepared = prepareBlueprintRequest(validInput(fields));
    const submitted = prepared.request?.fields.find((field) => field.path === path);
    expect(submitted?.provenance).toBe('ADVISOR PROVIDED');
    expect(submitted?.wireValue).toBe(0.08);
  });

  it('rejects an impossible tax burden and a percentage entered as a whole percent', () => {
    const tooMuchTax = {
      ...defaultFieldValues(),
      'client_profile.financial_situation.annual_tax_burden': '400000',
    };
    expect(
      prepareBlueprintRequest(validInput(tooMuchTax)).errors[
        'client_profile.financial_situation.annual_tax_burden'
      ],
    ).toBeTruthy();

    const badRate = {
      ...defaultFieldValues(),
      'client_profile.primary_business.discount_rate': '8',
    };
    expect(
      prepareBlueprintRequest(validInput(badRate)).errors[
        'client_profile.primary_business.discount_rate'
      ],
    ).toMatch(/decimal/i);

    const picture = calculatedPicture(defaultFieldValues());
    expect(picture?.businessConcentration).toBeCloseTo(0.54);
  });

  it('rejects a UK entity type', () => {
    const fields = {
      ...defaultFieldValues(),
      'client_profile.primary_business.entity_type': 'Ltd',
    };
    expect(
      prepareBlueprintRequest(validInput(fields)).errors[
        'client_profile.primary_business.entity_type'
      ],
    ).toMatch(/US entity/i);
  });
});
