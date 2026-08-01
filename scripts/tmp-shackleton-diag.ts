import { analyseHtml } from '../lib/figure-check/runScan';
import {
  crawlSite,
  normaliseInputUrl,
  urlContentScore,
} from '../lib/figure-check/crawl';
import { adaptScanResult } from '../lib/check-adapter';
import { pageKindFromUrl } from '../lib/figure-check/page-kind';
import type { Finding, ScanResult } from '../lib/figure-check/types';

process.env.FIGURE_CHECK_INSECURE_TLS = '1';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function main() {
  const start = normaliseInputUrl('https://shackletonadvisers.co.uk/');
  const crawl = await crawlSite(start, { deadlineMs: Date.now() + 50000 });

  const findings: Finding[] = [];
  const rejectedInteresting: Array<{ url: string; n: number; reason: string }> =
    [];

  for (const page of crawl.pages) {
    const r = analyseHtml(page.html, page.finalUrl, page.title);
    findings.push(...r.findings);
    for (const rej of r.rejected) {
      if (
        [12570, 3000, 6000, 12300, 500, 1000, 2000, 20000, 60000, 40000, 325000].includes(
          rej.numberFound,
        )
      ) {
        rejectedInteresting.push({
          url: page.finalUrl,
          n: rej.numberFound,
          reason: rej.reason,
        });
      }
    }
  }

  const scan = {
    scanId: 'diag',
    domain: 'shackletonadvisers.co.uk',
    pagesScanned: crawl.pages.length,
    pagesSkipped: crawl.pagesSkipped,
    truncated: crawl.truncated,
    counts: {
      figuresFound: findings.length,
      current: findings.filter((f) => f.classification === 'CURRENT').length,
      stale: findings.filter((f) => f.classification === 'STALE').length,
      check: findings.filter((f) => f.classification === 'CHECK').length,
    },
    findings,
    pagesRead: crawl.pages.map((p) => ({
      url: p.finalUrl,
      title: p.title,
      figuresFound: 0,
    })),
    rejected: [],
    scannedAt: new Date().toISOString(),
  } satisfies ScanResult;

  const adapted = adaptScanResult(scan);

  console.log(
    JSON.stringify(
      {
        pages: crawl.pages.length,
        truncated: crawl.truncated,
        rawFindings: findings.length,
        byCls: scan.counts,
        adapted: {
          figuresFound: adapted.figuresFound,
          behind: adapted.behindCount,
          verdicts: Object.fromEntries(
            ['behind', 'unconfirmed', 'current'].map((v) => [
              v,
              adapted.findings.filter((f) => f.verdict === v).length,
            ]),
          ),
        },
        pageKindsCrawled: {
          core: crawl.pages.filter((p) => pageKindFromUrl(p.finalUrl) === 'core')
            .length,
          blog: crawl.pages.filter((p) => pageKindFromUrl(p.finalUrl) === 'blog')
            .length,
        },
        urls: crawl.pages
          .map((p) => ({
            score: urlContentScore(p.finalUrl),
            kind: pageKindFromUrl(p.finalUrl),
            url: p.finalUrl,
          }))
          .sort((a, b) => b.score - a.score),
        rawFindingsDetail: findings.map((f) => ({
          cls: f.classification,
          n: f.numberFound,
          fig: f.figureId,
          kw: f.matchedKeyword,
          kind: pageKindFromUrl(f.pageUrl),
          url: f.pageUrl,
        })),
        adaptedFindings: adapted.findings.map((f) => ({
          verdict: f.verdict,
          label: f.label,
          quoted: f.quotedValue,
          kind: f.pageKind,
          url: f.pageUrl,
        })),
        rejectedInteresting: rejectedInteresting.slice(0, 30),
        skippedSample: crawl.pagesSkipped.slice(0, 15),
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
