import { nanoid } from 'nanoid';
import { formatGbp } from '@/lib/figure-check/compare';
import { currentTaxYear } from '@/lib/figure-check/compare';
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
  };
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
    .filter((f) => !f.historicContext)
    .map(adaptFinding);

  const behindCount = findings.filter((f) => f.verdict === 'behind').length;

  const pagesWithFindings = new Set(
    findings.map((f) => f.pageUrl),
  );
  const pagesConfirmedClean = scan.pagesRead
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
