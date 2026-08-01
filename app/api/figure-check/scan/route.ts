import { NextRequest } from 'next/server';
import { z } from 'zod';
import { checkFigureCheckRateLimit } from '@/lib/figure-check/rateLimit';
import { runScan } from '@/lib/figure-check/runScan';
import { saveScan } from '@/lib/figure-check/scanStore';
import type { ScanResult } from '@/lib/figure-check/types';

export const maxDuration = 60;

const bodySchema = z.object({
  url: z.string().min(1, 'Please enter a website URL.'),
});

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }
  return request.headers.get('x-real-ip') ?? 'unknown';
}

function ndjsonLine(obj: unknown): string {
  return `${JSON.stringify(obj)}\n`;
}

export async function POST(request: NextRequest) {
  const limit = checkFigureCheckRateLimit(clientIp(request));
  if (!limit.ok) {
    return new Response(JSON.stringify({ error: limit.message }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Please send a JSON body with a url field.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({
        error:
          parsed.error.issues[0]?.message ?? 'Please enter a website URL.',
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) => {
        controller.enqueue(encoder.encode(ndjsonLine(obj)));
      };

      try {
        send({
          type: 'progress',
          pagesScanned: 0,
          status: 'Starting crawl of public pages…',
        });

        const result: ScanResult = await runScan(parsed.data.url, {
          onProgress: (p) => {
            send({
              type: 'progress',
              pagesScanned: p.pagesScanned,
              status: p.status,
            });
          },
        });

        saveScan(result);

        const {
          scanId,
          domain,
          pagesScanned,
          pagesSkipped,
          truncated,
          counts,
          findings,
          pagesRead,
          scannedAt,
        } = result;

        send({
          type: 'result',
          scanId,
          domain,
          pagesScanned,
          pagesSkipped,
          truncated,
          counts,
          findings,
          pagesRead,
          scannedAt,
        });
      } catch (e) {
        if (
          e instanceof Error &&
          e.message === 'UNVERIFIED_FIGURES' &&
          'unverifiedIds' in e
        ) {
          send({
            type: 'error',
            status: 503,
            error: 'Figure table contains unverified entries.',
            unverifiedIds: (e as Error & { unverifiedIds: string[] })
              .unverifiedIds,
          });
        } else {
          const message =
            e instanceof Error
              ? e.message
              : 'The scan could not be completed.';
          console.error('[figure-check:scan]', e);
          send({ type: 'error', status: 400, error: message });
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
