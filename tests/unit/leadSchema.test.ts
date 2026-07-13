import { describe, expect, it } from 'vitest';
import { leadFormFieldsSchema } from '@/features/lead-capture/leadSchema';

describe('leadFormFieldsSchema', () => {
  it('accepts valid lead fields', () => {
    const result = leadFormFieldsSchema.safeParse({
      name: 'Jane Smith',
      email: 'jane@firm.com',
      firmName: 'Smith Advisory',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = leadFormFieldsSchema.safeParse({
      name: 'Jane',
      email: 'not-an-email',
      firmName: 'Firm',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty name', () => {
    const result = leadFormFieldsSchema.safeParse({
      name: '   ',
      email: 'jane@firm.com',
      firmName: 'Firm',
    });
    expect(result.success).toBe(false);
  });
});
