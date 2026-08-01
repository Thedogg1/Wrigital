import * as cheerio from 'cheerio';
import { assertPublicUrl, isBlockedHostname } from './ssrf';
import type { PagesSkipped } from './types';

export const USER_AGENT =
  'WrigitalFigureCheck/1.0 (+https://wrigital.com/website-figure-check; contact hello@wrigital.com)';

export const MAX_PAGES = 40;
export const MAX_DEPTH = 3;
export const CONCURRENCY = 4;
export const PER_REQUEST_TIMEOUT_MS = 8000;
export const SCAN_HARD_CAP_MS = 45000;

/** How many sitemap URLs to keep as crawl candidates before prioritising. */
const SITEMAP_CANDIDATE_CAP = 400;

/**
 * Prefer pages likely to state statutory figures; deprioritise locations,
 * contact forms, and marketing chrome that burn the page budget.
 */
export function urlContentScore(urlStr: string): number {
  let path = '/';
  try {
    path = new URL(urlStr).pathname.toLowerCase();
  } catch {
    return 0;
  }

  let score = 0;
  if (
    /tax|allowance|cgt|capital-gains|isa|iht|inheritance|pension|dividend|nil-rate|nil_rate|threshold|exempt/.test(
      path,
    )
  ) {
    score += 120;
  }
  // Prefer topic hubs (/tax, /isas) over long blog posts that share keywords
  if (/\/(tax|isas?|pensions?|inheritance-tax|capital-gains-tax)\/?$/.test(path)) {
    score += 80;
  }
  if (/financial-planning\/(?!.*blog)/.test(path)) {
    score += 40;
  }
  // Guides/resources that are not blog posts still useful; blog posts are
  // scenario-heavy so they rank below hubs (scenario noise is also suppressed
  // in the report adapter).
  if (/\/(guide|guides|knowledge|resource|resources|advice)(\/|$)/.test(path)) {
    score += 30;
  }
  if (
    /\/(blog|blogs|insight|insights|article|articles|news)(\/|$)/.test(path) ||
    /financial-planning-blog|wealth-planning-blog/.test(path)
  ) {
    score -= 40;
  }
  if (
    /our-locations|\/locations?\/|\/tag\/|\/category\/|\/author\/|contact|career|job|team|about|webinar|event|media|press|wealth-index|cookie|privacy|login|sign-in/.test(
      path,
    )
  ) {
    score -= 80;
  }
  // Prefer shallower content URLs
  score -= Math.min(path.split('/').filter(Boolean).length, 6) * 8;
  return score;
}

function sortQueueByContentPriority(queue: QueueItem[]): void {
  queue.sort((a, b) => {
    const scoreDiff = urlContentScore(b.url) - urlContentScore(a.url);
    if (scoreDiff !== 0) return scoreDiff;
    return a.depth - b.depth;
  });
}

/** Opt-in for corporate TLS interception during local scans. Never enable in production. */
if (
  process.env.FIGURE_CHECK_INSECURE_TLS === '1' &&
  process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0'
) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

function errorMessage(e: unknown): string {
  if (!(e instanceof Error)) return 'Fetch failed';
  const cause = (e as Error & { cause?: unknown }).cause;
  if (cause instanceof Error && cause.message) {
    return cause.message;
  }
  return e.message || 'Fetch failed';
}

const MULTI_PART_TLDS = new Set([
  'co.uk',
  'org.uk',
  'ac.uk',
  'gov.uk',
  'ltd.uk',
  'me.uk',
  'net.uk',
  'plc.uk',
  'sch.uk',
  'com.au',
  'co.nz',
  'co.za',
]);

export function registrableDomain(hostname: string): string {
  const host = hostname.toLowerCase().replace(/\.$/, '');
  const parts = host.split('.').filter(Boolean);
  if (parts.length <= 2) return host;
  const lastTwo = parts.slice(-2).join('.');
  if (MULTI_PART_TLDS.has(lastTwo) && parts.length >= 3) {
    return parts.slice(-3).join('.');
  }
  return lastTwo;
}

export function normaliseInputUrl(raw: string): URL {
  let input = raw.trim();
  if (!input) throw new Error('Please enter a website URL.');
  if (!/^https?:\/\//i.test(input)) {
    input = `https://${input}`;
  }
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new Error('That does not look like a valid website URL.');
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('Only http and https URLs are supported.');
  }
  url.hash = '';
  // Prefer https
  if (url.protocol === 'http:') {
    url.protocol = 'https:';
  }
  return url;
}

export type FetchedPage = {
  url: string;
  finalUrl: string;
  html: string;
  title: string;
  contentType: string;
};

export type CrawlProgress = {
  pagesScanned: number;
  status: string;
};

