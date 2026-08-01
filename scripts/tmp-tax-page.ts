import { analyseHtml } from '../lib/figure-check/runScan';

process.env.FIGURE_CHECK_INSECURE_TLS = '1';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function main() {
  const url = 'https://www.saltus.co.uk/financial-planning/tax';
  const res = await fetch(url, {
    headers: { 'User-Agent': 'WrigitalFigureCheck/1.0' },
  });
  const html = await res.text();
  const { findings, rejected } = analyseHtml(html, url, 'tax');
  console.log('findings', findings.length);
  for (const f of findings) {
    console.log(f.numberFound, f.figureId, f.classification, f.matchedKeyword, f.sentence.slice(0, 100));
  }
  const interesting = rejected.filter((r) =>
    [12570, 20000, 3000, 500, 60000, 325000, 1000].includes(r.numberFound),
  );
  console.log('interesting rejects', interesting.length);
  for (const r of interesting.slice(0, 20)) {
    console.log(r.numberFound, r.reason, r.sentence.slice(0, 100));
  }
}

main();
