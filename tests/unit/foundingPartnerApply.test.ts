import { describe, expect, it } from 'vitest';
import {
  FOUNDING_PARTNER_CALENDLY_URL,
  emptyFoundingPartnerAnswers,
  foundingPartnerApplyResult,
} from '@/lib/landing/foundingPartnerApply';

describe('founding partner apply', () => {
  it('offers the Calendly call only when both answers are yes', () => {
    expect(FOUNDING_PARTNER_CALENDLY_URL).toBe(
      'https://calendly.com/hello-wrigital/30min',
    );
    expect(foundingPartnerApplyResult(emptyFoundingPartnerAnswers())).toBe(
      'incomplete',
    );
    expect(
      foundingPartnerApplyResult({ meet: 'yes', demonstrate: '' }),
    ).toBe('incomplete');
    expect(
      foundingPartnerApplyResult({ meet: 'yes', demonstrate: 'yes' }),
    ).toBe('book');
    expect(
      foundingPartnerApplyResult({ meet: 'yes', demonstrate: 'no' }),
    ).toBe('not-a-fit');
    expect(
      foundingPartnerApplyResult({ meet: 'no', demonstrate: 'yes' }),
    ).toBe('not-a-fit');
    expect(
      foundingPartnerApplyResult({ meet: 'no', demonstrate: 'no' }),
    ).toBe('not-a-fit');
  });
});
