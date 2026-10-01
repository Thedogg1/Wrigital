import { NextRequest, NextResponse } from 'next/server';
import { contactEmail } from '@/lib/email/config';
import {
  FINPRINT_SAMPLE_HONEYPOT_FIELD,
  prepareBlueprintRequest,
} from '@/lib/uk-landing/blueprintRequest';
import { sendFinprintSampleRequestEmail } from '@/lib/uk-landing/sendFinprintSampleRequestEmail';

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

function asStringRecord(value: unknown): Record<string, string> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return {};
  }
  const record: Record<string, string> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry === 'string') record[key] = entry;
  }
  return record;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid request.' },
      { status: 400 },
    );
  }

  const record =
    typeof body === 'object' && body !== null
      ? (body as Record<string, unknown>)
      : {};

  const honeypot =
    typeof record[FINPRINT_SAMPLE_HONEYPOT_FIELD] === 'string'
      ? record[FINPRINT_SAMPLE_HONEYPOT_FIELD]
      : '';

  if (honeypot.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const prepared = prepareBlueprintRequest({
    description: typeof record.description === 'string' ? record.description : '',
    adviserName: typeof record.adviserName === 'string' ? record.adviserName : '',
    firmName: typeof record.firmName === 'string' ? record.firmName : '',
    email: typeof record.email === 'string' ? record.email : '',
    fields: asStringRecord(record.fields),
  });

  if (!prepared.request) {
    const firstError = Object.values(prepared.errors)[0] ?? 'Please check the form.';
    return NextResponse.json(
      { ok: false, error: firstError, fieldErrors: prepared.errors },
      { status: 400 },
    );
  }

  if (!checkRateLimit(clientIp(request))) {
    return NextResponse.json(
      { ok: false, error: 'Please wait a while and try again.' },
      { status: 429 },
    );
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      {
        ok: false,
        error: `Email delivery is not configured. Please contact ${contactEmail}.`,
      },
      { status: 503 },
    );
  }

  try {
    await sendFinprintSampleRequestEmail(prepared.request);
  } catch (error) {
    console.error(
      'FinPrint Blueprint request email failed:',
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      {
        ok: false,
        error: `We could not send your request. Please try again or email ${contactEmail}.`,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
