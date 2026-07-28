import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { CONSENT_WORDING_VERSION, HONEYPOT_FIELD_NAME } from '@/lib/unverifiedAnswers';

const sendUnverifiedReportEmail = vi.fn<
  (input: { email: string; reportUrl: string }) => Promise<void>
>(async () => undefined);
const saveUnverifiedLead = vi.fn(async () => undefined);
const syncResendContact = vi.fn(async () => undefined);

vi.mock('@/lib/unverified-answers/sendUnverifiedReportEmail', () => ({
  sendUnverifiedReportEmail,
}));

vi.mock('@/lib/unverified-answers/saveUnverifiedLead', () => ({
  saveUnverifiedLead,
  getUnverifiedLeadsFilePath: () => '/tmp/unverified-leads.jsonl',
}));

vi.mock('@/lib/unverified-answers/syncResendContact', () => ({
  syncResendContact,
}));

const validBody = {
  email: 'principal@firm.com',
  firmName: 'Northgate Financial',
  marketingConsent: true,
  consentWordingVersion: CONSENT_WORDING_VERSION,
  answers: {
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
    piRenewalMonth: 'march',
  },
  [HONEYPOT_FIELD_NAME]: '',
};

function postJson(body: unknown, origin = 'http://localhost:3000') {
  return new NextRequest(`${origin}/api/unverified-answer-capture`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/unverified-answer-capture', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = 'test-key';
    process.env.REPORT_SIGNING_SECRET = 'test-signing-secret';
  });

  it('returns silent success when the honeypot is filled', async () => {
    const { POST } = await import('@/app/api/unverified-answer-capture/route');
    const response = await POST(
      postJson({ ...validBody, [HONEYPOT_FIELD_NAME]: 'https://spam.example' }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(sendUnverifiedReportEmail).not.toHaveBeenCalled();
    expect(syncResendContact).not.toHaveBeenCalled();
  });

  it('recomputes on the server, syncs Resend, and sends a signed report link', async () => {
    const { POST } = await import('@/app/api/unverified-answer-capture/route');
    const response = await POST(postJson(validBody));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(syncResendContact).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'principal@firm.com',
        firmName: 'Northgate Financial',
        marketingConsent: true,
        piDisclosure: 'no',
        piRenewalMonth: 'march',
      }),
    );
    expect(sendUnverifiedReportEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'principal@firm.com',
        reportUrl: expect.stringMatching(
          /^http:\/\/localhost:3000\/unverified-answer-count\/report\/.+\..+$/,
        ),
      }),
    );
  });

  it('reuses the same signed token for repeat submissions on the same day', async () => {
    const { POST } = await import('@/app/api/unverified-answer-capture/route');
    await POST(postJson(validBody));
    await POST(postJson(validBody));

    expect(sendUnverifiedReportEmail).toHaveBeenCalledTimes(2);
    const firstUrl = sendUnverifiedReportEmail.mock.calls[0][0].reportUrl;
    const secondUrl = sendUnverifiedReportEmail.mock.calls[1][0].reportUrl;
    expect(firstUrl).toBe(secondUrl);
  });

  it('still sends the report when Resend contact sync fails', async () => {
    syncResendContact.mockRejectedValueOnce(new Error('contact quota'));
    const { POST } = await import('@/app/api/unverified-answer-capture/route');
    const response = await POST(postJson(validBody));

    expect(response.status).toBe(200);
    expect(sendUnverifiedReportEmail).toHaveBeenCalledTimes(1);
  });

  it('rejects invalid payloads', async () => {
    const { POST } = await import('@/app/api/unverified-answer-capture/route');
    const response = await POST(
      postJson({ ...validBody, email: 'not-an-email' }),
    );

    expect(response.status).toBe(400);
    expect(sendUnverifiedReportEmail).not.toHaveBeenCalled();
    expect(syncResendContact).not.toHaveBeenCalled();
  });
});
