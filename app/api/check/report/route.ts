import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createElement } from 'react';
import { kvDel, kvGet, kvSetNx } from '@/lib/kv';
import { reportLimiter } from '@/lib/ratelimit';
import { FigureCheckRecord } from '@/emails/FigureCheckRecord';
import { InternalCheckAlert } from '@/emails/InternalCheckAlert';
import type { CheckResult } from '@/lib/check-types';
import { getResendClient } from '@/lib/email/resendClient';
import {
  contactEmail,
  resendFromAddress,
  resendReplyTo,
} from '@/lib/email/config';

const Body = z.object({
  checkId: z.string().min(6),
  email: z.string().email(),
});

function notifyAddress(): string {
  return (
    process.env.NOTIFY_TO?.trim() ||
    process.env.LEAD_NOTIFY_EMAIL?.trim() ||
    contactEmail
  );
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
  const from = resendFromAddress;

  try {
    const { error } = await resend.emails.send({
      from,
      to: email,
      replyTo: resendReplyTo,
      subject: `Figure check: ${result.domain}, ${new Date(result.finishedAt).toLocaleDateString('en-GB')}`,
      react: createElement(FigureCheckRecord, { result }),
    });
    if (error) {
      await kvDel(emailClaimKey(email));
      return NextResponse.json({ error: 'send_failed' }, { status: 502 });
    }

    await resend.emails.send({
      from,
      to: notifyAddress(),
      subject: `Check requested: ${result.domain} (${result.behindCount} behind)`,
      react: createElement(InternalCheckAlert, { result, email }),
    });

    return NextResponse.json({ ok: true });
  } catch {
    await kvDel(emailClaimKey(email));
    return NextResponse.json({ error: 'send_failed' }, { status: 502 });
  }
}
