type RedisClient = {
  set: (
    key: string,
    value: unknown,
    opts?: { ex?: number; nx?: boolean },
  ) => Promise<'OK' | null | unknown>;
  get: <T>(key: string) => Promise<T | null>;
  del: (...keys: string[]) => Promise<number>;
};

function createRedis(): RedisClient | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    // Optional dependency — installed when Upstash is configured.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Redis } = require('@upstash/redis');
    return new Redis({ url, token }) as RedisClient;
  } catch {
    return null;
  }
}

export const redis = createRedis();

const memory = new Map<string, { value: unknown; expiresAt: number }>();

export async function kvSet(key: string, value: unknown, exSeconds: number) {
  if (redis) {
    await redis.set(key, value, { ex: exSeconds });
    return;
  }
  memory.set(key, { value, expiresAt: Date.now() + exSeconds * 1000 });
}

/** Returns true if the key was set; false if it already existed. */
export async function kvSetNx(
  key: string,
  value: unknown,
  exSeconds?: number,
): Promise<boolean> {
  if (redis) {
    const opts: { nx: boolean; ex?: number } = { nx: true };
    if (exSeconds != null) opts.ex = exSeconds;
    const result = await redis.set(key, value, opts);
    return result === 'OK';
  }
  const existing = await kvGet(key);
  if (existing != null) return false;
  if (exSeconds != null) {
    memory.set(key, { value, expiresAt: Date.now() + exSeconds * 1000 });
  } else {
    memory.set(key, { value, expiresAt: Number.MAX_SAFE_INTEGER });
  }
  return true;
}

export async function kvDel(key: string) {
  if (redis) {
    await redis.del(key);
    return;
  }
  memory.delete(key);
}

export async function kvGet<T>(key: string): Promise<T | null> {
  if (redis) {
    return redis.get<T>(key);
  }
  const entry = memory.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memory.delete(key);
    return null;
  }
  return entry.value as T;
}
