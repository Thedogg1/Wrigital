import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  REPORT_TTL_MS,
  buildIdempotencyKey,
  buildReportToken,
  isReportExpired,
  loadReport,
  type BuildReportTokenInput,
} from '@/lib/unverified-answers/reportStore';
import type { CompleteUnverifiedAnswersInput } from '@/lib/unverifiedAnswers';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const sampleAnswers: CompleteUnverifiedAnswersInput = {
  people: 5,
  frequencyBand: '3_5',
  subjects: ['uk_tax'],
  regulatedShareBand: 'half',
  tools: ['copilot_tenant'],
  sourceAccess: 'no',
  linkCheck: 'never',
  clientTrace: 'no',
  policy: 'no',
  piDisclosure: 'no',
  piRenewalMonth: 'not_sure',
};

const sampleInput: BuildReportTokenInput = {
  email: 'principal@firm.com',
  answers: sampleAnswers,
  marketingConsent: false,
  consentWordingVersion: '1.0',
  consentCapturedAt: '2026-07-27T13:00:00.000Z',
};

beforeEach(() => {
  process.env.REPORT_SIGNING_SECRET = 'test-signing-secret';
});

afterEach(() => {
  delete process.env.REPORT_SIGNING_SECRET;
});

describe('reportStore', () => {
  it('builds a signed token that round-trips through loadReport', async () => {
    const token = buildReportToken({
      ...sampleInput,
      firmName: 'Northgate Financial',
    });

    expect(token).toContain('.');

    const loaded = await loadReport(token);
    expect(loaded?.email).toBe('principal@firm.com');
    expect(loaded?.firmName).toBe('Northgate Financial');
    expect(loaded?.answers.people).toBe(5);
    expect(loaded?.answers.piDisclosure).toBe('no');
  });

  it('returns null for tampered tokens', async () => {
    const token = buildReportToken(sampleInput);
    const tampered = `${token}x`;

    await expect(loadReport(tampered)).resolves.toBeNull();
  });

  it('returns null for malformed tokens', async () => {
    await expect(loadReport('not-a-token')).resolves.toBeNull();
  });

  it('detects expired reports', () => {
    const expired = {
      token: 'expired',
      createdAt: '2020-01-01T00:00:00.000Z',
      expiresAt: new Date(Date.now() - 1000).toISOString(),
      email: 'principal@firm.com',
      answers: sampleAnswers,
      marketingConsent: false,
      consentWordingVersion: '1.0',
      consentCapturedAt: '2020-01-01T00:00:00.000Z',
    };

    expect(isReportExpired(expired)).toBe(true);
  });

  it('builds stable idempotency keys for the same email and answers', () => {
    const first = buildIdempotencyKey('Principal@Firm.com', sampleAnswers);
    const second = buildIdempotencyKey('principal@firm.com', sampleAnswers);
    expect(first).toBe(second);
  });

  it('returns the same token for the same submission on the same UTC day', () => {
    const first = buildReportToken(sampleInput);
    const second = buildReportToken({
      ...sampleInput,
      consentCapturedAt: '2026-07-27T18:00:00.000Z',
      marketingConsent: true,
    });

    expect(first).toBe(second);
  });

  it('sets expiry roughly 30 days from the UTC day bucket', async () => {
    const token = buildReportToken(sampleInput);
    const loaded = await loadReport(token);

    expect(loaded).not.toBeNull();
    const expiresAt = new Date(loaded!.expiresAt).getTime();
    const minExpiry = Date.now() + REPORT_TTL_MS - MS_PER_DAY;
    const maxExpiry = Date.now() + REPORT_TTL_MS + MS_PER_DAY;
    expect(expiresAt).toBeGreaterThan(minExpiry);
    expect(expiresAt).toBeLessThan(maxExpiry);
  });
});
