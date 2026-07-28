import { describe, expect, it } from 'vitest';
import { buildUnverifiedReportHtml } from '@/lib/unverified-answers/buildReportHtml';
import {
  DISCLOSURE_HEADING,
  NOT_COUNTED_REASON_COPY,
  NO_HIRE_HEADING,
  PI_BOUNDARY_LINE,
  REPORT_OFFER_LINE,
  REPORT_QUESTIONS_HEADING,
  REPORT_SOURCES,
  REPORT_SOURCES_HEADING,
  calculateUnverifiedAnswers,
  isCountedResult,
  type CompleteUnverifiedAnswersInput,
} from '@/lib/unverifiedAnswers';

const sampleAnswers: CompleteUnverifiedAnswersInput = {
  people: 5,
  frequencyBand: '3_5',
  subjects: ['uk_tax', 'pensions'],
  regulatedShareBand: 'half',
  tools: ['copilot_tenant'],
  sourceAccess: 'no',
  linkCheck: 'never',
  clientTrace: 'no',
  policy: 'no',
  piDisclosure: 'no',
  piRenewalMonth: 'january',
};

/** Mid-February, so a January renewal is eleven months away and March is one. */
const FEBRUARY = new Date(Date.UTC(2026, 1, 15));

function render(
  answers: CompleteUnverifiedAnswersInput = sampleAnswers,
  generatedAt: Date = FEBRUARY,
  firmName?: string | null,
): string {
  return buildUnverifiedReportHtml({
    answers,
    result: calculateUnverifiedAnswers(answers),
    firmName,
    generatedAt,
  });
}

describe('buildUnverifiedReportHtml', () => {
  it('renders a counted result with working steps', () => {
    const result = calculateUnverifiedAnswers(sampleAnswers);
    const html = render();

    expect(isCountedResult(result)).toBe(true);
    if (isCountedResult(result)) {
      expect(html).toContain(String(result.untraceable));
    }
    expect(html).toContain('The working');
  });

  it('heads the report with the firm name when one is given', () => {
    expect(render(sampleAnswers, FEBRUARY, 'Northgate Financial')).toContain(
      'Northgate Financial: the unverified answer count',
    );
  });

  it('falls back to the plain heading when no firm name is given', () => {
    const html = render(sampleAnswers, FEBRUARY, '   ');

    expect(html).toContain('<h1>The unverified answer count</h1>');
  });

  it('dates the report and populates the disclosure paragraph with the figures', () => {
    const result = calculateUnverifiedAnswers(sampleAnswers);
    const html = render(sampleAnswers, FEBRUARY, 'Northgate Financial');

    expect(html).toContain('15 February 2026');
    expect(html).toContain(DISCLOSURE_HEADING);
    expect(html).toContain(PI_BOUNDARY_LINE);
    if (isCountedResult(result)) {
      expect(html).toContain(
        `approximately ${result.untraceable} of those answers a month`,
      );
    }
  });

  it('puts the insurer section first when renewal is within three months', () => {
    const html = render(
      { ...sampleAnswers, piRenewalMonth: 'march' },
      FEBRUARY,
    );

    expect(html.indexOf(DISCLOSURE_HEADING)).toBeLessThan(
      html.indexOf(REPORT_QUESTIONS_HEADING),
    );
  });

  it('puts the compliance questions first when renewal is further out', () => {
    const html = render({ ...sampleAnswers, piRenewalMonth: 'january' }, FEBRUARY);

    expect(html.indexOf(REPORT_QUESTIONS_HEADING)).toBeLessThan(
      html.indexOf(DISCLOSURE_HEADING),
    );
  });

  it('puts the compliance questions first when the renewal month is unknown', () => {
    const html = render(
      { ...sampleAnswers, piRenewalMonth: 'not_sure' },
      FEBRUARY,
    );

    expect(html.indexOf(REPORT_QUESTIONS_HEADING)).toBeLessThan(
      html.indexOf(DISCLOSURE_HEADING),
    );
  });

  it('gives each prioritised question a good answer', () => {
    const result = calculateUnverifiedAnswers(sampleAnswers);
    const html = render();

    expect(result.reportComplianceQuestions).toHaveLength(3);
    for (const question of result.reportComplianceQuestions) {
      expect(html).toContain(question.text);
      expect(html).toContain(question.goodAnswer);
    }
  });

  it('includes the no-hire section and the named regulator material', () => {
    const html = render();

    expect(html).toContain(NO_HIRE_HEADING);
    expect(html).toContain(REPORT_SOURCES_HEADING);
    for (const source of REPORT_SOURCES) {
      expect(html).toContain(source.url);
      expect(html).toContain(source.name);
    }
  });

  it('carries exactly one offer and puts it below every other section', () => {
    const html = render();
    const offerIndex = html.indexOf(REPORT_OFFER_LINE);

    expect(offerIndex).toBeGreaterThan(-1);
    expect(html.indexOf(REPORT_OFFER_LINE, offerIndex + 1)).toBe(-1);
    for (const heading of [
      DISCLOSURE_HEADING,
      REPORT_QUESTIONS_HEADING,
      NO_HIRE_HEADING,
      REPORT_SOURCES_HEADING,
    ]) {
      expect(html.indexOf(heading)).toBeLessThan(offerIndex);
    }
  });

  it('uses shared not-counted reason copy', () => {
    const blockedAnswers: CompleteUnverifiedAnswersInput = {
      ...sampleAnswers,
      sourceAccess: 'not_sure',
    };
    const result = calculateUnverifiedAnswers(blockedAnswers);
    const html = render(blockedAnswers);

    expect(result.status).toBe('not_counted');
    if (result.status === 'not_counted') {
      for (const reason of result.reasons) {
        expect(html).toContain(NOT_COUNTED_REASON_COPY[reason]);
      }
    }
  });

  it('claims no figure in the disclosure paragraph when nothing was counted', () => {
    const html = render({ ...sampleAnswers, sourceAccess: 'not_sure' });

    expect(html).toContain('we are not able to state how many AI answers');
  });

  it('does not use uncited benchmark language', () => {
    expect(render().toLowerCase()).not.toContain('most firms');
  });
});
