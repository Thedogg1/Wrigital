type Bucket = {
  count: number;
  resetAt: number;
};

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_IP = 3;

const ipBuckets = new Map<string, Bucket>();

export function checkFigureCheckRateLimit(
  ip: string,
): { ok: true } | { ok: false; message: string } {
  const key = ip.trim() || 'unknown';
  const now = Date.now();
  const existing = ipBuckets.get(key);

  if (!existing || now > existing.resetAt) {
    ipBuckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }

  if (existing.count >= MAX_PER_IP) {
    return {
      ok: false,
      message: 'Too many scans from this network. Please try again in a few minutes.',
    };
  }

  existing.count += 1;
  return { ok: true };
}
