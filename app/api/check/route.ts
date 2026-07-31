import { NextResponse } from 'next/server';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { kvSet } from '@/lib/kv';
import { checkLimiter } from '@/lib/ratelimit';
import { runScan } from '@/lib/figure-check/runScan';
import { adaptScanResult } from '@/lib/check-adapter';
import type { CheckErrorCode } from '@/lib/check-types';

export const runtime = 'nodejs';
export const maxDuration = 60;

const Body = z.object({ domain: z.string().min(4).max(253) });

function normaliseDomain(raw: string) {
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '');
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(cleaned)) return null;
  return cleaned;
}

function mapScanError(e: unknown): CheckErrorCode {
  const msg = e instanceof Error ? e.message : String(e);
  const lower = msg.toLowerCase();
  if (lower.includes('blocked') || lower.includes('403')) return 'blocked';
  if (lower.includes('enotfound') || lower.includes('unreachable'))
    return 'unreachable';
  if (lower.includes('no pages') || lower.includes('no_pages')) return 'no_pages';
  if (lower.includes('invalid')) return 'invalid_domain';
  return 'server_error';
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  const { success } = await checkLimiter.limit(ip);
  if (!success)
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: 'invalid_domain' }, { status: 400 });

  const domain = normaliseDomain(parsed.data.domain);
  if (!domain)
    return NextResponse.json({ error: 'invalid_domain' }, { status: 400 });

  try {
    const checkId = nanoid(12);
    const scan = await runScan(`https://${domain}`);
    if (scan.pagesScanned === 0) {
      return NextResponse.json({ error: 'no_pages' }, { status: 422 });
    }
    const result = adaptScanResult(scan, checkId);
    await kvSet(`check:${result.checkId}`, result, 60 * 60 * 24);
    return NextResponse.json(result);
  } catch (e: unknown) {
    const code = mapScanError(e);
    return NextResponse.json(
      { error: code },
      { status: code === 'server_error' ? 500 : 422 },
    );
  }
}
