import {
  ASSUMPTIONS_NOTE,
  CLIENT_TRACE_LABELS,
  DISCLAIMER_LINE,
  DISCLOSURE_HEADING,
  DISCLOSURE_INTRO,
  FREQUENCY_LABELS,
  LINK_CHECK_LABELS,
  NOT_COUNTED_BODY,
  NOT_COUNTED_CLOSING,
  NOT_COUNTED_HEADLINE,
  NOT_COUNTED_REASON_COPY,
  NO_HIRE_HEADING,
  NO_HIRE_INTRO,
  NO_HIRE_STEPS,
  OFFER_CTA_LABEL,
  OFFER_CTA_URL,
  PAGE_TITLE,
  PI_BOUNDARY_LINE,
  PI_DISCLOSURE_LABELS,
  PI_RENEWAL_MONTH_LABELS,
  POLICY_LABELS,
  REGULATED_SHARE_LABELS,
  REPORT_FIGURES_HEADING,
  REPORT_GOOD_ANSWER_LABEL,
  REPORT_OFFER_LINE,
  REPORT_QUESTIONS_HEADING,
  REPORT_QUESTIONS_INTRO,
  REPORT_SOURCES,
  REPORT_SOURCES_HEADING,
  REPORT_SOURCES_INTRO,
  RESULT_INTRO,
  RESULT_ZERO_BODY,
  RESULT_ZERO_HEADLINE,
  SOURCE_ACCESS_LABELS,
  SUBJECT_LABELS,
  TOOL_LABELS,
  buildDisclosureParagraph,
  buildReportDateLine,
  buildReportHeading,
  calculateUnverifiedAnswers,
  isCountedResult,
  resolveReportSectionOrder,
  type CompleteUnverifiedAnswersInput,
  type UnverifiedAnswersResult,
} from '@/lib/unverifiedAnswers';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatAnswersSummary(
  answers: CompleteUnverifiedAnswersInput,
): string {
  const rows: Array<[string, string]> = [
    ['People using AI', String(answers.people)],
    ['Questions per week', FREQUENCY_LABELS[answers.frequencyBand]],
    [
      'Subjects',
      answers.subjects.map((id) => SUBJECT_LABELS[id]).join('; '),
    ],
    [
      'Regulated share',
      REGULATED_SHARE_LABELS[answers.regulatedShareBand],
    ],
    ['Tools', answers.tools.map((id) => TOOL_LABELS[id]).join('; ')],
    ['Approved source list', SOURCE_ACCESS_LABELS[answers.sourceAccess]],
    ['Link checking', LINK_CHECK_LABELS[answers.linkCheck]],
    ['Client traceability', CLIENT_TRACE_LABELS[answers.clientTrace]],
    ['Written AI rules', POLICY_LABELS[answers.policy]],
    ['PI insurer told about AI use', PI_DISCLOSURE_LABELS[answers.piDisclosure]],
    ['PI renewal month', PI_RENEWAL_MONTH_LABELS[answers.piRenewalMonth]],
  ];

  return rows
    .map(
      ([label, value]) =>
        `<tr><td>${escapeHtml(label)}</td><td>${escapeHtml(value)}</td></tr>`,
    )
    .join('');
}

function renderWorking(result: UnverifiedAnswersResult): string {
  return result.workingSteps
    .map((step) => {
      const outcome = step.notDoneReason
        ? `<em>${escapeHtml(step.notDoneReason)}</em>`
        : escapeHtml(step.result ?? '');
      return `<tr>
        <td>${escapeHtml(step.name)}</td>
        <td><code>${escapeHtml(step.substitution)}</code></td>
        <td>${outcome}</td>
      </tr>`;
    })
    .join('');
}

function renderHeadline(result: UnverifiedAnswersResult): string {
  if (!isCountedResult(result)) {
    return `<h2 class="headline">${escapeHtml(NOT_COUNTED_HEADLINE)}</h2>
      <p>${escapeHtml(NOT_COUNTED_BODY)}</p>
      <ul>${result.reasons
        .map((reason) => `<li>${escapeHtml(NOT_COUNTED_REASON_COPY[reason])}</li>`)
        .join('')}</ul>
      <p>${escapeHtml(NOT_COUNTED_CLOSING)}</p>`;
  }

  if (result.isZeroResult) {
    return `<h2 class="headline">${escapeHtml(RESULT_ZERO_HEADLINE)}</h2>
      <p>${escapeHtml(RESULT_ZERO_BODY)}</p>`;
  }

  return `<h2 class="headline"><span class="metric-value">${escapeHtml(String(result.untraceable))}</span> ${escapeHtml(result.headlineSuffix)}</h2>
    <p>${escapeHtml(RESULT_INTRO)}</p>`;
}

function renderDisclosureSection(input: {
  answers: CompleteUnverifiedAnswersInput;
  result: UnverifiedAnswersResult;
  firmName: string | null | undefined;
  generatedAt: Date;
}): string {
  const paragraph = buildDisclosureParagraph({
    firmName: input.firmName,
    result: input.result,
    people: input.answers.people,
    date: input.generatedAt,
  });

  return `<h2>${escapeHtml(DISCLOSURE_HEADING)}</h2>
  <p>${escapeHtml(DISCLOSURE_INTRO)}</p>
  <p class="boundary">${escapeHtml(PI_BOUNDARY_LINE)}</p>
  <blockquote>${escapeHtml(paragraph)}</blockquote>`;
}

