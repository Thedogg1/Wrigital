import { describe, expect, it } from 'vitest';
import {
  BUSINESS_UK_NICHE_ID,
  MANDATORY_FIELDS,
  NICHE_FIELDS,
  defaultFieldValues,
} from '@/lib/uk-landing/blueprintFields';
import {
  businessConcentration,
  calculatedPicture,
  isDefaultValue,
  ownerStakeGbp,
  prepareBlueprintRequest,
  provenanceFor,
} from '@/lib/uk-landing/blueprintRequest';

const description =
  'We work with owners of UK precision engineering businesses who are starting to think about exit or succession.';

function validInput(fields: Record<string, string> = defaultFieldValues()) {
  return {
    description,
    adviserName: 'Alex Morgan',
    firmName: 'North Advisory',
    email: 'alex@northadvisory.example',
    fields,
  };
}

describe('blueprint lead request', () => {
  it('uses the host payload niche id business_uk', () => {
    expect(BUSINESS_UK_NICHE_ID).toBe('business_uk');
  });

  it('labels every mandatory default and calculates concentration from them', () => {
    const fields = defaultFieldValues();
    expect(MANDATORY_FIELDS).toHaveLength(12);
    for (const field of MANDATORY_FIELDS) {
      expect(field.blocking).toBe(true);
      expect(provenanceFor(field, fields[field.path] ?? '')).toBe(
        'DEFAULT - DEMONSTRATION',
      );
    }

    expect(ownerStakeGbp(8_100_000, 80)).toBe(6_480_000);
    expect(businessConcentration(6_480_000, 12_000_000)).toBeCloseTo(0.54);

    const prepared = prepareBlueprintRequest(validInput());
    expect(prepared.errors).toEqual({});
    expect(prepared.request?.calculated?.ownerStakeGbp).toBe(6_480_000);
    expect(prepared.request?.calculated?.businessConcentration).toBeCloseTo(0.54);
    expect(prepared.request?.niche).toBe('business_uk');
    expect(prepared.request?.description).toBe(description);
    expect(
      prepared.request?.machineReadable &&
        (prepared.request.machineReadable as { client_profile: { financial_situation: { concentration_risk?: number } } }).client_profile.financial_situation.concentration_risk,
    ).toBeUndefined();
  });

  it('changes provenance when a default is edited, including formatted GBP', () => {
    const ebitda = MANDATORY_FIELDS.find(
      (field) => field.path === 'client_profile.primary_business.ebitda',
    );
    expect(ebitda).toBeDefined();
    expect(isDefaultValue(ebitda!, '1,800,000')).toBe(true);
    expect(provenanceFor(ebitda!, '2100000')).toBe('ADVISER PROVIDED');

    const fields = {
      ...defaultFieldValues(),
      'client_profile.primary_business.ebitda': '2100000',
    };
    const prepared = prepareBlueprintRequest(validInput(fields));
    const submitted = prepared.request?.fields.find(
      (field) => field.path === 'client_profile.primary_business.ebitda',
    );
    expect(submitted?.provenance).toBe('ADVISER PROVIDED');
    expect(submitted?.wireValue).toBe(2_100_000);
  });

  it('allows niche and optional fields to stay blank', () => {
    expect(NICHE_FIELDS.length).toBeGreaterThan(0);
    expect(NICHE_FIELDS.every((field) => field.blocking === false)).toBe(true);
    const prepared = prepareBlueprintRequest(validInput());
    expect(prepared.request?.fields.some((field) => field.section === 'niche')).toBe(
      false,
    );
  });

  it('includes a niche value only when the adviser supplies one', () => {
    const path = 'client_profile.primary_business.industry_multiplier';
    const fields = { ...defaultFieldValues(), [path]: '4.5' };
    const prepared = prepareBlueprintRequest(validInput(fields));
    const submitted = prepared.request?.fields.find((field) => field.path === path);
    expect(submitted?.provenance).toBe('ADVISER PROVIDED');
    expect(submitted?.wireValue).toBe(4.5);
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
      'client_profile.primary_business.capitalization_rate': '10',
    };
    expect(
      prepareBlueprintRequest(validInput(badRate)).errors[
        'client_profile.primary_business.capitalization_rate'
      ],
    ).toMatch(/decimal/i);

    const picture = calculatedPicture(defaultFieldValues());
    expect(picture?.businessConcentration).toBeCloseTo(0.54);
  });
});
