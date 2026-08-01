import type { ScanResult } from './types';

type StoredScan = {
  result: ScanResult;
  expiresAt: number;
};

const TTL_MS = 30 * 60 * 1000;
const store = new Map<string, StoredScan>();

function prune(now = Date.now()): void {
  for (const [id, entry] of store) {
    if (entry.expiresAt <= now) store.delete(id);
  }
}

export function saveScan(result: ScanResult): void {
  prune();
  store.set(result.scanId, {
    result,
    expiresAt: Date.now() + TTL_MS,
  });
}

export function getScan(scanId: string): ScanResult | null {
  prune();
  const entry = store.get(scanId);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    store.delete(scanId);
    return null;
  }
  return entry.result;
}