function renderQuestionsSection(result: UnverifiedAnswersResult): string {
  const questionsHtml = result.reportComplianceQuestions
    .map(
      (question) => `<div class="story">
      <h3>${escapeHtml(question.text)}</h3>
      <p><strong>${escapeHtml(REPORT_GOOD_ANSWER_LABEL)}.</strong> ${escapeHtml(question.goodAnswer)}</p>
    </div>`,
    )
    .join('');

  return `<h2>${escapeHtml(REPORT_QUESTIONS_HEADING)}</h2>
  <p>${escapeHtml(REPORT_QUESTIONS_INTRO)}</p>
  ${questionsHtml}`;
}

function renderNoHireSection(): string {
  const stepsHtml = NO_HIRE_STEPS.map(
    (step) => `<div class="story">
      <h3>${escapeHtml(step.title)}</h3>
      <p>${escapeHtml(step.body)}</p>
    </div>`,
  ).join('');

  return `<h2>${escapeHtml(NO_HIRE_HEADING)}</h2>
  <p>${escapeHtml(NO_HIRE_INTRO)}</p>
  ${stepsHtml}`;
}

function renderSourcesSection(): string {
  const linksHtml = REPORT_SOURCES.map(
    (source) => `<li>
      <a href="${escapeHtml(source.url)}">${escapeHtml(source.name)}</a>
      <br />${escapeHtml(source.note)}
    </li>`,
  ).join('');

  return `<h2>${escapeHtml(REPORT_SOURCES_HEADING)}</h2>
  <p>${escapeHtml(REPORT_SOURCES_INTRO)}</p>
  <ul>${linksHtml}</ul>`;
}

export function buildUnverifiedReportHtml(input: {
  answers: CompleteUnverifiedAnswersInput;
  result: UnverifiedAnswersResult;
  firmName?: string | null;
  generatedAt?: Date;
}): string {
  const { answers, result, firmName } = input;
  const generatedAt = input.generatedAt ?? new Date();

  const disclosureSection = renderDisclosureSection({
    answers,
    result,
    firmName,
    generatedAt,
  });
  const questionsSection = renderQuestionsSection(result);

  const orderedSections =
    resolveReportSectionOrder(answers.piRenewalMonth, generatedAt) ===
    'insurer_first'
      ? [disclosureSection, questionsSection]
      : [questionsSection, disclosureSection];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>${escapeHtml(PAGE_TITLE)} report</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; color: #212529; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 2rem; background: #fff; }
    h1 { color: #0a2463; font-size: 1.75rem; border-bottom: 2px solid #0a2463; padding-bottom: 0.5rem; margin-bottom: 0.5rem; }
    h2 { color: #0a2463; font-size: 1.25rem; margin-top: 2rem; margin-bottom: 0.75rem; }
    h2.headline { border: 0; margin-top: 1.5rem; }
    .brand { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #b08d57; margin-bottom: 0.5rem; }
    .sub { color: #666; font-size: 0.95rem; margin-bottom: 1.5rem; }
    .metric-value { font-size: 2rem; font-weight: 700; color: #0a2463; }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0 1.5rem; font-size: 0.95rem; }
    th, td { border: 1px solid #dee2e6; padding: 0.6rem 0.75rem; text-align: left; vertical-align: top; }
    th { background: #f8f9fa; color: #0a2463; }
    code { font-size: 0.85rem; }
    .story { background: #f8f9fa; padding: 1rem 1.25rem; border-left: 4px solid #b08d57; margin: 0.75rem 0; border-radius: 0 0.5rem 0.5rem 0; }
    .story h3 { font-size: 1rem; margin: 0 0 0.5rem; color: #0a2463; }
    .story p { margin: 0 0 0.5rem; font-size: 0.95rem; }
    blockquote { margin: 1rem 0; padding: 1rem 1.25rem; background: #fff; border: 1px solid #0a2463; border-radius: 0.5rem; font-size: 0.95rem; }
    .boundary { font-weight: 700; color: #0a2463; }
    .disclaimer { font-size: 0.875rem; color: #666; border-top: 1px solid #dee2e6; padding-top: 1rem; margin-top: 2rem; }
    .offer { font-size: 0.95rem; border-top: 1px solid #dee2e6; padding-top: 1rem; margin-top: 1rem; }
    ul { padding-left: 1.25rem; }
    li { margin-bottom: 0.5rem; }
  </style>
</head>
<body>
  <p class="brand">Wrigital</p>
  <h1>${escapeHtml(buildReportHeading(firmName))}</h1>
  <p class="sub">${escapeHtml(buildReportDateLine(generatedAt))}</p>
  ${renderHeadline(result)}
  <p class="sub">${escapeHtml(result.subjectsLine || 'Based on the answers you entered.')}</p>

  <h2>${escapeHtml(REPORT_FIGURES_HEADING)}</h2>
  <table>
    <thead><tr><th>Question</th><th>Your answer</th></tr></thead>
    <tbody>${formatAnswersSummary(answers)}</tbody>
  </table>

  <h2>The working</h2>
  <table>
    <thead><tr><th>Step</th><th>Substitution</th><th>Result</th></tr></thead>
    <tbody>${renderWorking(result)}</tbody>
  </table>
  <p class="sub">${escapeHtml(ASSUMPTIONS_NOTE)}</p>

  ${orderedSections.join('\n\n  ')}

  ${renderNoHireSection()}

  ${renderSourcesSection()}

  <p class="disclaimer">${escapeHtml(DISCLAIMER_LINE)}</p>
  <p class="offer">${escapeHtml(REPORT_OFFER_LINE)} <a href="${escapeHtml(OFFER_CTA_URL)}">${escapeHtml(OFFER_CTA_LABEL)}</a></p>
</body>
</html>`;
}

export function getReportResult(
  answers: CompleteUnverifiedAnswersInput,
): UnverifiedAnswersResult {
  return calculateUnverifiedAnswers(answers);
}
