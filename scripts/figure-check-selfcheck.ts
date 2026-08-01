#!/usr/bin/env npx tsx
/**
 * Runs five live reviews and writes a JSON summary for the self-check report.
 */
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { runScan } from '../lib/figure-check/runScan';
import type { Finding, ScanResult } from '../lib/figure-check/types';

const SITES = [
  'https://www.beckettinvest.com',
  'https://paretofp.co.uk',
  'https://suttonsifa.co.uk',
  'https://www.eqinvestors.co.uk',
  'https://www.fidelius.co.uk',
];

function summarise(scan: ScanResult) {
  const stale = scan.findings.filter((f) => f.classification === 'STALE');
  return {
    domain: scan.domain,
    pagesScanned: scan.pagesScanned,
    truncated: scan.truncated,
    counts: scan.counts,
    pagesSkipped: scan.pagesSkipped.length,
    staleFindings: stale.map((f: Finding) => ({
      sentence: f.sentence,
      numberFound: f.numberFound,
      figureLabel: f.figureLabel,
      matchedKeyword: f.matchedKeyword,
      matchLocation: f.matchLocation,
      historicContext: f.historicContext,
      staleTaxYear: f.staleTaxYear,
      pageUrl: f.pageUrl,
    })),
    checkFindings: scan.findings
      .filter((f) => f.classification === 'CHECK')
      .map((f) => ({
        sentence: f.sentence,
        numberFound: f.numberFound,
        figureLabel: f.figureLabel,
        matchedKeyword: f.matchedKeyword,
        historicContext: f.historicContext,
        pageUrl: f.pageUrl,
      })),
  };
}

async function main() {
  const results = [];
  for (const url of SITES) {
    console.info(`\n=== ${url} ===`);
    try {
      const scan = await runScan(url);
      const summary = summarise(scan);
      console.info(
        `pages=${summary.pagesScanned} stale=${summary.counts.stale} check=${summary.counts.check} current=${summary.counts.current} truncated=${summary.truncated}`,
      );
      results.push({ url, ok: true, summary });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.error(`FAILED: ${message}`);
      results.push({ url, ok: false, error: message });
    }
  }

  const out = path.resolve(process.cwd(), 'figure-check-selfcheck.json');
  writeFileSync(out, JSON.stringify(results, null, 2), 'utf8');
  console.info(`\nWrote ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
