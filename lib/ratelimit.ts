import { redis } from './kv';

const memoryWindows = new Map<string, number[]>();

function memoryLimit(
  key: string,
  max: number,
  windowMs: number,
): { success: boolean } {
  const now = Date.now();
  const stamps = (memoryWindows.get(key) ?? []).filter(
    (t) => now - t < windowMs,
  );
  if (stamps.length >= max) {
    memoryWindows.set(key, stamps);
    return { success: false };
  }
  stamps.push(now);
  memoryWindows.set(key, stamps);
  return { success: true };
}

type Limiter = { limit: (id: string) => Promise<{ success: boolean }> };

function createUpstashLimiter(max: number, prefix: string): Limiter | null {
  if (!redis) return null;
  try {
    // Optional dependency
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('@upstash/ratelimit') as {
      Ratelimit: {
        new (opts: {
          redis: unknown;
          limiter: unknown;
          prefix: string;
        }): { limit: (id: string) => Promise<{ success: boolean }> };
        slidingWindow: (max: number, window: string) => unknown;
      };
    };
    const { Ratelimit } = mod;
    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(max, '1 h'),
      prefix,
    });
    return {
      limit: async (id: string) => limiter.limit(id),
    };
  } catch {
    return null;
  }
}

/** 5 figure checks per IP per hour. */
export const checkLimiter: Limiter =
  createUpstashLimiter(5, 'rl:check') ?? {
    limit: async (id: string) => memoryLimit(`check:${id}`, 5, 60 * 60 * 1000),
  };

/** 3 report emails per IP per hour. */
export const reportLimiter: Limiter =
  createUpstashLimiter(3, 'rl:report') ?? {
    limit: async (id: string) => memoryLimit(`report:${id}`, 3, 60 * 60 * 1000),
  };

/** 3 wizard reports per IP per hour. */
export const wizardLimiter: Limiter =
  createUpstashLimiter(3, 'rl:wizard') ?? {
    limit: async (id: string) => memoryLimit(`wizard:${id}`, 3, 60 * 60 * 1000),
  };
