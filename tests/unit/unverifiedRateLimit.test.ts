import { describe, expect, it } from 'vitest';
import { checkUnverifiedRateLimit } from '@/lib/unverified-answers/rateLimit';

describe('checkUnverifiedRateLimit', () => {
  it('allows the first request for a new email', () => {
    const email = `first-${Date.now()}@example.com`;
    expect(checkUnverifiedRateLimit({ email })).toEqual({ ok: true });
  });

  it('blocks after five requests for the same email', () => {
    const email = `limit-${Date.now()}@example.com`;

    for (let i = 0; i < 5; i += 1) {
      expect(checkUnverifiedRateLimit({ email })).toEqual({ ok: true });
    }

    const blocked = checkUnverifiedRateLimit({ email });
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) {
      expect(blocked.message).toContain('Too many requests for this address');
    }
  });
});
