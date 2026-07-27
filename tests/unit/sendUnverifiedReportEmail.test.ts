import { describe, expect, it } from 'vitest';
import { buildUnverifiedReportEmailHtml } from '@/lib/unverified-answers/sendUnverifiedReportEmail';
import { EMAIL_REPORT_CONTENTS } from '@/lib/unverifiedAnswers';

describe('buildUnverifiedReportEmailHtml', () => {
  it('includes report contents without uncited benchmark language', () => {
    const html = buildUnverifiedReportEmailHtml({
      email: 'principal@firm.com',
      reportUrl: 'https://example.com/unverified-answer-count/report/abc',
    });

    for (const item of EMAIL_REPORT_CONTENTS) {
      expect(html).toContain(item);
    }
    expect(html.toLowerCase()).not.toContain('most firms');
  });

  it('uses the compliance-officer greeting when requested', () => {
    const html = buildUnverifiedReportEmailHtml({
      email: 'compliance@firm.com',
      reportUrl: 'https://example.com/unverified-answer-count/report/abc',
      isComplianceOfficerCopy: true,
    });

    expect(html).toContain('A colleague asked us to send you this report.');
  });
});
