import { describe, expect, it } from 'vitest';
import { buildUnverifiedReportHtml } from '@/lib/unverified-answers/buildReportHtml';
import {
  NOT_COUNTED_REASON_COPY,
  REPORT_ARTEFACTS_HEADING,
  REPORT_QUESTION_GUIDANCE_HEADING,
  calculateUnverifiedAnswers,
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
};

describe('buildUnverifiedReportHtml', () => {
  it('renders a counted result with working steps', () => {
    const result = calculateUnverifiedAnswers(sampleAnswers);
    const html = buildUnverifiedReportHtml({ answers: sampleAnswers, result });

    expect(html).toContain(String(result.status === 'counted' ? result.untraceable : ''));
    expect(html).toContain('The working');
    expect(html).toContain(REPORT_QUESTION_GUIDANCE_HEADING);
    expect(html).toContain(REPORT_ARTEFACTS_HEADING);
  });

  it('uses shared not-counted reason copy', () => {
    const blockedAnswers: CompleteUnverifiedAnswersInput = {
      ...sampleAnswers,
      sourceAccess: 'not_sure',
    };
    const result = calculateUnverifiedAnswers(blockedAnswers);
    const html = buildUnverifiedReportHtml({
      answers: blockedAnswers,
      result,
    });

    expect(result.status).toBe('not_counted');
    for (const reason of result.reasons) {
      expect(html).toContain(NOT_COUNTED_REASON_COPY[reason]);
    }
  });

  it('does not use uncited benchmark language', () => {
    const result = calculateUnverifiedAnswers(sampleAnswers);
    const html = buildUnverifiedReportHtml({ answers: sampleAnswers, result });

    expect(html.toLowerCase()).not.toContain('most firms');
  });
});
