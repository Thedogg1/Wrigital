import {
  ASSUMPTIONS_NOTE,
  CLIENT_TRACE_LABELS,
  COMPLIANCE_QUESTIONS_HEADING,
  DISCLAIMER_LINE,
  FREQUENCY_LABELS,
  LINK_CHECK_LABELS,
  NOT_COUNTED_BODY,
  NOT_COUNTED_CLOSING,
  NOT_COUNTED_HEADLINE,
  NOT_COUNTED_REASON_COPY,
  PAGE_TITLE,
  POLICY_LABELS,
  REGULATED_SHARE_LABELS,
  REPORT_ARTEFACTS,
  REPORT_ARTEFACTS_HEADING,
  REPORT_QUESTION_GUIDANCE,
  REPORT_QUESTION_GUIDANCE_HEADING,
  RESULT_INTRO,
  RESULT_ZERO_BODY,
  RESULT_ZERO_HEADLINE,
  SOURCE_ACCESS_LABELS,
  SUBJECT_LABELS,
  TOOL_LABELS,
  calculateUnverifiedAnswers,
  isCountedResult,
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
    return `<h1>${escapeHtml(NOT_COUNTED_HEADLINE)}</h1>
      <p>${escapeHtml(NOT_COUNTED_BODY)}</p>
      <ul>${result.reasons
        .map((reason) => `<li>${escapeHtml(NOT_COUNTED_REASON_COPY[reason])}</li>`)
        .join('')}</ul>
      <p>${escapeHtml(NOT_COUNTED_CLOSING)}</p>`;
  }

  if (result.isZeroResult) {
    return `<h1>${escapeHtml(RESULT_ZERO_HEADLINE)}</h1>
      <p>${escapeHtml(RESULT_ZERO_BODY)}</p>`;
  }

  return `<h1><span class="metric-value">${escapeHtml(String(result.untraceable))}</span> ${escapeHtml(result.headlineSuffix)}</h1>
    <p>${escapeHtml(RESULT_INTRO)}</p>`;
}

export function buildUnverifiedReportHtml(input: {
  answers: CompleteUnverifiedAnswersInput;
  result: UnverifiedAnswersResult;
}): string {
  const { answers, result } = input;

  const guidanceHtml = REPORT_QUESTION_GUIDANCE.map(
    (item) => `<div class="story">
      <h3>${escapeHtml(item.prompt)}</h3>
      <p><strong>What this is asking.</strong> ${escapeHtml(item.meaning)}</p>
      <p><strong>What a strong answer looks like.</strong> ${escapeHtml(item.strong)}</p>
    </div>`,
  ).join('');

  const artefactsHtml = REPORT_ARTEFACTS.map(
    (item) => `<div class="story">
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.body)}</p>
    </div>`,
  ).join('');

  const complianceHtml = result.prioritisedComplianceQuestions
    .map((q) => `<li>${escapeHtml(q)}</li>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>${escapeHtml(PAGE_TITLE)} report</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; color: #212529; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 2rem; background: #fff; }
    h1 { color: #0a2463; font-size: 1.75rem; border-bottom: 2px solid #0a2463; padding-bottom: 0.5rem; margin-bottom: 0.75rem; }
    h2 { color: #0a2463; font-size: 1.25rem; margin-top: 2rem; margin-bottom: 0.75rem; }
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
    .disclaimer { font-size: 0.875rem; color: #666; border-top: 1px solid #dee2e6; padding-top: 1rem; margin-top: 2rem; }
    ul { padding-left: 1.25rem; }
    li { margin-bottom: 0.5rem; }
  </style>
</head>
<body>
  <p class="brand">Wrigital</p>
  ${renderHeadline(result)}
  <p class="sub">${escapeHtml(result.subjectsLine || 'Based on the answers you entered.')}</p>
  ${result.teaser ? `<p><strong>${escapeHtml(result.teaser)}</strong></p>` : ''}

  <h2>Your answers</h2>
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

  <h2>${escapeHtml(COMPLIANCE_QUESTIONS_HEADING)}</h2>
  <ol>${complianceHtml}</ol>

  <h2>${escapeHtml(REPORT_QUESTION_GUIDANCE_HEADING)}</h2>
  ${guidanceHtml}

  <h2>${escapeHtml(REPORT_ARTEFACTS_HEADING)}</h2>
  ${artefactsHtml}

  <p class="disclaimer">${escapeHtml(DISCLAIMER_LINE)}</p>
</body>
</html>`;
}

export function getReportResult(
  answers: CompleteUnverifiedAnswersInput,
): UnverifiedAnswersResult {
  return calculateUnverifiedAnswers(answers);
}
