import { NextRequest, NextResponse } from 'next/server';
import { unverifiedLeadSchema } from '@/features/unverified-answers/unverifiedLeadSchema';
import { checkUnverifiedRateLimit } from '@/lib/unverified-answers/rateLimit';
import {
  buildReportToken,
  getReportSigningSecret,
} from '@/lib/unverified-answers/reportStore';
import {
  getUnverifiedLeadsFilePath,
  saveUnverifiedLead,
} from '@/lib/unverified-answers/saveUnverifiedLead';
import { sendUnverifiedReportEmail } from '@/lib/unverified-answers/sendUnverifiedReportEmail';
import { syncResendContact } from '@/lib/unverified-answers/syncResendContact';
import { getReportResult } from '@/lib/unverified-answers/buildReportHtml';
import {
  HONEYPOT_FIELD_NAME,
  isCountedResult,
  type CompleteUnverifiedAnswersInput,
} from '@/lib/unverifiedAnswers';

function clientIp(request: NextRequest): string | undefined {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim();
  }
  return request.headers.get('x-real-ip') ?? undefined;
}

function reportUrlForToken(token: string, request: NextRequest): string {
  const base = request.nextUrl.origin.replace(/\/$/, '');
  return `${base}/unverified-answer-count/report/${encodeURIComponent(token)}`;
}

function missingConfigResponse(missing: string): NextResponse {
  const isLocal =
    process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

  return NextResponse.json(
    {
      error: isLocal
        ? `${missing} is not configured. Add it to .env.local and restart the dev server.`
        : 'Something went wrong. Please try again later.',
    },
    { status: 503 },
  );
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return missingConfigResponse('RESEND_API_KEY');
    }

    try {
      getReportSigningSecret();
    } catch {
      return missingConfigResponse('REPORT_SIGNING_SECRET');
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Something went wrong. Please try again later.' },
        { status: 400 },
      );
    }

    const honeypot =
      typeof body === 'object' &&
      body !== null &&
      HONEYPOT_FIELD_NAME in body
        ? String((body as Record<string, unknown>)[HONEYPOT_FIELD_NAME] ?? '')
        : '';

    if (honeypot.trim().length > 0) {
      return NextResponse.json({ success: true });
    }

    const parsed = unverifiedLeadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 },
      );
    }

    const {
      email,
      firmName,
      complianceOfficerEmail,
      marketingConsent,
      consentWordingVersion,
      answers,
    } = parsed.data;

    const ip = clientIp(request);
    const rate = checkUnverifiedRateLimit({ email, ip });
    if (!rate.ok) {
      return NextResponse.json({ error: rate.message }, { status: 429 });
    }

    const completeAnswers = answers as CompleteUnverifiedAnswersInput;
    const result = getReportResult(completeAnswers);
    const consentCapturedAt = new Date().toISOString();

    const token = buildReportToken({
      email,
      firmName,
      complianceOfficerEmail,
      answers: completeAnswers,
      marketingConsent,
      consentWordingVersion,
      consentCapturedAt,
    });

    try {
      await saveUnverifiedLead({
        email,
        firmName,
        complianceOfficerEmail,
        marketingConsent,
        consentWordingVersion,
        consentCapturedAt,
        answers: completeAnswers,
        resultStatus: result.status,
        untraceable: isCountedResult(result) ? result.untraceable : null,
        reportToken: token,
        source: '/unverified-answer-count',
        submittedAt: consentCapturedAt,
        clientIp: ip,
      });
      console.log(`Unverified lead saved to ${getUnverifiedLeadsFilePath()}`);
    } catch (fileError) {
      console.error('Failed to save unverified lead:', fileError);
    }

    try {
      await syncResendContact({
        email,
        firmName,
        marketingConsent,
        resultStatus: result.status,
        untraceable: isCountedResult(result) ? result.untraceable : null,
        piDisclosure: completeAnswers.piDisclosure,
        piRenewalMonth: completeAnswers.piRenewalMonth,
      });
    } catch (contactError) {
      console.error('Failed to sync Resend contact:', contactError);
    }

    const reportUrl = reportUrlForToken(token, request);

    try {
      await sendUnverifiedReportEmail({ email, reportUrl });

      if (complianceOfficerEmail) {
        await sendUnverifiedReportEmail({
          email: complianceOfficerEmail,
          reportUrl,
          isComplianceOfficerCopy: true,
        });
      }
    } catch (emailError) {
      console.error('Failed to send unverified report email:', emailError);
      return NextResponse.json(
        {
          error:
            'Something went wrong sending the email. Your request was saved. Please try again.',
          canRetry: true,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unverified answer capture error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 },
    );
  }
}
