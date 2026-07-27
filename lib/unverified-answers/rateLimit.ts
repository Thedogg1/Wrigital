type Bucket = {
  count: number;
  resetAt: number;
};

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_EMAIL = 5;
const MAX_PER_IP = 20;

const emailBuckets = new Map<string, Bucket>();
const ipBuckets = new Map<string, Bucket>();

function take(map: Map<string, Bucket>, key: string, max: number): boolean {
  const now = Date.now();
  const existing = map.get(key);

  if (!existing || now > existing.resetAt) {
    map.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (existing.count >= max) {
    return false;
  }

  existing.count += 1;
  return true;
}

export function checkUnverifiedRateLimit(input: {
  email: string;
  ip?: string;
}): { ok: true } | { ok: false; message: string } {
  const emailKey = input.email.trim().toLowerCase();
  if (!take(emailBuckets, emailKey, MAX_PER_EMAIL)) {
    return {
      ok: false,
      message: 'Too many requests for this address. Please try again later.',
    };
  }

  if (input.ip && !take(ipBuckets, input.ip, MAX_PER_IP)) {
    return {
      ok: false,
      message: 'Too many requests from this network. Please try again later.',
    };
  }

  return { ok: true };
}
