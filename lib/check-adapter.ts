import { nanoid } from 'nanoid';
import { formatGbp } from '@/lib/figure-check/compare';
import { currentTaxYear } from '@/lib/figure-check/compare';
import { pageKindFromUrl } from '@/lib/figure-check/page-kind';
import type { Finding as ScanFinding, ScanResult } from '@/lib/figure-check/types';
import type { CheckResult, Finding, Verdict } from '@/lib/check-types';

function sourceHost(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return host;
  } catch {
    return url;
  }
}

function toVerdict(f: ScanFinding): Verdict {
  if (f.historicContext) return 'current';
  if (f.classification === 'CURRENT') return 'current';
  if (f.classification === 'STALE') return 'behind';
  return 'unconfirmed';
}

/** Behind first (core before blog), then unconfirmed, then confirmed. */
function findingSortKey(f: Finding): number {
  if (f.verdict === 'behind' && f.pageKind === 'core') return 0;
  if (f.verdict === 'behind' && f.pageKind === 'blog') return 1;
  if (f.verdict === 'unconfirmed') return 2;
  return 3;
}

function adaptFinding(f: ScanFinding, index: number): Finding {
  const verdict = toVerdict(f);
  return {
    id: `${f.figureId}-${index}`,
    label: f.figureLabel,
    quotedValue: formatGbp(f.numberFound),
    publishedValue: formatGbp(f.currentValue),
    taxYear: f.staleTaxYear ?? currentTaxYear(),
    pageUrl: f.pageUrl,
    pageTitle: f.pageTitle,
    sourceUrl: f.sourceUrl,
    sourceHost: sourceHost(f.sourceUrl),
    verdict,
    pageKind: pageKindFromUrl(f.pageUrl),
  };
}

/**
 * Blog/insight posts are full of worked examples and scenario amounts.
 * Unconfirmed matches there are usually not claims of the published figure, so
 * they are suppressed. Behind (known prior statutory values) are kept — those
 * are genuine outdated quotes even on blogs.
 */
function isReportableFinding(f: Finding): boolean {
  if (f.pageKind === 'blog' && f.verdict === 'unconfirmed') return false;
  return true;
}

/**
 * Adapts the existing ScanResult shape to the funnel CheckResult contract.
 * Does not change the working checker.
 */
export function adaptScanResult(
  scan: ScanResult,
  checkId = nanoid(12),
): CheckResult {
  const findings = scan.findings
    // Drop intentional historic STALE/CHECK (trajectory copy). Always keep
    // CURRENT — "was" in nearby narrative must not hide a correct figure.
    .filter((f) => f.classification === 'CURRENT' || !f.historicContext)
    .map(adaptFinding)
    .filter(isReportableFinding)
    .sort(
      (a, b) =>
        findingSortKey(a) - findingSortKey(b) ||
        a.label.localeCompare(b.label),
    );

  const behindCount = findings.filter((f) => f.verdict === 'behind').length;

  const pagesWithFindings = new Set(findings.map((f) => f.pageUrl));
  // Do not list blog URLs as "confirmed clean" — we ignore scenario noise there,
  // which is not the same as verifying the page.
  const pagesConfirmedClean = scan.pagesRead
    .filter((p) => pageKindFromUrl(p.url) === 'core')
    .filter((p) => !pagesWithFindings.has(p.url))
    .map((p) => ({ url: p.url, title: p.title }));

  return {
    checkId,
    domain: scan.domain,
    startedAt: scan.scannedAt,
    finishedAt: scan.scannedAt,
    pagesScanned: scan.pagesScanned,
    pagesConfirmedClean,
    figuresFound: findings.length,
    behindCount,
    findings,
  };
}
