import { randomUUID } from 'node:crypto';
import {
  countFindings,
  detectionsToFindings,
  hasHistoricContext,
} from './compare';
import { crawlSite, normaliseInputUrl, SCAN_HARD_CAP_MS } from './crawl';
import { extractFiguresFromHtml, logRejected } from './extract';
import { getUnverifiedFigureIds } from './figures';
import { getFigureById } from './figures';
import type {
  Finding,
  PageRead,
  RejectedDetection,
  ScanResult,
} from './types';

/**
 * Mark prior-value hits as historic when the same sentence also states
 * the figure's current value (trajectory / update copy).
 */
function applyTrajectoryHistoric(findings: Finding[]): Finding[] {
  return findings.map((f) => {
    if (f.historicContext) return f;
    if (f.classification !== 'STALE' && f.classification !== 'CHECK') return f;
    const figure = getFigureById(f.figureId);
    if (!figure) return f;
    const siblings = findings.filter(
      (o) =>
        o.figureId === f.figureId &&
        o.sentence === f.sentence &&
        o.classification === 'CURRENT',
    );
    if (siblings.length > 0) {
      return { ...f, historicContext: true };
    }
    if (hasHistoricContext(f.sentence)) {
      return { ...f, historicContext: true };
    }
    return f;
  });
}

export function analyseHtml(
  html: string,
  pageUrl: string,
  pageTitle: string,
): { findings: Finding[]; rejected: RejectedDetection[] } {
  const { detections, rejected: extractRejected } = extractFiguresFromHtml(
    html,
    pageUrl,
  );
  const { findings, rejected: classifyRejected } = detectionsToFindings(
    detections,
    pageUrl,
    pageTitle,
  );
  return {
    findings: applyTrajectoryHistoric(findings),
    rejected: [...extractRejected, ...classifyRejected],
  };
}

export async function runScan(
  rawUrl: string,
  options?: {
    onProgress?: (p: { pagesScanned: number; status: string }) => void;
  },
): Promise<ScanResult> {
  const unverified = getUnverifiedFigureIds();
  if (unverified.length > 0) {
    const err = new Error('UNVERIFIED_FIGURES') as Error & {
      unverifiedIds: string[];
    };
    err.unverifiedIds = unverified;
    throw err;
  }

  const startUrl = normaliseInputUrl(rawUrl);
  const started = Date.now();
  const deadline = started + SCAN_HARD_CAP_MS;

  const crawl = await crawlSite(startUrl, {
    deadlineMs: deadline,
    onProgress: options?.onProgress,
  });

  const allFindings: Finding[] = [];
  const allRejected: RejectedDetection[] = [];
  const pagesRead: PageRead[] = [];

  for (const page of crawl.pages) {
    if (Date.now() >= deadline) {
      crawl.truncated = true;
      break;
    }
    const { findings, rejected } = analyseHtml(
      page.html,
      page.finalUrl,
      page.title,
    );
    allFindings.push(...findings);
    allRejected.push(...rejected);
    pagesRead.push({
      url: page.finalUrl,
      title: page.title,
      figuresFound: findings.length,
    });
  }

  logRejected(allRejected);

  const findings = applyTrajectoryHistoric(allFindings);
  const counts = countFindings(findings);

  return {
    scanId: randomUUID(),
    domain: crawl.domain,
    pagesScanned: pagesRead.length,
    pagesSkipped: crawl.pagesSkipped,
    truncated: crawl.truncated || Date.now() >= deadline,
    counts,
    findings,
    pagesRead,
    rejected: allRejected,
    scannedAt: new Date().toISOString(),
  };
}
