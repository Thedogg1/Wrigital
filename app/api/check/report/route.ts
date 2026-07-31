import { NextResponse } from 'next/server';
import { z } from 'zod';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { Resend } from 'resend';
import { kvGet } from '@/lib/kv';
import { reportLimiter } from '@/lib/ratelimit';
import { FigureCheckRecord } from '@/emails/FigureCheckRecord';
import { InternalCheckAlert } from '@/emails/InternalCheckAlert';
import type { CheckResult } from '@/lib/check-types';

const Body = z.object({
  checkId: z.string().min(6),
  email: z.string().email(),
});

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

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const notifyTo = process.env.NOTIFY_TO ?? 'hello@wrigital.com';

  if (!apiKey || !from) {
    return NextResponse.json({ error: 'send_failed' }, { status: 502 });
  }

  const resend = new Resend(apiKey);
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
    replyTo: 'hello@wrigital.com',
    subject: `Figure check: ${result.domain}, ${new Date(result.finishedAt).toLocaleDateString('en-GB')}`,
    html: customerHtml,
  });
  if (error) return NextResponse.json({ error: 'send_failed' }, { status: 502 });

  await resend.emails.send({
    from,
    to: notifyTo,
    subject: `Check requested: ${result.domain} (${result.behindCount} behind)`,
    html: alertHtml,
  });

  return NextResponse.json({ ok: true });
}