export type CrawlResult = {
  domain: string;
  pages: FetchedPage[];
  pagesSkipped: PagesSkipped[];
  truncated: boolean;
};

type QueueItem = { url: string; depth: number };

function sameSite(a: URL, b: URL): boolean {
  return registrableDomain(a.hostname) === registrableDomain(b.hostname);
}

function canonicalUrl(href: string, base: URL): string | null {
  try {
    const u = new URL(href, base);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    u.hash = '';
    // Drop common tracking params lightly — keep path/query otherwise
    return u.toString();
  } catch {
    return null;
  }
}

type RobotsRules = {
  disallows: string[];
  allows: string[];
};

function parseRobotsTxt(text: string): RobotsRules {
  const lines = text.split(/\r?\n/);
  let inStar = false;
  let inOurs = false;
  const disallows: string[] = [];
  const allows: string[] = [];
  const starDisallows: string[] = [];
  const starAllows: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.split('#')[0]?.trim() ?? '';
    if (!line) continue;
    const colon = line.indexOf(':');
    if (colon < 0) continue;
    const key = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();

    if (key === 'user-agent') {
      const ua = value.toLowerCase();
      inStar = ua === '*';
      inOurs = ua.includes('wrigital');
      continue;
    }
    if (!inStar && !inOurs) continue;
    if (key === 'disallow') {
      if (inOurs) disallows.push(value);
      else starDisallows.push(value);
    } else if (key === 'allow') {
      if (inOurs) allows.push(value);
      else starAllows.push(value);
    }
  }

  return {
    disallows: disallows.length || allows.length ? disallows : starDisallows,
    allows: disallows.length || allows.length ? allows : starAllows,
  };
}

function isPathAllowed(pathname: string, rules: RobotsRules): boolean {
  const path = pathname || '/';
  let matchedDisallow: string | null = null;
  let matchedAllow: string | null = null;

  for (const rule of rules.disallows) {
    if (!rule) continue; // empty disallow = allow all
    if (path.startsWith(rule)) {
      if (!matchedDisallow || rule.length > matchedDisallow.length) {
        matchedDisallow = rule;
      }
    }
  }
  for (const rule of rules.allows) {
    if (!rule) continue;
    if (path.startsWith(rule)) {
      if (!matchedAllow || rule.length > matchedAllow.length) {
        matchedAllow = rule;
      }
    }
  }

  if (matchedAllow && matchedDisallow) {
    return matchedAllow.length >= matchedDisallow.length;
  }
  if (matchedDisallow) return false;
  return true;
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
  signal?: AbortSignal,
): Promise<Response> {
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', onAbort, { once: true });
  }
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      redirect: 'manual',
      headers: {
        'User-Agent': USER_AGENT,
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        ...(init.headers ?? {}),
      },
    });
  } finally {
    clearTimeout(timer);
    if (signal) signal.removeEventListener('abort', onAbort);
  }
}

/** Follow at most one redirect. */
async function fetchOnce(
  url: string,
  timeoutMs: number,
  signal?: AbortSignal,
): Promise<{ response: Response; finalUrl: string }> {
  const first = await fetchWithTimeout(url, { method: 'GET' }, timeoutMs, signal);
  if ([301, 302, 303, 307, 308].includes(first.status)) {
    const loc = first.headers.get('location');
    if (!loc) return { response: first, finalUrl: url };
    const next = new URL(loc, url).toString();
    const second = await fetchWithTimeout(next, { method: 'GET' }, timeoutMs, signal);
    return { response: second, finalUrl: next };
  }
  return { response: first, finalUrl: url };
}

async function loadRobots(
  origin: URL,
  cache: Map<string, string>,
  signal?: AbortSignal,
): Promise<RobotsRules> {
  const robotsUrl = new URL('/robots.txt', origin).toString();
  try {
    const { response, finalUrl } = await fetchOnce(
      robotsUrl,
      PER_REQUEST_TIMEOUT_MS,
      signal,
    );
    if (!response.ok) return { disallows: [], allows: [] };
    const text = await response.text();
    cache.set(finalUrl, text);
    return parseRobotsTxt(text);
  } catch {
    return { disallows: [], allows: [] };
  }
}

function extractSitemapLocs(xml: string): string[] {
  const locs: string[] = [];
  const re = /<loc>\s*([^<]+?)\s*<\/loc>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) {
    const loc = m[1]?.trim();
    if (loc) locs.push(loc);
  }
  return locs;
}

function isSitemapXmlUrl(urlStr: string): boolean {
  try {
    const path = new URL(urlStr).pathname.toLowerCase();
    return path.endsWith('.xml') && path.includes('sitemap');
  } catch {
    return false;
  }
}

