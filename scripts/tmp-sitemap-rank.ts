import { urlContentScore } from '../lib/figure-check/crawl';

process.env.FIGURE_CHECK_INSECURE_TLS = '1';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function fetchText(url: string) {
  const r = await fetch(url, {
    headers: { 'User-Agent': 'WrigitalFigureCheck/1.0' },
  });
  return r.text();
}

async function main() {
  const index = await fetchText('https://www.saltus.co.uk/sitemap.xml');
  const locs = [...index.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map((m) =>
    m[1]!.trim(),
  );
  console.log('index locs', locs.length);
  for (const l of locs) console.log(' ', l);

  const pages: string[] = [];
  for (const sm of locs) {
    if (!/sitemap/i.test(sm)) continue;
    const body = await fetchText(sm);
    const child = [...body.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map((m) =>
      m[1]!.trim(),
    );
    const pageLocs = child.filter((u) => !u.toLowerCase().endsWith('.xml'));
    console.log(sm, '→', pageLocs.length, 'pages');
    pages.push(...pageLocs);
  }

  const scored = pages
    .map((u) => ({ u, s: urlContentScore(u) }))
    .sort((a, b) => b.s - a.s || a.u.localeCompare(b.u));

  console.log('total pages', pages.length);
  console.log('top 50:');
  for (const x of scored.slice(0, 50)) console.log(x.s, x.u);

  const idx = scored.findIndex((x) =>
    x.u.replace(/\/$/, '').endsWith('/financial-planning/tax'),
  );
  console.log('financial-planning/tax rank', idx, scored[idx]);
  console.log(
    'tax-ish',
    scored.filter((x) => /\/tax(\/|$)/i.test(x.u)).slice(0, 20),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
