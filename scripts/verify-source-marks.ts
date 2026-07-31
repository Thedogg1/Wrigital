/**
 * Verifies the four Page 1 source-mark URLs return HTTP 200.
 * Run: npx tsx scripts/verify-source-marks.ts
 */
const SOURCES = [
  {
    n: 1,
    claim: 'CGT annual exempt amount £12,300 in 2022/23',
    url: 'https://www.gov.uk/capital-gains-tax/allowances',
  },
  {
    n: 2,
    claim: 'cut to £6,000, then to £3,000',
    url: 'https://www.gov.uk/government/publications/reducing-the-annual-exempt-amount-for-capital-gains-tax',
  },
  {
    n: 3,
    claim: 'dividend allowance £2,000 to £1,000 to £500',
    url: 'https://www.gov.uk/tax-on-dividends',
  },
  {
    n: 4,
    claim: 'pension annual allowance £40,000 to £60,000',
    url: 'https://www.gov.uk/tax-on-your-private-pension/annual-allowance',
  },
] as const;

async function main() {
  let failed = 0;
  for (const source of SOURCES) {
    try {
      const res = await fetch(source.url, {
        method: 'GET',
        redirect: 'follow',
        headers: { 'User-Agent': 'WrigitalSourceMarkVerify/1.0' },
      });
      const ok = res.status === 200;
      console.log(
        `${ok ? 'OK' : 'FAIL'} [${source.n}] ${res.status} ${source.url}`,
      );
      if (!ok) failed += 1;
    } catch (e) {
      failed += 1;
      console.log(`FAIL [${source.n}] ${source.url} (${String(e)})`);
    }
  }
  if (failed > 0) {
    console.error(`${failed} source mark URL(s) failed`);
    process.exit(1);
  }
  console.log('All source mark URLs returned 200');
}

main();