/** Hard cap on page URLs collected while expanding sitemaps (before scoring). */
const SITEMAP_EXPAND_CAP = 2000;

/**
 * Resolve a sitemap or sitemap index into page URLs. Child sitemap XML files
 * are fetched and expanded fully; results are scored and the best `maxPages`
 * candidates returned (so location-heavy sitemaps do not crowd out tax pages).
 */
async function collectSitemapPageUrls(
  sitemapUrl: string,
  startUrl: URL,
  pageCache: Map<string, string>,
  signal: AbortSignal | undefined,
  maxPages: number,
): Promise<string[]> {
  const out: string[] = [];
  const seenXml = new Set<string>();
  const seenPage = new Set<string>();
  const pending: string[] = [sitemapUrl];
  let guard = 0;

  while (pending.length > 0 && out.length < SITEMAP_EXPAND_CAP && guard < 40) {
    guard += 1;
    const next = pending.shift()!;
    if (seenXml.has(next)) continue;
    seenXml.add(next);

    try {
      const { response, finalUrl } = await fetchOnce(
        next,
        PER_REQUEST_TIMEOUT_MS,
        signal,
      );
      if (!response.ok) continue;
      const body = await response.text();
      pageCache.set(finalUrl, body);

      const locs = extractSitemapLocs(body);
      const isIndex =
        body.includes('<sitemapindex') ||
        locs.some((loc) => isSitemapXmlUrl(loc));

      for (const loc of locs) {
        try {
          const u = new URL(loc);
          if (!sameSite(u, startUrl)) continue;
          if (isBlockedHostname(u.hostname)) continue;
          if (isSitemapXmlUrl(loc) || (isIndex && loc.toLowerCase().endsWith('.xml'))) {
            if (!seenXml.has(loc)) pending.push(loc);
            continue;
          }
          if (/\.(pdf|jpg|jpeg|png|gif|svg|webp|zip|css|js)(\?|$)/i.test(u.pathname)) {
            continue;
          }
          const pageKey = u.toString();
          if (seenPage.has(pageKey)) continue;
          seenPage.add(pageKey);
          out.push(pageKey);
          if (out.length >= SITEMAP_EXPAND_CAP) break;
        } catch {
          // ignore bad loc
        }
      }
    } catch {
      // optional
    }
  }

  out.sort((a, b) => urlContentScore(b) - urlContentScore(a));
  return out.slice(0, maxPages);
}

function extractLinks(html: string, base: URL): string[] {
  const $ = cheerio.load(html);
  const hrefs: string[] = [];
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href) return;
    const abs = canonicalUrl(href, base);
    if (abs) hrefs.push(abs);
  });
  return hrefs;
}

function pageTitle(html: string): string {
  const $ = cheerio.load(html);
  return $('title').first().text().trim() || $('h1').first().text().trim() || '';
}

