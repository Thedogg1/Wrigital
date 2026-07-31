import { NextResponse } from 'next/server';
import { z } from 'zod';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { kvGet } from '@/lib/kv';
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

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  if (!(await reportLimiter.limit(ip)).success)
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });

  const result = await kvGet<CheckResult>(`check:${parsed.data.checkId}`);
  if (!result)
    return NextResponse.json({ error: 'expired' }, { status: 410 });

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'send_failed' }, { status: 502 });
  }

  const resend = getResendClient();
  const from = resendFromAddress;
  const customerHtml = renderToStaticMarkup(
    createElement(FigureCheckRecord, { result }),
  );
  const alertHtml = renderToStaticMarkup(
    createElement(InternalCheckAlert, {
      result,
      email: parsed.data.email,
    }),
  );

  const { error } = await resend.emails.send({
    from,
    to: parsed.data.email,
    replyTo: resendReplyTo,
    subject: `Figure check: ${result.domain}, ${new Date(result.finishedAt).toLocaleDateString('en-GB')}`,
    html: customerHtml,
  });
  if (error) return NextResponse.json({ error: 'send_failed' }, { status: 502 });

  await resend.emails.send({
    from,
    to: notifyAddress(),
    subject: `Check requested: ${result.domain} (${result.behindCount} behind)`,
    html: alertHtml,
  });

  return NextResponse.json({ ok: true });
}
