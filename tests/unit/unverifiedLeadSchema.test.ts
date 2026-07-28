import { describe, expect, it } from 'vitest';
import { unverifiedLeadSchema } from '@/features/unverified-answers/unverifiedLeadSchema';
import { CONSENT_WORDING_VERSION, HONEYPOT_FIELD_NAME } from '@/lib/unverifiedAnswers';

const validAnswers = {
  people: 5,
  frequencyBand: '3_5' as const,
  subjects: ['uk_tax' as const],
  regulatedShareBand: 'half' as const,
  tools: ['copilot_tenant' as const],
  sourceAccess: 'no' as const,
  linkCheck: 'never' as const,
  clientTrace: 'no' as const,
  policy: 'no' as const,
  piDisclosure: 'no' as const,
  piRenewalMonth: 'march' as const,
};

function validLead(overrides: Record<string, unknown> = {}) {
  return {
    email: 'principal@firm.com',
    marketingConsent: false,
    consentWordingVersion: CONSENT_WORDING_VERSION,
    answers: validAnswers,
    [HONEYPOT_FIELD_NAME]: '',
    ...overrides,
  };
}

describe('unverifiedLeadSchema', () => {
  it('accepts a complete lead payload', () => {
    const result = unverifiedLeadSchema.safeParse(validLead());
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.complianceOfficerEmail).toBeUndefined();
      expect(result.data.firmName).toBeUndefined();
    }
  });

  it('accepts an optional firm name', () => {
    const result = unverifiedLeadSchema.safeParse(
      validLead({ firmName: 'Northgate Financial' }),
    );
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.firmName).toBe('Northgate Financial');
    }
  });

  it('treats blank firm name as omitted', () => {
    const result = unverifiedLeadSchema.safeParse(validLead({ firmName: '   ' }));
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.firmName).toBeUndefined();
    }
  });

  it('accepts an optional compliance officer email', () => {
    const result = unverifiedLeadSchema.safeParse(
      validLead({ complianceOfficerEmail: 'compliance@firm.com' }),
    );
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.complianceOfficerEmail).toBe('compliance@firm.com');
    }
  });

  it('treats blank compliance officer email as omitted', () => {
    const result = unverifiedLeadSchema.safeParse(
      validLead({ complianceOfficerEmail: '   ' }),
    );
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.complianceOfficerEmail).toBeUndefined();
    }
  });

  it('rejects invalid principal email', () => {
    const result = unverifiedLeadSchema.safeParse(
      validLead({ email: 'not-an-email' }),
    );
    expect(result.success).toBe(false);
  });

  it('rejects invalid compliance officer email when provided', () => {
    const result = unverifiedLeadSchema.safeParse(
      validLead({ complianceOfficerEmail: 'not-an-email' }),
    );
    expect(result.success).toBe(false);
  });

  it('rejects answers outside allowed ranges', () => {
    const result = unverifiedLeadSchema.safeParse(
      validLead({
        answers: { ...validAnswers, people: 0 },
      }),
    );
    expect(result.success).toBe(false);
  });

  it('requires both PI answers', () => {
    const result = unverifiedLeadSchema.safeParse(
      validLead({
        answers: { ...validAnswers, piDisclosure: undefined },
      }),
    );
    expect(result.success).toBe(false);
  });

  it('allows the honeypot field through parsing', () => {
    const result = unverifiedLeadSchema.safeParse(
      validLead({ [HONEYPOT_FIELD_NAME]: 'https://spam.example' }),
    );
    expect(result.success).toBe(true);
  });
});