export async function crawlSite(
  startUrl: URL,
  options?: {
    signal?: AbortSignal;
    onProgress?: (p: CrawlProgress) => void;
    deadlineMs?: number;
  },
): Promise<CrawlResult> {
  await assertPublicUrl(startUrl);

  const domain = registrableDomain(startUrl.hostname);
  const pageCache = new Map<string, string>();
  const pagesSkipped: PagesSkipped[] = [];
  const pages: FetchedPage[] = [];
  const seen = new Set<string>();
  const queue: QueueItem[] = [];
  const deadline = options?.deadlineMs ?? Date.now() + SCAN_HARD_CAP_MS;
  let truncated = false;

  const robots = await loadRobots(startUrl, pageCache, options?.signal);

  // Prefer sitemap URLs, expanding sitemap indexes into real page URLs and
  // prioritising tax/allowance content over locations/marketing chrome.
  let sitemapSeeded = false;
  try {
    const sitemapUrl = new URL('/sitemap.xml', startUrl).toString();
    const pageUrls = await collectSitemapPageUrls(
      sitemapUrl,
      startUrl,
      pageCache,
      options?.signal,
      SITEMAP_CANDIDATE_CAP,
    );
    // Only seed the top-ranked pages so the crawl budget is not spent on
    // low-value sitemap entries, and link discovery stays possible.
    const seedLimit = MAX_PAGES;
    const candidates: QueueItem[] = [];
    for (const key of pageUrls.slice(0, seedLimit)) {
      if (seen.has(key)) continue;
      seen.add(key);
      candidates.push({ url: key, depth: 0 });
    }
    if (candidates.length > 0) {
      sortQueueByContentPriority(candidates);
      queue.push(...candidates);
      sitemapSeeded = true;
    }
  } catch {
    // sitemap optional
  }

  if (!sitemapSeeded) {
    const startKey = startUrl.toString();
    seen.add(startKey);
    queue.push({ url: startKey, depth: 0 });
  } else {
    // Always include the start URL at depth 0 if not present
    const startKey = startUrl.toString();
    if (!seen.has(startKey)) {
      seen.add(startKey);
      queue.unshift({ url: startKey, depth: 0 });
    }
    sortQueueByContentPriority(queue);
    // Keep the entered URL near the front after prioritisation
    const startIdx = queue.findIndex((q) => q.url === startUrl.toString());
    if (startIdx > 0) {
      const [startItem] = queue.splice(startIdx, 1);
      queue.unshift(startItem!);
    }
  }

  async function processOne(item: QueueItem): Promise<void> {
    if (Date.now() >= deadline || options?.signal?.aborted) {
      truncated = true;
      return;
    }

    let urlObj: URL;
    try {
      urlObj = new URL(item.url);
    } catch {
      pagesSkipped.push({ url: item.url, reason: 'Invalid URL' });
      return;
    }

    if (!sameSite(urlObj, startUrl)) {
      pagesSkipped.push({ url: item.url, reason: 'Outside site domain' });
      return;
    }

    if (isBlockedHostname(urlObj.hostname)) {
      pagesSkipped.push({ url: item.url, reason: 'Blocked host' });
      return;
    }

    if (!isPathAllowed(urlObj.pathname, robots)) {
      pagesSkipped.push({ url: item.url, reason: 'Disallowed by robots.txt' });
      return;
    }

    // Skip obvious non-HTML extensions
    if (/\.(pdf|jpg|jpeg|png|gif|svg|webp|zip|css|js|mp4|mp3|ico)(\?|$)/i.test(urlObj.pathname)) {
      pagesSkipped.push({ url: item.url, reason: 'Non-HTML resource' });
      return;
    }

    try {
      await assertPublicUrl(urlObj);
    } catch (e) {
      pagesSkipped.push({
        url: item.url,
        reason: e instanceof Error ? e.message : 'Blocked URL',
      });
      return;
    }

    try {
      const { response, finalUrl } = await fetchOnce(
        item.url,
        PER_REQUEST_TIMEOUT_MS,
        options?.signal,
      );

      if (!response.ok) {
        pagesSkipped.push({
          url: item.url,
          reason: `HTTP ${response.status}`,
        });
        return;
      }

      const contentType = response.headers.get('content-type') ?? '';
      if (
        contentType &&
        !contentType.includes('text/html') &&
        !contentType.includes('application/xhtml')
      ) {
        pagesSkipped.push({ url: item.url, reason: `Non-HTML content type: ${contentType}` });
        return;
      }

      const html = await response.text();
      pageCache.set(finalUrl, html);

      const finalObj = new URL(finalUrl);
      if (!sameSite(finalObj, startUrl)) {
        pagesSkipped.push({ url: finalUrl, reason: 'Redirect left site domain' });
        return;
      }

      pages.push({
        url: item.url,
        finalUrl,
        html,
        title: pageTitle(html),
        contentType,
      });

      options?.onProgress?.({
        pagesScanned: pages.length,
        status: `Scanning ${finalObj.pathname || '/'}…`,
      });

      if (item.depth < MAX_DEPTH && pages.length < MAX_PAGES) {
        const links = extractLinks(html, finalObj);
        const discovered: QueueItem[] = [];
        for (const link of links) {
          if (pages.length + queue.length + discovered.length >= MAX_PAGES * 3) {
            break;
          }
          try {
            const linkUrl = new URL(link);
            if (!sameSite(linkUrl, startUrl)) continue;
            const key = linkUrl.toString();
            if (seen.has(key)) continue;
            seen.add(key);
            discovered.push({ url: key, depth: item.depth + 1 });
          } catch {
            // ignore
          }
        }
        if (discovered.length > 0) {
          sortQueueByContentPriority(discovered);
          // Append remaining work after the current cursor window by pushing
          // high-priority discoveries first.
          queue.push(...discovered);
        }
      }
    } catch (e) {
      const reason =
        e instanceof Error && e.name === 'AbortError'
          ? 'Timed out'
          : errorMessage(e);
      pagesSkipped.push({ url: item.url, reason });
    }
  }

  let cursor = 0;
  async function worker(): Promise<void> {
    while (true) {
      if (Date.now() >= deadline || options?.signal?.aborted) {
        truncated = true;
        return;
      }
      if (pages.length >= MAX_PAGES) return;
      const idx = cursor++;
      if (idx >= queue.length) return;
      const item = queue[idx]!;
      if (pages.length >= MAX_PAGES) return;
      await processOne(item);
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  if (Date.now() >= deadline) truncated = true;

  return {
    domain,
    pages: pages.slice(0, MAX_PAGES),
    pagesSkipped,
    truncated,
  };
}
