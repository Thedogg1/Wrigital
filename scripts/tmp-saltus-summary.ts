import { analyseHtml } from '../lib/figure-check/runScan';
import { crawlSite, normaliseInputUrl } from '../lib/figure-check/crawl';
import { adaptScanResult } from '../lib/check-adapter';
import type { Finding } from '../lib/figure-check/types';

process.env.FIGURE_CHECK_INSECURE_TLS = '1';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function main() {
  const start = normaliseInputUrl('https://www.saltus.co.uk');
  const crawl = await crawlSite(start, { deadlineMs: Date.now() + 45000 });
  const findings: Finding[] = [];
  for (const page of crawl.pages) {
    const r = analyseHtml(page.html, page.finalUrl, page.title);
    findings.push(...r.findings);
  }

  const byCls: Record<string, number> = {};
  for (const f of findings) {
    byCls[f.classification] = (byCls[f.classification] ?? 0) + 1;
  }

  const adapted = adaptScanResult({
    domain: 'saltus.co.uk',
    scannedAt: new Date().toISOString(),
    pagesScanned: crawl.pages.length,
    pagesRead: crawl.pages.map((p) => ({ url: p.finalUrl, title: p.title })),
    findings,
    counts: {
      figuresFound: findings.length,
      stale: byCls.STALE ?? 0,
      check: byCls.CHECK ?? 0,
      current: byCls.CURRENT ?? 0,
    },
    pagesSkipped: crawl.pagesSkipped,
    truncated: crawl.truncated,
  } as never);

  const verdicts: Record<string, number> = {};
  for (const f of adapted.findings) {
    verdicts[f.verdict] = (verdicts[f.verdict] ?? 0) + 1;
  }

  console.log(
    JSON.stringify(
      {
        pages: crawl.pages.length,
        rawFindings: findings.length,
        byCls,
        adaptedFiguresFound: adapted.figuresFound,
        verdicts,
        hasTax: crawl.pages.some((p) =>
          p.finalUrl.includes('/financial-planning/tax'),
        ),
        contentish: crawl.pages.filter((p) =>
          /tax|allowance|cgt|isa|iht|pension|dividend|nil-rate/i.test(
            p.finalUrl,
          ),
        ).length,
        firstUrls: crawl.pages.slice(0, 15).map((p) => p.finalUrl),
        tiny: findings
          .filter((f) => f.numberFound < 100)
          .map((f) => ({
            n: f.numberFound,
            fig: f.figureId,
            cls: f.classification,
            url: f.pageUrl,
          })),
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
