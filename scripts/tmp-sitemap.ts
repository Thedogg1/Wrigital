process.env.FIGURE_CHECK_INSECURE_TLS = '1';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { urlContentScore } from '../lib/figure-check/crawl';

async function main() {
  const res = await fetch('https://www.saltus.co.uk/sitemap.xml', {
    headers: { 'User-Agent': 'WrigitalFigureCheck/1.0' },
  });
  const body = await res.text();
  console.log('status', res.status, 'len', body.length);
  console.log(body.slice(0, 500));
  console.log('---');
  console.log('has index', body.includes('sitemapindex'), 'has urlset', body.includes('urlset'));
  const locs = [...body.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map((m) => m[1]!.trim());
  console.log('locs', locs.length);
  console.log(locs.slice(0, 15));
  const scored = locs
    .map((u) => ({ u, s: urlContentScore(u) }))
    .sort((a, b) => b.s - a.s);
  console.log('top', scored.slice(0, 20));
  console.log(
    'tax page rank',
    scored.findIndex((x) => x.u.includes('/financial-planning/tax')),
  );
}

main();
