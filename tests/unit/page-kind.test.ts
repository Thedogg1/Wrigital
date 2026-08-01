import { describe, expect, it } from 'vitest';
import { isBlogArticleUrl, pageKindFromUrl } from '@/lib/figure-check/page-kind';
import { adaptScanResult } from '@/lib/check-adapter';
import type { ScanResult } from '@/lib/figure-check/types';

describe('isBlogArticleUrl', () => {
  it('detects common blog paths', () => {
    expect(
      isBlogArticleUrl('https://www.saltus.co.uk/the-financial-planning-blog/cgt'),
    ).toBe(true);
    expect(isBlogArticleUrl('https://example.com/blog/tax-year')).toBe(true);
    expect(isBlogArticleUrl('https://example.com/insights/isa')).toBe(true);
    expect(isBlogArticleUrl('https://example.com/guide/how-to-pensions')).toBe(
      true,
    );
  });

  it('treats hubs and service pages as core', () => {
    expect(isBlogArticleUrl('https://example.com/financial-planning/tax')).toBe(
      false,
    );
    expect(isBlogArticleUrl('https://example.com/guide')).toBe(false);
    expect(isBlogArticleUrl('https://example.com/')).toBe(false);
  });

  it('treats long root slugs as articles', () => {
    expect(
      isBlogArticleUrl(
        'https://shackletonadvisers.co.uk/4-reasons-you-may-want-to-boost-your-isa-before-the-tax-year-ends/',
      ),
    ).toBe(true);
  });
});

describe('adaptScanResult blog scenario suppression', () => {
  it('drops unconfirmed from blogs; keeps blog behind and current', () => {
    const scan = {
      scanId: 't',
      domain: 'example.com',
      pagesScanned: 3,
      pagesSkipped: [],
      truncated: false,
      counts: { figuresFound: 4, current: 1, stale: 2, check: 1 },
      findings: [
        {
          pageUrl: 'https://example.com/blog/old-cgt',
          pageTitle: 'Old CGT',
          sentence: 'CGT is £6,000',
          numberFound: 6000,
          figureId: 'cgt-annual-exempt-amount',
          figureLabel: 'CGT',
          currentValue: 3000,
          matchedKeyword: 'cgt',
          matchLocation: 'sentence' as const,
          classification: 'STALE' as const,
          historicContext: false,
          sourceUrl: 'https://gov.uk',
          sourceLabel: 'GOV.UK',
        },
        {
          pageUrl: 'https://example.com/tax',
          pageTitle: 'Tax',
          sentence: 'CGT is £6,000',
          numberFound: 6000,
          figureId: 'cgt-annual-exempt-amount',
          figureLabel: 'CGT',
          currentValue: 3000,
          matchedKeyword: 'cgt',
          matchLocation: 'sentence' as const,
          classification: 'STALE' as const,
          historicContext: false,
          sourceUrl: 'https://gov.uk',
          sourceLabel: 'GOV.UK',
        },
        {
          pageUrl: 'https://example.com/blog/scenario',
          pageTitle: 'Scenario',
          sentence: 'allowance £999',
          numberFound: 999,
          figureId: 'personal-allowance',
          figureLabel: 'Personal allowance',
          currentValue: 12570,
          matchedKeyword: 'personal allowance',
          matchLocation: 'sentence' as const,
          classification: 'CHECK' as const,
          historicContext: false,
          sourceUrl: 'https://gov.uk',
          sourceLabel: 'GOV.UK',
        },
        {
          pageUrl: 'https://example.com/blog/isa-ok',
          pageTitle: 'ISA blog',
          sentence: 'ISA £20,000',
          numberFound: 20000,
          figureId: 'isa-annual-subscription',
          figureLabel: 'ISA',
          currentValue: 20000,
          matchedKeyword: 'isa',
          matchLocation: 'sentence' as const,
          classification: 'CURRENT' as const,
          historicContext: false,
          sourceUrl: 'https://gov.uk',
          sourceLabel: 'GOV.UK',
        },
        {
          pageUrl: 'https://example.com/isa',
          pageTitle: 'ISA',
          sentence: 'ISA £20,000',
          numberFound: 20000,
          figureId: 'isa-annual-subscription',
          figureLabel: 'ISA',
          currentValue: 20000,
          matchedKeyword: 'isa',
          matchLocation: 'sentence' as const,
          classification: 'CURRENT' as const,
          historicContext: false,
          sourceUrl: 'https://gov.uk',
          sourceLabel: 'GOV.UK',
        },
      ],
      pagesRead: [
        { url: 'https://example.com/tax', title: 'Tax', figuresFound: 1 },
        { url: 'https://example.com/blog/scenario', title: 'Scenario', figuresFound: 1 },
        { url: 'https://example.com/about', title: 'About', figuresFound: 0 },
      ],
      rejected: [],
      scannedAt: new Date().toISOString(),
    } satisfies ScanResult;

    const result = adaptScanResult(scan, 'test-id');
    expect(result.findings.map((f) => [f.pageKind, f.verdict, f.pageUrl])).toEqual([
      ['core', 'behind', 'https://example.com/tax'],
      ['blog', 'behind', 'https://example.com/blog/old-cgt'],
      ['blog', 'current', 'https://example.com/blog/isa-ok'],
      ['core', 'current', 'https://example.com/isa'],
    ]);
    expect(result.pagesConfirmedClean.map((p) => p.url)).toEqual([
      'https://example.com/about',
    ]);
    expect(pageKindFromUrl('https://example.com/blog/x')).toBe('blog');
  });
});
