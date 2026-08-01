import { NextResponse } from 'next/server';
import { z } from 'zod';
import { kvDel, kvGet, kvSetNx } from '@/lib/kv';
import { reportLimiter } from '@/lib/ratelimit';
import { buildFigureCheckRecordHtml } from '@/emails/FigureCheckRecord';
import { buildInternalCheckAlertHtml } from '@/emails/InternalCheckAlert';
import type { CheckResult } from '@/lib/check-types';
import { getResendClient } from '@/lib/email/resendClient';
import { syncResendAudienceContact } from '@/lib/unverified-answers/syncResendContact';
import {
  contactEmail,
  resendFromAddress,
  resendReplyTo,
} from '@/lib/email/config';

const Body = z.object({
  checkId: z.string().min(6),
  email: z.string().email(),
  budgetRecheck: z.boolean().optional().default(false),
});

function notifyAddress(): string {
  return (
    process.env.NOTIFY_TO?.trim() ||
    process.env.LEAD_NOTIFY_EMAIL?.trim() ||
    contactEmail
  );
}

function emailFromAddress(): string {
  return process.env.EMAIL_FROM?.trim() || resendFromAddress;
}

function normaliseEmail(email: string) {
  return email.trim().toLowerCase();
}

function emailClaimKey(email: string) {
  return `funnel-report-email:${normaliseEmail(email)}`;
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  if (!(await reportLimiter.limit(ip)).success)
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });

  const email = normaliseEmail(parsed.data.email);
  const result = await kvGet<CheckResult>(`check:${parsed.data.checkId}`);
  if (!result)
    return NextResponse.json({ error: 'expired' }, { status: 410 });

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'send_failed' }, { status: 502 });
  }

  const claimed = await kvSetNx(emailClaimKey(email), {
    checkId: result.checkId,
    domain: result.domain,
    claimedAt: new Date().toISOString(),
  });
  if (!claimed) {
    return NextResponse.json({ error: 'email_used' }, { status: 409 });
  }

  const resend = getResendClient();
  const from = emailFromAddress();

  try {
    const date = new Date(result.finishedAt).toLocaleDateString('en-GB');
    const hasFindings = result.findings.length > 0;
    const subject = hasFindings
      ? `Your figure check: ${result.domain}, ${date}`
      : `Your figure check: ${result.domain} is clean, ${date}`;

    const { error } = await resend.emails.send({
      from,
      to: [email],
      replyTo: resendReplyTo,
      subject,
      html: buildFigureCheckRecordHtml(result, parsed.data.budgetRecheck),
    });
    if (error) {
      console.error('[api/check/report] Resend error', error);
      await kvDel(emailClaimKey(email));
      return NextResponse.json({ error: 'send_failed' }, { status: 502 });
    }

    try {
      await syncResendAudienceContact({
        email,
        source: '/RAG_Offer/website-figure-check',
        // Record only: no newsletter opt-in. Existing marketing opt-ins are kept.
        marketingConsent: false,
        properties: {
          check_domain: result.domain,
          check_behind: String(result.behindCount),
          budget_recheck: parsed.data.budgetRecheck ? 'yes' : 'no',
        },
      });
    } catch (contactError) {
      console.error(
        '[api/check/report] Resend contact sync failed',
        contactError,
      );
    }

    const notifyTo = notifyAddress().toLowerCase();
    if (notifyTo && notifyTo !== email) {
      const { error: notifyError } = await resend.emails.send({
        from,
        to: [notifyTo],
        replyTo: resendReplyTo,
        subject: `Check requested: ${result.domain} (${result.behindCount} behind)`,
        html: buildInternalCheckAlertHtml(result, email),
      });
      if (notifyError) {
        console.error('[api/check/report] notify error', notifyError);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[api/check/report] unexpected', e);
    await kvDel(emailClaimKey(email));
    return NextResponse.json({ error: 'send_failed' }, { status: 502 });
  }
}
