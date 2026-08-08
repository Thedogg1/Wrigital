import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  contactEmail,
  resendFromAddress,
  resendReplyTo,
} from '@/lib/email/config';
import { getResendClient } from '@/lib/email/resendClient';
import { calendlyUrl } from '@/lib/site';
import {
  TIME_BANDS,
  formatLondonTimestamp,
  formatUkLongDate,
  isSelectableWorkingDay,
  isValidUkPhone,
  timeBandLowercase,
  type TimeBand,
} from '@/lib/brochure/dates';

const HONEYPOT_FIELD = 'b_hp';

const BROCHURE_PATH = path.join(
  process.cwd(),
  'public',
  'brochure',
  'Wrigital.pdf',
);

const SUBJECT = 'Your Wrigital brochure';

const brochureRequestSchema = z.object({
  email: z.string().trim().email(),
  phone: z
    .string()
    .trim()
    .refine(isValidUkPhone, { message: 'invalid_phone' }),
  date: z
    .string()
    .trim()
    .refine((value) => isSelectableWorkingDay(value), {
      message: 'invalid_date',
    }),
  time: z.enum(TIME_BANDS),
});

function notifyAddress(): string {
  return process.env.LEAD_NOTIFY_EMAIL?.trim() || contactEmail;
}

function notifyFromAddress(): string {
  const fromEmail =
    process.env.RESEND_FROM_EMAIL?.trim() || 'hello@contact.wrigital.com';
  return `Wrigital site <${fromEmail}>`;
}

function buildVisitorText(dateLabel: string, timeLabel: string): string {
  return `Thank you for asking for the brochure. The document is attached.

Inside you will find what we build, what each solution includes, what each costs, and how to start.

I will ring you on ${dateLabel}, ${timeLabel}. If that stops suiting you, reply to this email and we will find another time.

If you would rather pick an exact slot yourself, book thirty minutes here: ${calendlyUrl}

Terry Martin
Wrigital Ltd
hello@wrigital.com
Company number 16967085`;
}

function buildVisitorHtml(dateLabel: string, timeLabel: string): string {
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Your Wrigital brochure</title>
</head>
<body style="margin:0;padding:0;background:#faf7f0;color:#0a2342;font-family:Georgia,'Times New Roman',serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;text-align:left;">
    <p style="margin:0 0 16px;font-size:16px;line-height:1.6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#475569;">
      Thank you for asking for the brochure. The document is attached.
    </p>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#475569;">
      Inside you will find what we build, what each solution includes, what each costs, and how to start.
    </p>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#475569;">
      I will ring you on ${dateLabel}, ${timeLabel}. If that stops suiting you, reply to this email and we will find another time.
    </p>
    <p style="margin:0 0 28px;font-size:16px;line-height:1.6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#475569;">
      If you would rather pick an exact slot yourself, book thirty minutes here:
      <a href="${calendlyUrl}" style="color:#0a2342;">${calendlyUrl}</a>
    </p>
    <p style="margin:0;font-size:16px;line-height:1.6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0a2342;">
      Terry Martin<br />
      Wrigital Ltd<br />
      <a href="mailto:hello@wrigital.com" style="color:#0a2342;">hello@wrigital.com</a><br />
      Company number 16967085
    </p>
  </div>
</body>
</html>`;
}

function buildNotifyText(input: {
  email: string;
  phone: string;
  dateLabel: string;
  timeLabel: string;
  timestamp: string;
}): string {
  return `Brochure requested from /consultancy.

Number to call: ${input.phone}
Best day: ${input.dateLabel}
Best time: ${input.timeLabel}
Email: ${input.email}

Submitted: ${input.timestamp}
`;
}

function buildNotifyHtml(input: {
  email: string;
  phone: string;
  dateLabel: string;
  timeLabel: string;
  timestamp: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en-GB">
<head><meta charset="utf-8" /><title>Brochure request</title></head>
<body style="margin:0;padding:24px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0a2342;background:#faf7f0;">
  <p style="margin:0 0 16px;font-size:16px;line-height:1.5;">Brochure requested from /consultancy.</p>
  <p style="margin:0 0 8px;font-size:18px;line-height:1.5;font-weight:700;">
    Number to call: <a href="tel:${input.phone.replace(/\s+/g, '')}" style="color:#0a2342;">${input.phone}</a>
  </p>
  <p style="margin:0 0 8px;font-size:18px;line-height:1.5;font-weight:700;">
    Best day: ${input.dateLabel}
  </p>
  <p style="margin:0 0 16px;font-size:18px;line-height:1.5;font-weight:700;">
    Best time: ${input.timeLabel}
  </p>
  <p style="margin:0 0 8px;font-size:16px;line-height:1.5;">
    Email: <a href="mailto:${input.email}" style="color:#0a2342;">${input.email}</a>
  </p>
  <p style="margin:0;font-size:14px;line-height:1.5;color:#475569;">
    Submitted: ${input.timestamp}
  </p>
</body>
</html>`;
}

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const rateLimitWindows = new Map<string, number[]>();

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const stamps = (rateLimitWindows.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );
  if (stamps.length >= RATE_LIMIT_MAX) {
    rateLimitWindows.set(ip, stamps);
    return false;
  }
  stamps.push(now);
  rateLimitWindows.set(ip, stamps);
  return true;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const record =
    typeof body === 'object' && body !== null
      ? (body as Record<string, unknown>)
      : {};

  const honeypot =
    typeof record[HONEYPOT_FIELD] === 'string'
      ? (record[HONEYPOT_FIELD] as string)
      : '';

  if (honeypot.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const parsed = brochureRequestSchema.safeParse({
    email: record.email,
    phone: record.phone,
    date: record.date,
    time: record.time,
  });

  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { email, phone, date, time } = parsed.data;
  const timeBand = time as TimeBand;
  const dateLabel = formatUkLongDate(date);
  const timeLabel = timeBandLowercase(timeBand);

  const ip = clientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  if (!existsSync(BROCHURE_PATH)) {
    console.error(`Brochure PDF missing at ${BROCHURE_PATH}`);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  try {
    const pdfBuffer = await readFile(BROCHURE_PATH);
    const resend = getResendClient();

    const { data: visitorData, error: visitorError } = await resend.emails.send({
      from: resendFromAddress,
      replyTo: resendReplyTo,
      to: [email],
      subject: SUBJECT,
      text: buildVisitorText(dateLabel, timeLabel),
      html: buildVisitorHtml(dateLabel, timeLabel),
      attachments: [
        {
          filename: 'Wrigital.pdf',
          content: pdfBuffer,
        },
      ],
    });

    if (visitorError || !visitorData?.id) {
      console.error(
        'Brochure email send failed:',
        visitorError?.message ?? 'No message id returned from Resend',
      );
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    const notifyTo = notifyAddress();
    const notifyPayload = {
      email,
      phone,
      dateLabel,
      timeLabel,
      timestamp: formatLondonTimestamp(),
    };

    const { error: notifyError } = await resend.emails.send({
      from: notifyFromAddress(),
      replyTo: email,
      to: [notifyTo],
      subject: `Brochure request: ${email}`,
      text: buildNotifyText(notifyPayload),
      html: buildNotifyHtml(notifyPayload),
    });

    if (notifyError) {
      console.error('Brochure notify email failed:', notifyError.message);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(
      'Brochure email send failed:',
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
