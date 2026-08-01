import dns from 'node:dns/promises';
import net from 'node:net';

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'metadata.google.internal',
  'metadata',
]);

function ipv4ToInt(ip: string): number {
  const parts = ip.split('.').map((p) => Number(p));
  if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
    return -1;
  }
  return ((parts[0]! << 24) >>> 0) + (parts[1]! << 16) + (parts[2]! << 8) + parts[3]!;
}

function isPrivateIpv4(ip: string): boolean {
  const n = ipv4ToInt(ip);
  if (n < 0) return true;
  // 127.0.0.0/8
  if ((n & 0xff000000) === 0x7f000000) return true;
  // 10.0.0.0/8
  if ((n & 0xff000000) === 0x0a000000) return true;
  // 172.16.0.0/12
  if ((n & 0xfff00000) === 0xac100000) return true;
  // 192.168.0.0/16
  if ((n & 0xffff0000) === 0xc0a80000) return true;
  // 169.254.0.0/16
  if ((n & 0xffff0000) === 0xa9fe0000) return true;
  // 0.0.0.0/8
  if ((n & 0xff000000) === 0x00000000) return true;
  return false;
}

function isPrivateIpv6(ip: string): boolean {
  const normalized = ip.toLowerCase();
  if (normalized === '::1') return true;
  if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true; // ULA
  if (normalized.startsWith('fe80')) return true; // link-local
  // IPv4-mapped
  if (normalized.includes('.')) {
    const v4 = normalized.split(':').pop();
    if (v4 && net.isIP(v4) === 4) return isPrivateIpv4(v4);
  }
  return false;
}

export function isBlockedIp(ip: string): boolean {
  const version = net.isIP(ip);
  if (version === 4) return isPrivateIpv4(ip);
  if (version === 6) return isPrivateIpv6(ip);
  return true;
}

export function isBlockedHostname(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, '');
  if (BLOCKED_HOSTNAMES.has(host)) return true;
  if (host.endsWith('.localhost') || host.endsWith('.local')) return true;
  if (net.isIP(host)) return isBlockedIp(host);
  return false;
}

export async function assertPublicUrl(url: URL): Promise<void> {
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error('Only http and https URLs are supported.');
  }
  if (isBlockedHostname(url.hostname)) {
    throw new Error('That address is not a public website we can scan.');
  }
  let addresses: string[];
  try {
    const result = await dns.lookup(url.hostname, { all: true });
    addresses = result.map((r) => r.address);
  } catch {
    throw new Error('Could not resolve that domain.');
  }
  if (addresses.length === 0) {
    throw new Error('Could not resolve that domain.');
  }
  for (const addr of addresses) {
    if (isBlockedIp(addr)) {
      throw new Error('That address resolves to a private network and cannot be scanned.');
    }
  }
}
