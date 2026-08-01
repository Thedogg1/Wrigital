import { getFigureById } from './figures';
import type {
  Classification,
  DetectedNumber,
  Finding,
  RejectedDetection,
} from './types';

/** UK tax year string for "today" (tax year starts 6 April). */
export function currentTaxYear(now = new Date()): string {
  const y = now.getUTCFullYear();
  const month = now.getUTCMonth(); // 0-based
  const day = now.getUTCDate();
  // Before 6 April → previous/current tax year started last calendar year
  if (month < 3 || (month === 3 && day < 6)) {
    const start = y - 1;
    return `${start}/${String(y).slice(2)}`;
  }
  return `${y}/${String(y + 1).slice(2)}`;
}

const TAX_YEAR_RE = /\b(20\d{2})\s*\/\s*(\d{2})\b/g;
const IN_YEAR_RE = /\bin\s+(20\d{2})\b/i;

export function hasHistoricContext(sentence: string, now = new Date()): boolean {
  const s = sentence.toLowerCase();
  // Avoid bare "was" — it appears constantly in narrative ("what was announced").
  // Require value/figure framing so trajectory copy still counts as historic.
  if (
    /\bwas\s+(£|\$|[\d,]|the\s+(personal|annual|isa|cgt|dividend|nil[-\s]?rate|capital\s+gains)|set\s+at|fixed\s+at|frozen|only)\b/.test(
      s,
    )
  ) {
    return true;
  }
  if (/until\s+april/.test(s)) return true;
  if (/\bpreviously\b/.test(s)) return true;
  if (IN_YEAR_RE.test(sentence)) return true;

  const current = currentTaxYear(now);
  TAX_YEAR_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = TAX_YEAR_RE.exec(sentence))) {
    const ty = `${m[1]}/${m[2]}`;
    if (ty !== current) return true;
  }
  return false;
}

function nearlyEqual(a: number, b: number): boolean {
  return Math.abs(a - b) < 0.001;
}

export function classifyDetection(detection: DetectedNumber): {
  classification: Classification;
  staleTaxYear?: string;
} | null {
  if (!detection.figureId) return null;
  const figure = getFigureById(detection.figureId);
  if (!figure) return null;

  if (nearlyEqual(detection.value, figure.currentValue)) {
    return { classification: 'CURRENT' };
  }

  for (const prior of figure.priorValues) {
    if (nearlyEqual(detection.value, prior.value)) {
      return { classification: 'STALE', staleTaxYear: prior.taxYear };
    }
  }

  return { classification: 'CHECK' };
}

export function detectionsToFindings(
  detections: DetectedNumber[],
  pageUrl: string,
  pageTitle: string,
): { findings: Finding[]; rejected: RejectedDetection[] } {
  const findings: Finding[] = [];
  const rejected: RejectedDetection[] = [];

  for (const d of detections) {
    if (!d.figureId || !d.matchedKeyword) {
      rejected.push({
        pageUrl,
        numberFound: d.value,
        sentence: d.sentence,
        reason: 'Detection missing figure association',
      });
      continue;
    }

    const figure = getFigureById(d.figureId);
    if (!figure) {
      rejected.push({
        pageUrl,
        numberFound: d.value,
        sentence: d.sentence,
        reason: 'Unknown figure id',
      });
      continue;
    }

    const classified = classifyDetection(d);
    if (!classified) {
      rejected.push({
        pageUrl,
        numberFound: d.value,
        sentence: d.sentence,
        reason: 'Could not classify detection',
      });
      continue;
    }

    const historic = hasHistoricContext(d.associationSentence || d.sentence);

    findings.push({
      pageUrl,
      pageTitle,
      sentence: d.sentence,
      numberFound: d.value,
      figureId: figure.id,
      figureLabel: figure.label,
      currentValue: figure.currentValue,
      matchedKeyword: d.matchedKeyword,
      matchLocation: d.matchLocation,
      classification: classified.classification,
      staleTaxYear: classified.staleTaxYear,
      historicContext: historic,
      sourceUrl: figure.sourceUrl,
      sourceLabel: figure.sourceLabel,
      surroundingHtml: d.surroundingHtml,
    });
  }

  return { findings, rejected };
}

/** Actionable STALE then CHECK (excludes likely-intentional historic). */
export function actionableFindings(findings: Finding[]): Finding[] {
  const stale = findings.filter(
    (f) => f.classification === 'STALE' && !f.historicContext,
  );
  const check = findings.filter(
    (f) => f.classification === 'CHECK' && !f.historicContext,
  );
  return [...stale, ...check];
}

/** Likely-intentional historic STALE/CHECK mentions. */
export function historicFindings(findings: Finding[]): Finding[] {
  return findings.filter(
    (f) =>
      f.historicContext &&
      (f.classification === 'STALE' || f.classification === 'CHECK'),
  );
}

export function countFindings(findings: Finding[]): {
  figuresFound: number;
  current: number;
  stale: number;
  check: number;
} {
  return {
    figuresFound: findings.length,
    current: findings.filter((f) => f.classification === 'CURRENT').length,
    stale: findings.filter((f) => f.classification === 'STALE').length,
    check: findings.filter((f) => f.classification === 'CHECK').length,
  };
}

export function formatGbp(value: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function boldNumberInSentence(sentence: string, numberFound: number): string {
  const formatted = formatGbp(numberFound);
  // Try several representations
  const candidates = [
    formatted,
    `£${numberFound.toLocaleString('en-GB')}`,
    `£${numberFound}`,
    String(numberFound),
  ];
  for (const c of candidates) {
    const idx = sentence.indexOf(c);
    if (idx >= 0) {
      return (
        escapeHtml(sentence.slice(0, idx)) +
        `<strong>${escapeHtml(c)}</strong>` +
        escapeHtml(sentence.slice(idx + c.length))
      );
    }
  }
  // Fallback: append
  return `${escapeHtml(sentence)} (<strong>${escapeHtml(formatted)}</strong>)`;
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
