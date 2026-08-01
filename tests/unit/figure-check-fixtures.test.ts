import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { analyseHtml } from '@/lib/figure-check/runScan';

type ExpectedFinding = {
  figureId: string;
  classification: string;
  matchedKeyword: string;
  historicContext: boolean;
  numberFound: number;
};

const fixturesDir = path.resolve(
  process.cwd(),
  'lib/figure-check/__fixtures__/pages',
);

function loadFixtures(): {
  name: string;
  html: string;
  expected: ExpectedFinding[];
}[] {
  const files = readdirSync(fixturesDir).filter((f) => f.endsWith('.html'));
  return files.map((file) => {
    const name = file.replace(/\.html$/, '');
    const html = readFileSync(path.join(fixturesDir, file), 'utf8');
    const expectedPath = path.join(fixturesDir, `${name}.expected.json`);
    const expected = JSON.parse(
      readFileSync(expectedPath, 'utf8'),
    ) as ExpectedFinding[];
    return { name, html, expected };
  });
}

function summarise(findings: ReturnType<typeof analyseHtml>['findings']) {
  return findings
    .map((f) => ({
      figureId: f.figureId,
      classification: f.classification,
      matchedKeyword: f.matchedKeyword,
      historicContext: f.historicContext,
      numberFound: f.numberFound,
    }))
    .sort(
      (a, b) =>
        a.figureId.localeCompare(b.figureId) ||
        a.numberFound - b.numberFound ||
        a.classification.localeCompare(b.classification),
    );
}

describe('figure-check fixtures', () => {
  const fixtures = loadFixtures();

  it('has fixture coverage', () => {
    expect(fixtures.length).toBeGreaterThanOrEqual(12);
  });

  for (const fixture of fixtures) {
    it(`matches expected findings for ${fixture.name}`, () => {
      const pageUrl = `https://fixture.test/${fixture.name}`;
      const { findings } = analyseHtml(
        fixture.html,
        pageUrl,
        titleOf(fixture.html),
      );

      const actual = summarise(findings);
      const expected = [...fixture.expected].sort(
        (a, b) =>
          a.figureId.localeCompare(b.figureId) ||
          a.numberFound - b.numberFound ||
          a.classification.localeCompare(b.classification),
      );

      if (fixture.name.startsWith('misattr-') && actual.length > 0) {
        throw new Error(
          `Misattribution fixture ${fixture.name} produced findings: ${JSON.stringify(actual)}`,
        );
      }

      expect(actual).toEqual(expected);
    });
  }
});

function titleOf(html: string): string {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  return m?.[1]?.trim() ?? '';
}
