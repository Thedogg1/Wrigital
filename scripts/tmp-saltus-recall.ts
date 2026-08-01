import { analyseHtml } from '../lib/figure-check/runScan';
import { crawlSite, normaliseInputUrl } from '../lib/figure-check/crawl';

process.env.FIGURE_CHECK_INSECURE_TLS = '1';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function main() {
  const start = normaliseInputUrl('https://www.saltus.co.uk');
  const crawl = await crawlSite(start, {
    deadlineMs: Date.now() + 40000,
  });

  const allFindings: Array<{
    url: string;
    n: number;
    fig: string;
    cls: string;
    kw: string;
    loc: string;
  }> = [];
  const nearMisses: Array<{ url: string; n: number; reason: string; sent: string }> =
    [];

  for (const page of crawl.pages) {
    const { findings, rejected } = analyseHtml(
      page.html,
      page.finalUrl,
      page.title,
    );
    for (const f of findings) {
      allFindings.push({
        url: page.finalUrl,
        n: f.numberFound,
        fig: f.figureId,
        cls: f.classification,
        kw: f.matchedKeyword,
        loc: f.matchLocation,
      });
    }
    for (const r of rejected) {
      // Likely statutory amounts we care about
      const interesting = [
        12570, 3000, 6000, 12300, 500, 1000, 2000, 20000, 60000, 40000, 325000,
        250, 3000,
      ].includes(r.numberFound);
      if (
        interesting ||
        /allowance|nil rate|isa|cgt|dividend|pension|threshold|exempt/i.test(
          r.sentence,
        )
      ) {
        nearMisses.push({
          url: page.finalUrl,
          n: r.numberFound,
          reason: r.reason,
          sent: r.sentence.slice(0, 140),
        });
      }
    }
  }

  console.log('pages', crawl.pages.length, 'findings', allFindings.length);
  console.log('FINDINGS');
  for (const f of allFindings) {
    console.log(JSON.stringify(f));
  }
  console.log('NEAR MISSES', nearMisses.length);
  const byReason = new Map<string, number>();
  for (const m of nearMisses) {
    byReason.set(m.reason, (byReason.get(m.reason) ?? 0) + 1);
  }
  console.log('by reason', Object.fromEntries(byReason));
  for (const m of nearMisses.slice(0, 40)) {
    console.log(JSON.stringify(m));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
