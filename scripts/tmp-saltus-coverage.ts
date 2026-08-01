import { crawlSite, normaliseInputUrl } from '../lib/figure-check/crawl';

process.env.FIGURE_CHECK_INSECURE_TLS = '1';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const TERMS = [
  'personal allowance',
  'dividend allowance',
  'cgt allowance',
  'capital gains',
  'isa allowance',
  'isa limit',
  'nil rate',
  'nil-rate',
  'annual allowance',
  '£12,570',
  '£12.570',
  '£20,000',
  '£3,000',
  '£325,000',
  '£60,000',
];

async function main() {
  const start = normaliseInputUrl('https://www.saltus.co.uk');
  const crawl = await crawlSite(start, { deadlineMs: Date.now() + 40000 });

  console.log('crawled', crawl.pages.length, 'skipped', crawl.pagesSkipped.length);
  for (const page of crawl.pages) {
    const lower = page.html.toLowerCase();
    const hits = TERMS.filter((t) => lower.includes(t.toLowerCase()));
    if (hits.length) {
      console.log(page.finalUrl);
      console.log('  ', hits.join(', '));
    }
  }

  // Probe known guide URLs that may be deep/unlinked
  const probes = [
    'https://www.saltus.co.uk/the-financial-planning-blog',
    'https://www.saltus.co.uk/guide',
    'https://www.saltus.co.uk/guides',
    'https://www.saltus.co.uk/financial-planning/tax',
    'https://www.saltus.co.uk/the-financial-planning-blog/capital-gains-tax',
    'https://www.saltus.co.uk/the-financial-planning-blog/inheritance-tax',
    'https://www.saltus.co.uk/the-financial-planning-blog/isas',
  ];
  for (const url of probes) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'WrigitalFigureCheck/1.0' },
        redirect: 'follow',
      });
      const html = await res.text();
      const lower = html.toLowerCase();
      const hits = TERMS.filter((t) => lower.includes(t.toLowerCase()));
      console.log('PROBE', res.status, url, hits.slice(0, 8).join(', ') || '(none)');
    } catch (e) {
      console.log('PROBE ERR', url, e);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
