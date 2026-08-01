#!/usr/bin/env npx tsx
/**
 * Live review script: npm run figure-check:review -- <url>
 * Writes ./figure-check-review.html
 */
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import {
  boldNumberInSentence,
  escapeHtml,
  formatGbp,
} from '../lib/figure-check/compare';
import { runScan } from '../lib/figure-check/runScan';
import type { Finding } from '../lib/figure-check/types';

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error('Usage: npm run figure-check:review -- <url>');
    process.exit(1);
  }

  console.info(`Scanning ${url}…`);
  const scan = await runScan(url);
  console.info(
    `Done. pages=${scan.pagesScanned} findings=${scan.counts.figuresFound} truncated=${scan.truncated}`,
  );

  const actionable = scan.findings
    .filter((f) => f.classification === 'STALE' || f.classification === 'CHECK')
    .sort((a, b) => {
      if (a.classification !== b.classification) {
        return a.classification === 'STALE' ? -1 : 1;
      }
      return 0;
    });

  const rejectedRows = scan.rejected
    .map(
      (r) => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #ddd;vertical-align:top;">${escapeHtml(String(r.numberFound))}</td>
      <td style="padding:8px;border-bottom:1px solid #ddd;vertical-align:top;">${escapeHtml(r.reason)}</td>
      <td style="padding:8px;border-bottom:1px solid #ddd;vertical-align:top;word-break:break-word;">${escapeHtml(r.sentence)}</td>
      <td style="padding:8px;border-bottom:1px solid #ddd;vertical-align:top;word-break:break-all;"><a href="${escapeHtml(r.pageUrl)}">${escapeHtml(r.pageUrl)}</a></td>
    </tr>`,
    )
    .join('');

  const findingBlocks = actionable.map((f, i) => findingBlock(f, i + 1)).join('');

  const html = `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="utf-8"/>
  <title>Figure check review — ${escapeHtml(scan.domain)}</title>
  <style>
    body { font-family: Georgia, serif; margin: 24px; color: #1a1a1a; background: #fff; max-width: 960px; }
    h1, h2 { color: #0a2342; font-weight: normal; }
    .meta { font-family: system-ui, sans-serif; color: #475569; font-size: 14px; }
    .summary { border: 1px solid #ccc; padding: 16px; margin: 16px 0; }
    .finding { border: 1px solid #333; padding: 16px; margin: 20px 0; page-break-inside: avoid; }
    .checks label { display: inline-block; margin-right: 16px; font-family: system-ui, sans-serif; font-size: 14px; }
    .snippet { font-family: ui-monospace, monospace; font-size: 12px; background: #f5f5f5; padding: 10px; overflow: auto; white-space: pre-wrap; word-break: break-word; }
    table { border-collapse: collapse; width: 100%; font-family: system-ui, sans-serif; font-size: 13px; }
    mark { background: #ffe08a; padding: 0 2px; }
    @media print { a[href]::after { content: " (" attr(href) ")"; font-size: 11px; } }
  </style>
</head>
<body>
  <h1>Stale Figure Check — live review</h1>
  <p class="meta">Domain: <strong>${escapeHtml(scan.domain)}</strong> · Scanned: ${escapeHtml(scan.scannedAt)}${scan.truncated ? ' · <strong>truncated</strong>' : ''}</p>

  <div class="summary">
    <h2>Summary</h2>
    <p class="meta">Pages scanned: <strong>${scan.pagesScanned}</strong></p>
    <p class="meta">
      Counts — stale: <strong>${scan.counts.stale}</strong>,
      check: <strong>${scan.counts.check}</strong>,
      current: <strong>${scan.counts.current}</strong>,
      total: <strong>${scan.counts.figuresFound}</strong>
    </p>
    <p class="meta">Pages skipped: ${scan.pagesSkipped.length}</p>
    <h3>Rejected detections</h3>
    ${
      scan.rejected.length === 0
        ? '<p class="meta">None.</p>'
        : `<table>
      <thead><tr><th align="left">Number</th><th align="left">Reason</th><th align="left">Sentence</th><th align="left">Page</th></tr></thead>
      <tbody>${rejectedRows}</tbody>
    </table>`
    }
  </div>

  <h2>STALE and CHECK findings (${actionable.length})</h2>
  ${findingBlocks || '<p class="meta">No STALE or CHECK findings.</p>'}
</body>
</html>`;

  const out = path.resolve(process.cwd(), 'figure-check-review.html');
  writeFileSync(out, html, 'utf8');
  console.info(`Wrote ${out}`);
}

function findingBlock(f: Finding, index: number): string {
  const sentenceHtml = boldNumberInSentence(f.sentence, f.numberFound).replace(
    /<strong>/g,
    '<mark>',
  ).replace(/<\/strong>/g, '</mark>');

  return `
  <section class="finding">
    <h3>${index}. ${escapeHtml(f.figureLabel)} — found ${escapeHtml(formatGbp(f.numberFound))} (${escapeHtml(f.classification)}${f.historicContext ? ', historicContext' : ''})</h3>
    <p>${sentenceHtml}</p>
    <p class="meta">Page: <a href="${escapeHtml(f.pageUrl)}">${escapeHtml(f.pageUrl)}</a></p>
    <p class="meta">Keyword: “${escapeHtml(f.matchedKeyword)}” matched in <strong>${escapeHtml(f.matchLocation)}</strong></p>
    <p class="meta">Current value: ${escapeHtml(formatGbp(f.currentValue))} · Source: <a href="${escapeHtml(f.sourceUrl)}">${escapeHtml(f.sourceLabel)}</a></p>
    <p class="meta">Surrounding HTML:</p>
    <div class="snippet">${escapeHtml(f.surroundingHtml || '(none)')}</div>
    <p class="checks">
      <label><input type="checkbox"/> CORRECT</label>
      <label><input type="checkbox"/> IS HISTORY</label>
      <label><input type="checkbox"/> WRONG ATTRIBUTION</label>
    </p>
  </section>`;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
