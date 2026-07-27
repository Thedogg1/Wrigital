import { describe, expect, it } from 'vitest';
import * as unverifiedAnswers from '@/lib/unverifiedAnswers';
import {
  ASSUMPTIONS_NOTE,
  CHECKED_LIBRARY_FACTOR_YES,
  CLIENT_TRACE_OPTIONS,
  COMPLIANCE_QUESTIONS_BY_ANSWER,
  COUNTABLE_FREQUENCY_MIDPOINTS,
  DEFAULT_UNVERIFIED_ANSWERS_INPUT,
  DISCLAIMER_LINE,
  EMAIL_REPORT_CONTENTS,
  FREQUENCY_MIDPOINT_11_20,
  FREQUENCY_MIDPOINT_1_2,
  FREQUENCY_OPTIONS,
  IncompleteUnverifiedAnswersError,
  LINK_CHECK_OPTIONS,
  MANUAL_CHECK_RATE_EVERY_TIME,
  MANUAL_CHECK_RATE_SOMETIMES,
  POLICY_OPTIONS,
  PRIORITISED_COMPLIANCE_QUESTION_COUNT,
  REGULATED_SHARE_ALMOST_NONE,
  REGULATED_SHARE_MOST,
  REGULATED_SHARE_OPTIONS,
  SOURCE_ACCESS_OPTIONS,
  SUBJECT_OPTIONS,
  TOOL_OPTIONS,
  WEEKS_PER_MONTH,
  buildSubjectsLine,
  calculateUnverifiedAnswers,
  formatSubjectList,
  getCheckedLibraryFactor,
  getFrequencyMidpoint,
  getManualCheckRate,
  getRegulatedShareMidpoint,
  isComplete,
  isCountedResult,
  isValidPeople,
  parseFormattedNumber,
  roundMonthlyQuestions,
  roundRegulatedShare,
  toggleToolSelection,
  type CountableFrequencyBandId,
  type CountedUnverifiedAnswersResult,
  type KnownLinkCheckAnswer,
  type KnownSourceAccessAnswer,
  type LinkCheckAnswer,
  type NotCountedUnverifiedAnswersResult,
  type SourceAccessAnswer,
  type UnverifiedAnswersInput,
  type UnverifiedAnswersResult,
  type WorkingStep,
} from '@/lib/unverifiedAnswers';

const ALL_SUBJECT_IDS = SUBJECT_OPTIONS.map((s) => s.id);
const COUNTABLE_FREQUENCY_BANDS = Object.keys(
  COUNTABLE_FREQUENCY_MIDPOINTS,
) as CountableFrequencyBandId[];
const REGULATED_SHARE_BANDS = REGULATED_SHARE_OPTIONS.map((o) => o.id);
const KNOWN_LINK_CHECK_ANSWERS = LINK_CHECK_OPTIONS.map(
  (o) => o.id,
).filter((id): id is KnownLinkCheckAnswer => id !== 'not_sure');
const KNOWN_SOURCE_ACCESS_ANSWERS = SOURCE_ACCESS_OPTIONS.map(
  (o) => o.id,
).filter((id): id is KnownSourceAccessAnswer => id !== 'not_sure');

function completeInput(
  overrides: Partial<UnverifiedAnswersInput> = {},
): UnverifiedAnswersInput {
  return {
    people: 5,
    frequencyBand: '3_5',
    subjects: ['uk_tax', 'pensions'],
    regulatedShareBand: 'half',
    tools: ['copilot_tenant'],
    sourceAccess: 'no',
    linkCheck: 'never',
    clientTrace: 'no',
    policy: 'no',
    ...overrides,
  };
}

function assertNotCounted(
  result: UnverifiedAnswersResult,
): asserts result is NotCountedUnverifiedAnswersResult {
  expect(result.status).toBe('not_counted');
  if (result.status !== 'not_counted') {
    throw new Error('Expected a not-counted result');
  }
}

function assertCounted(
  result: UnverifiedAnswersResult,
): asserts result is CountedUnverifiedAnswersResult {
  expect(result.status).toBe('counted');
  if (!isCountedResult(result)) {
    throw new Error('Expected a counted result');
  }
}

function parseStepResult(step: WorkingStep): number {
  expect(step.result).toBeDefined();
  return parseFormattedNumber(step.result!);
}

function extractMonthlyOperands(substitution: string): {
  people: number;
  midpoint: number;
  weeks: number;
} {
  const match = substitution.match(
    /round\(([\d,]+) × .+? \(([\d.]+) midpoint\) × ([\d.]+)\)/,
  );
  expect(match).not.toBeNull();
  return {
    people: parseFormattedNumber(match![1]),
    midpoint: Number(match![2]),
    weeks: Number(match![3]),
  };
}

/** Hand-evaluate each completed working row from substitution text. */
function assertWorkingPanelMatches(result: CountedUnverifiedAnswersResult): void {
  let stepIndex = 0;
  const steps = result.workingSteps;

  const monthly = steps[stepIndex++];
  const monthlyCore = monthly.substitution.includes('round(')
    ? monthly.substitution.slice(monthly.substitution.indexOf('round('))
    : monthly.substitution;
  const { people, midpoint, weeks } = extractMonthlyOperands(monthlyCore);
  const handMonthly = Math.round(people * midpoint * weeks);
  expect(parseStepResult(monthly)).toBe(handMonthly);
  expect(result.monthlyQuestions).toBe(handMonthly);

  if (!result.hasRegulatedSubject) {
    expect(steps[stepIndex].name).toContain('No regulated subject');
    stepIndex += 1;
  }

  const share = steps[stepIndex++];
  const shareMatch = share.substitution.match(/→ ([\d.]+)$/);
  expect(shareMatch).not.toBeNull();
  const handShare = Number(shareMatch![1]);
  expect(parseStepResult(share)).toBe(handShare);
  expect(result.regulatedShare).toBe(handShare);

  const regulated = steps[stepIndex++];
  const regulatedMatch = regulated.substitution.match(
    /^round\(([\d,]+) × ([\d.]+)\)$/,
  );
  expect(regulatedMatch).not.toBeNull();
  const handRegulated = Math.round(
    parseFormattedNumber(regulatedMatch![1]) * Number(regulatedMatch![2]),
  );
  expect(parseStepResult(regulated)).toBe(handRegulated);
  expect(result.regulatedAnswers).toBe(handRegulated);

  const manualCheck = steps[stepIndex++];
  const manualMatch = manualCheck.substitution.match(/→ ([\d.]+)/);
  expect(manualMatch).not.toBeNull();
  expect(Number(manualMatch![1])).toBe(result.manualCheckRate);
  expect(parseStepResult(manualCheck)).toBe(result.manualCheckRate);

  const checkedLibrary = steps[stepIndex++];
  const libraryMatch = checkedLibrary.substitution.match(/→ ([\d.]+)/);
  expect(libraryMatch).not.toBeNull();
  expect(Number(libraryMatch![1])).toBe(result.checkedLibraryFactor);
  expect(parseStepResult(checkedLibrary)).toBe(result.checkedLibraryFactor);

  const protection = steps[stepIndex++];
  const protectionMatch = protection.substitution.match(
    /^max\(([\d.]+), ([\d.]+)\)$/,
  );
  expect(protectionMatch).not.toBeNull();
  const handProtection = Math.max(
    Number(protectionMatch![1]),
    Number(protectionMatch![2]),
  );
  expect(parseStepResult(protection)).toBe(handProtection);
  expect(result.protectionFactor).toBe(handProtection);

  const untraceable = steps[stepIndex++];
  const untraceableMatch = untraceable.substitution.match(
    /^round\(([\d,]+) × \(1 − ([\d.]+)\)\)$/,
  );
  expect(untraceableMatch).not.toBeNull();
  const handUntraceable = Math.round(
    parseFormattedNumber(untraceableMatch![1]) *
      (1 - Number(untraceableMatch![2])),
  );
  expect(parseStepResult(untraceable)).toBe(handUntraceable);
  expect(result.untraceable).toBe(handUntraceable);
}

describe('isValidPeople', () => {
  it('rejects null, NaN, non-integers and out-of-range values', () => {
    expect(isValidPeople(null)).toBe(false);
    expect(isValidPeople(Number.NaN)).toBe(false);
    expect(isValidPeople(0)).toBe(false);
    expect(isValidPeople(500)).toBe(false);
    expect(isValidPeople(5.5)).toBe(false);
  });

  it('accepts whole numbers within range', () => {
    expect(isValidPeople(1)).toBe(true);
    expect(isValidPeople(200)).toBe(true);
    expect(isValidPeople(5)).toBe(true);
  });
});

describe('isComplete', () => {
  it('returns false for default input', () => {
    expect(isComplete(DEFAULT_UNVERIFIED_ANSWERS_INPUT)).toBe(false);
  });

  it('returns true when every required field is set', () => {
    expect(isComplete(completeInput())).toBe(true);
  });

  it('returns false when people are invalid', () => {
    expect(isComplete(completeInput({ people: null }))).toBe(false);
    expect(isComplete(completeInput({ people: 500 }))).toBe(false);
  });

  it('returns false when subjects are empty', () => {
    expect(isComplete(completeInput({ subjects: [] }))).toBe(false);
  });

  it('returns false when tools are empty', () => {
    expect(isComplete(completeInput({ tools: [] }))).toBe(false);
  });
});

describe('formatSubjectList', () => {
  it('formats lists for result copy', () => {
    expect(formatSubjectList(['uk_tax'])).toBe('UK tax and allowances');
    expect(formatSubjectList(['uk_tax', 'pensions'])).toBe(
      'UK tax and allowances and Pensions and transfers',
    );
    expect(formatSubjectList(['uk_tax', 'pensions', 'fca_rules'])).toBe(
      'UK tax and allowances, Pensions and transfers and FCA rules and Consumer Duty',
    );
  });
});

describe('calculateUnverifiedAnswers', () => {
  it('throws when input is incomplete', () => {
    expect(() => calculateUnverifiedAnswers(DEFAULT_UNVERIFIED_ANSWERS_INPUT)).toThrow(
      IncompleteUnverifiedAnswersError,
    );
  });

  it('5 people, band 1_2, all six subjects, most regulated share', () => {
    const input = completeInput({
      people: 5,
      frequencyBand: '1_2',
      subjects: [...ALL_SUBJECT_IDS],
      regulatedShareBand: 'most',
      sourceAccess: 'no',
      linkCheck: 'sometimes',
      clientTrace: 'partly',
      policy: 'yes',
    });

    const result = calculateUnverifiedAnswers(input);
    assertCounted(result);

    const expectedMonthly = roundMonthlyQuestions(
      5,
      getFrequencyMidpoint('1_2'),
    );
    const expectedShare = roundRegulatedShare(
      getRegulatedShareMidpoint('most'),
    );
    const expectedRegulated = Math.round(expectedMonthly * expectedShare);
    const protection = Math.max(
      getManualCheckRate('sometimes'),
      getCheckedLibraryFactor('no'),
    );
    const expectedUntraceable = Math.round(
      expectedRegulated * (1 - protection),
    );

    expect(expectedMonthly).toBe(32);
    expect(expectedShare).toBe(REGULATED_SHARE_MOST);
    expect(expectedRegulated).toBe(24);
    expect(protection).toBe(MANUAL_CHECK_RATE_SOMETIMES);
    expect(expectedUntraceable).toBe(22);

    expect(result.monthlyQuestions).toBe(expectedMonthly);
    expect(result.regulatedShare).toBe(expectedShare);
    expect(result.regulatedAnswers).toBe(expectedRegulated);
    expect(result.untraceable).toBe(expectedUntraceable);
    expect(result.isZeroResult).toBe(false);
    expect(result.showOffer).toBe(true);
    expect(result.subjectsLine).toBe(buildSubjectsLine([...ALL_SUBJECT_IDS]));
    expect(result.workingSteps[0].substitution).toContain('1 to 2');
    expect(result.assumptionsNote).toBe(ASSUMPTIONS_NOTE);
    expect(result.assumptionsNote).toContain('manual link checking scores low');
    expect(result.headlineSuffix).toContain('answers a month');

    assertWorkingPanelMatches(result);
  });

  it('1 person, band 11_20, one subject, almost none regulated share', () => {
    const input = completeInput({
      people: 1,
      frequencyBand: '11_20',
      subjects: ['uk_tax'],
      regulatedShareBand: 'almost_none',
      tools: ['chatgpt_personal'],
      sourceAccess: 'yes',
      linkCheck: 'every_time',
      clientTrace: 'yes_full',
      policy: 'not_sure',
    });

    const result = calculateUnverifiedAnswers(input);
    assertCounted(result);

    const expectedMonthly = roundMonthlyQuestions(1, FREQUENCY_MIDPOINT_11_20);
    const expectedShare = roundRegulatedShare(REGULATED_SHARE_ALMOST_NONE);
    const expectedRegulated = Math.round(expectedMonthly * expectedShare);
    const protection = Math.max(
      MANUAL_CHECK_RATE_EVERY_TIME,
      CHECKED_LIBRARY_FACTOR_YES,
    );
    const expectedUntraceable = Math.round(
      expectedRegulated * (1 - protection),
    );

    expect(expectedMonthly).toBe(67);
    expect(expectedShare).toBe(0.05);
    expect(expectedRegulated).toBe(3);
    expect(protection).toBe(CHECKED_LIBRARY_FACTOR_YES);
    expect(expectedUntraceable).toBe(1);

    expect(result.monthlyQuestions).toBe(expectedMonthly);
    expect(result.regulatedShare).toBe(expectedShare);
    expect(result.regulatedAnswers).toBe(expectedRegulated);
    expect(result.untraceable).toBe(expectedUntraceable);
    expect(result.isZeroResult).toBe(false);
    expect(result.showOffer).toBe(true);
    expect(result.personalAccountCallout).not.toBeNull();
    expect(result.notSureCount).toBe(1);
    expect(result.subjectsLine).toContain('UK tax and allowances');
    expect(result.headlineSuffix).toContain('answer a month');

    assertWorkingPanelMatches(result);
  });

  it('200 people, band 6_10, regulated subjects selected, few regulated share, not sure on source access', () => {
    const input = completeInput({
      people: 200,
      frequencyBand: '6_10',
      subjects: ['fca_rules', 'product_provider'],
      regulatedShareBand: 'few',
      tools: ['back_office'],
      sourceAccess: 'not_sure',
      linkCheck: 'never',
      clientTrace: 'no',
      policy: 'no',
    });

    const result = calculateUnverifiedAnswers(input);
    assertNotCounted(result);

    expect(result.reasons).toEqual(['unknown_source_access']);
    expect(result).not.toHaveProperty('untraceable');
    expect(result).not.toHaveProperty('monthlyQuestions');
    expect(result.showOffer).toBe(true);
    expect(result.subjectsLine).toContain('FCA rules and Consumer Duty');

    const lastStep = result.workingSteps[result.workingSteps.length - 1];
    expect(lastStep.notDoneReason).toBeDefined();
    expect(lastStep.result).toBeUndefined();
  });

  it('returns a zero counted result when protection removes every regulated answer', () => {
    const input = completeInput({
      people: 1,
      frequencyBand: '1_2',
      subjects: ['uk_tax'],
      regulatedShareBand: 'almost_none',
      sourceAccess: 'yes',
      linkCheck: 'every_time',
      clientTrace: 'yes_full',
      policy: 'yes',
    });

    const result = calculateUnverifiedAnswers(input);
    assertCounted(result);

    expect(result.untraceable).toBe(0);
    expect(result.isZeroResult).toBe(true);
    expect(result.showOffer).toBe(false);
    expect(result.prioritisedComplianceQuestions.length).toBe(3);
  });

  it('returns a counted zero when no regulated subject was selected', () => {
    const input = completeInput({
      subjects: ['client_correspondence', 'drafting_admin'],
      regulatedShareBand: 'most',
    });

    const result = calculateUnverifiedAnswers(input);
    assertCounted(result);

    expect(result.hasRegulatedSubject).toBe(false);
    expect(result.regulatedShare).toBe(0);
    expect(result.untraceable).toBe(0);
    expect(result.isZeroResult).toBe(true);
    expect(result.showOffer).toBe(false);
    expect(result.subjectsLine).toBe('');
    expect(result.workingSteps.some((s) => s.name.includes('No regulated subject'))).toBe(
      true,
    );
  });

  it('blocks the count when all relevant answers are not sure', () => {
    const input = completeInput({
      tools: ['not_sure'],
      sourceAccess: 'not_sure',
      linkCheck: 'not_sure',
      clientTrace: 'not_sure',
      policy: 'not_sure',
    });

    const result = calculateUnverifiedAnswers(input);
    assertNotCounted(result);

    expect(result.reasons).toEqual([
      'unknown_source_access',
      'unknown_link_check',
    ]);
    expect(result.notSureCount).toBe(5);
    expect(result.notSureCallout).toContain('5 of your answers were not sure');
    expect(result).not.toHaveProperty('untraceable');
  });

  it('returns all three not-counted reasons in question order', () => {
    const input = completeInput({
      frequencyBand: 'more_than_20',
      sourceAccess: 'not_sure',
      linkCheck: 'not_sure',
    });

    const result = calculateUnverifiedAnswers(input);
    assertNotCounted(result);

    expect(result.reasons).toEqual([
      'unbounded_frequency',
      'unknown_source_access',
      'unknown_link_check',
    ]);
    expect(result.workingSteps[0].notDoneReason).toBeDefined();
    expect(result.workingSteps[0].result).toBeUndefined();
    expect(result.showOffer).toBe(true);
    expect(result.teaser.length).toBeGreaterThan(0);
    expect(result.prioritisedComplianceQuestions.length).toBe(3);
  });

  it('returns the best-case counted result when protection comes from the library factor', () => {
    const input = completeInput({
      sourceAccess: 'yes',
      linkCheck: 'every_time',
      clientTrace: 'yes_full',
      policy: 'yes',
    });

    const result = calculateUnverifiedAnswers(input);
    assertCounted(result);

    expect(result.protectionFactor).toBe(CHECKED_LIBRARY_FACTOR_YES);
    expect(result.notSureCount).toBe(0);
    expect(result.notSureCallout).toBeNull();
    expect(result.prioritisedComplianceQuestions.length).toBe(3);
  });

  it('handles the smallest firm on a low band', () => {
    const input = completeInput({
      people: 1,
      frequencyBand: '1_2',
      subjects: ['uk_tax'],
      regulatedShareBand: 'almost_none',
      sourceAccess: 'no',
      linkCheck: 'never',
    });

    const result = calculateUnverifiedAnswers(input);
    assertCounted(result);

    expect(result.monthlyQuestions).toBe(
      roundMonthlyQuestions(1, FREQUENCY_MIDPOINT_1_2),
    );
    expect(result.monthlyQuestions).toBe(6);
    assertWorkingPanelMatches(result);
  });

  it('handles the largest firm on the top closed band', () => {
    const input = completeInput({
      people: 200,
      frequencyBand: '11_20',
      subjects: ['uk_tax', 'pensions', 'fca_rules', 'product_provider'],
      regulatedShareBand: 'most',
      sourceAccess: 'no',
      linkCheck: 'never',
      clientTrace: 'no',
      policy: 'no',
    });

    const result = calculateUnverifiedAnswers(input);
    assertCounted(result);

    const expectedMonthly = roundMonthlyQuestions(200, FREQUENCY_MIDPOINT_11_20);
    expect(expectedMonthly).toBe(Math.round(200 * 15.5 * WEEKS_PER_MONTH));
    expect(expectedMonthly).toBe(13330);
    expect(result.monthlyQuestions).toBe(expectedMonthly);
    expect(result.workingSteps[0].result).toBe('13,330');
    assertWorkingPanelMatches(result);
  });

  it('pins the exact half-up rounding boundary at regulatedAnswers 5 and protection 0.1', () => {
    const input = completeInput({
      people: 1,
      frequencyBand: '1_2',
      subjects: ['uk_tax'],
      regulatedShareBand: 'almost_none',
      sourceAccess: 'no',
      linkCheck: 'sometimes',
    });

    const result = calculateUnverifiedAnswers(input);
    assertCounted(result);

    expect(result.regulatedAnswers).toBe(0);
    expect(result.protectionFactor).toBe(MANUAL_CHECK_RATE_SOMETIMES);

    const boundaryInput = completeInput({
      people: 7,
      frequencyBand: '1_2',
      subjects: ['uk_tax'],
      regulatedShareBand: 'almost_none',
      sourceAccess: 'no',
      linkCheck: 'sometimes',
    });

    const boundaryResult = calculateUnverifiedAnswers(boundaryInput);
    assertCounted(boundaryResult);

    expect(boundaryResult.regulatedAnswers).toBe(2);
    expect(boundaryResult.protectionFactor).toBe(0.1);
    expect(boundaryResult.untraceable).toBe(2);

    const exactBoundaryInput = completeInput({
      people: 16,
      frequencyBand: '1_2',
      subjects: ['uk_tax'],
      regulatedShareBand: 'almost_none',
      sourceAccess: 'no',
      linkCheck: 'sometimes',
    });

    const exactBoundary = calculateUnverifiedAnswers(exactBoundaryInput);
    assertCounted(exactBoundary);

    expect(exactBoundary.regulatedAnswers).toBe(5);
    expect(exactBoundary.protectionFactor).toBe(0.1);
    expect(exactBoundary.untraceable).toBe(5);
    expect(Math.round(5 * (1 - 0.1))).toBe(5);
  });

  it('uses plural and singular headline suffixes', () => {
    const singular = calculateUnverifiedAnswers(
      completeInput({
        people: 1,
        frequencyBand: '11_20',
        subjects: ['uk_tax'],
        regulatedShareBand: 'almost_none',
        sourceAccess: 'yes',
        linkCheck: 'every_time',
      }),
    );
    assertCounted(singular);
    expect(singular.untraceable).toBe(1);
    expect(singular.headlineSuffix).toContain('answer a month');

    const plural = calculateUnverifiedAnswers(
      completeInput({
        people: 5,
        frequencyBand: '1_2',
        subjects: ['uk_tax'],
        regulatedShareBand: 'most',
        sourceAccess: 'no',
        linkCheck: 'never',
      }),
    );
    assertCounted(plural);
    expect(plural.untraceable).toBeGreaterThan(1);
    expect(plural.headlineSuffix).toContain('answers a month');
  });

  it('builds a teaser that names the weakest area without repeating the full compliance question', () => {
    const input = completeInput({
      clientTrace: 'no',
      linkCheck: 'never',
      sourceAccess: 'no',
      policy: 'yes',
    });

    const result = calculateUnverifiedAnswers(input);
    assertCounted(result);

    expect(result.teaser).toContain('what you could show a client');
    expect(result.teaser).not.toBe(result.prioritisedComplianceQuestions[0]);
  });
});

describe('invariant sweep', () => {
  it('keeps every countable combination within valid numeric bounds', () => {
    for (const frequencyBand of COUNTABLE_FREQUENCY_BANDS) {
      for (const regulatedShareBand of REGULATED_SHARE_BANDS) {
        for (const linkCheck of KNOWN_LINK_CHECK_ANSWERS) {
          for (const sourceAccess of KNOWN_SOURCE_ACCESS_ANSWERS) {
            for (const people of [1, 2, 7, 25, 199, 200]) {
              const result = calculateUnverifiedAnswers(
                completeInput({
                  people,
                  frequencyBand,
                  regulatedShareBand,
                  linkCheck,
                  sourceAccess,
                  subjects: ['uk_tax'],
                }),
              );

              assertCounted(result);
              expect(Number.isInteger(result.untraceable)).toBe(true);
              expect(result.untraceable).toBeGreaterThanOrEqual(0);
              expect(result.untraceable).toBeLessThanOrEqual(
                result.regulatedAnswers,
              );
              expect(result.regulatedAnswers).toBeLessThanOrEqual(
                result.monthlyQuestions,
              );
              expect(Number.isNaN(result.untraceable)).toBe(false);
              expect(Number.isNaN(result.regulatedAnswers)).toBe(false);
              expect(Number.isNaN(result.monthlyQuestions)).toBe(false);
            }
          }
        }
      }
    }
  });
});

describe('no-fallback sweep', () => {
  it('blocks every combination that depends on an unknown input', () => {
    const blockedCases: Array<{
      overrides: Partial<UnverifiedAnswersInput>;
      reasons: unverifiedAnswers.NotCountedReason[];
    }> = [
      {
        overrides: { frequencyBand: 'more_than_20' },
        reasons: ['unbounded_frequency'],
      },
      {
        overrides: { sourceAccess: 'not_sure' },
        reasons: ['unknown_source_access'],
      },
      {
        overrides: { linkCheck: 'not_sure' },
        reasons: ['unknown_link_check'],
      },
      {
        overrides: {
          frequencyBand: 'more_than_20',
          sourceAccess: 'not_sure',
          linkCheck: 'not_sure',
        },
        reasons: [
          'unbounded_frequency',
          'unknown_source_access',
          'unknown_link_check',
        ],
      },
    ];

    for (const testCase of blockedCases) {
      const result = calculateUnverifiedAnswers(completeInput(testCase.overrides));
      assertNotCounted(result);

      expect(result.reasons).toEqual(testCase.reasons);
      expect(result).not.toHaveProperty('untraceable');
      expect(result).not.toHaveProperty('regulatedAnswers');
      expect(result).not.toHaveProperty('monthlyQuestions');

      const lastStep = result.workingSteps[result.workingSteps.length - 1];
      expect(lastStep.notDoneReason).toBeDefined();
      expect(lastStep.result).toBeUndefined();
    }
  });
});

describe('roundMonthlyQuestions', () => {
  it('rounds once before downstream use', () => {
    expect(roundMonthlyQuestions(5, FREQUENCY_MIDPOINT_1_2)).toBe(32);
    expect(5 * FREQUENCY_MIDPOINT_1_2 * WEEKS_PER_MONTH).toBeCloseTo(32.25, 5);
  });
});

describe('roundRegulatedShare', () => {
  it('rounds to two decimal places', () => {
    expect(roundRegulatedShare(0.333333)).toBe(0.33);
    expect(roundRegulatedShare(REGULATED_SHARE_MOST)).toBe(0.75);
  });
});

describe('parseFormattedNumber', () => {
  it('parses en-GB formatted integers', () => {
    expect(parseFormattedNumber('1,720')).toBe(1720);
    expect(parseFormattedNumber('32')).toBe(32);
  });
});

describe('toggleToolSelection', () => {
  it('selecting not sure clears other tools', () => {
    expect(
      toggleToolSelection(['chatgpt_personal', 'copilot_tenant'], 'not_sure'),
    ).toEqual(['not_sure']);
  });

  it('selecting another tool clears not sure', () => {
    expect(toggleToolSelection(['not_sure'], 'copilot_tenant')).toEqual([
      'copilot_tenant',
    ]);
  });

  it('toggles a concrete tool off when selected again', () => {
    expect(
      toggleToolSelection(['copilot_tenant'], 'copilot_tenant'),
    ).toEqual([]);
  });
});

describe('label maps', () => {
  it('keeps option ids and label maps in sync', () => {
    expect(Object.keys(unverifiedAnswers.FREQUENCY_LABELS).sort()).toEqual(
      FREQUENCY_OPTIONS.map((o) => o.id).sort(),
    );
    expect(Object.keys(unverifiedAnswers.REGULATED_SHARE_LABELS).sort()).toEqual(
      REGULATED_SHARE_OPTIONS.map((o) => o.id).sort(),
    );
    expect(Object.keys(unverifiedAnswers.SUBJECT_LABELS).sort()).toEqual(
      SUBJECT_OPTIONS.map((o) => o.id).sort(),
    );
    expect(Object.keys(unverifiedAnswers.TOOL_LABELS).sort()).toEqual(
      TOOL_OPTIONS.map((o) => o.id).sort(),
    );
    expect(Object.keys(unverifiedAnswers.SOURCE_ACCESS_LABELS).sort()).toEqual(
      SOURCE_ACCESS_OPTIONS.map((o) => o.id).sort(),
    );
    expect(Object.keys(unverifiedAnswers.LINK_CHECK_LABELS).sort()).toEqual(
      LINK_CHECK_OPTIONS.map((o) => o.id).sort(),
    );
    expect(Object.keys(unverifiedAnswers.CLIENT_TRACE_LABELS).sort()).toEqual(
      CLIENT_TRACE_OPTIONS.map((o) => o.id).sort(),
    );
    expect(Object.keys(unverifiedAnswers.POLICY_LABELS).sort()).toEqual(
      POLICY_OPTIONS.map((o) => o.id).sort(),
    );
  });
});

describe('no fallback numbers survive', () => {
  it('does not expose midpoint keys for unbounded or unknown answers', () => {
    expect(COUNTABLE_FREQUENCY_MIDPOINTS).not.toHaveProperty('more_than_20');
    expect(Object.keys(COUNTABLE_FREQUENCY_MIDPOINTS)).toEqual(
      COUNTABLE_FREQUENCY_BANDS,
    );
  });
});

describe('banned vocabulary guard', () => {
  it('avoids audit language and em dashes in exported copy', () => {
    const banned = /\b(audit|assessment|assured|certified|compliant)\b/i;
    const skipKeys = new Set([
      'DISCLAIMER_LINE',
      'EMAIL_FOOTER_DISCLAIMER',
      'OFFER_CTA_URL',
    ]);

    for (const [key, value] of Object.entries(unverifiedAnswers)) {
      if (skipKeys.has(key)) continue;

      if (typeof value === 'string') {
        if (value.startsWith('http://') || value.startsWith('https://')) continue;
        expect(value).not.toMatch(banned);
        expect(value).not.toContain('—');
      }

      if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
        for (const item of value) {
          expect(item).not.toMatch(banned);
          expect(item).not.toContain('—');
        }
      }
    }

    expect(DISCLAIMER_LINE).toMatch(banned);
    expect(unverifiedAnswers.EMAIL_FOOTER_DISCLAIMER).toMatch(banned);
  });
});

describe('compliance question integrity', () => {
  it('covers every answer with unique severities and always returns three questions', () => {
    const severities = new Set<number>();

    for (const key of ['q6', 'q7', 'q8', 'q9'] as const) {
      const entries = COMPLIANCE_QUESTIONS_BY_ANSWER[key];
      for (const entry of entries) {
        expect(severities.has(entry.severity)).toBe(false);
        severities.add(entry.severity);
      }
    }

    const q6Answers: SourceAccessAnswer[] = ['yes', 'no', 'not_sure'];
    const q7Answers: LinkCheckAnswer[] = [
      'every_time',
      'sometimes',
      'never',
      'not_sure',
    ];
    const q8Answers = CLIENT_TRACE_OPTIONS.map((o) => o.id);
    const q9Answers = POLICY_OPTIONS.map((o) => o.id);

    for (const sourceAccess of q6Answers) {
      for (const linkCheck of q7Answers) {
        for (const clientTrace of q8Answers) {
          for (const policy of q9Answers) {
            const result = calculateUnverifiedAnswers(
              completeInput({ sourceAccess, linkCheck, clientTrace, policy }),
            );
            expect(result.prioritisedComplianceQuestions).toHaveLength(
              PRIORITISED_COMPLIANCE_QUESTION_COUNT,
            );
          }
        }
      }
    }
  });
});

describe('email report contents', () => {
  it('lists items that are not already shown on screen', () => {
    expect(EMAIL_REPORT_CONTENTS.length).toBeGreaterThan(0);
    expect(
      EMAIL_REPORT_CONTENTS.some((item) => item.toLowerCase().includes('working')),
    ).toBe(false);
    expect(
      EMAIL_REPORT_CONTENTS.some((item) => item.toLowerCase().includes('count')),
    ).toBe(false);
  });

  it('does not use uncited benchmark language', () => {
    for (const item of EMAIL_REPORT_CONTENTS) {
      expect(item.toLowerCase()).not.toContain('most firms');
    }
  });
});

describe('not counted reason copy', () => {
  it('exports one copy map for every reason', () => {
    expect(unverifiedAnswers.NOT_COUNTED_REASON_COPY.unbounded_frequency).toBe(
      unverifiedAnswers.NOT_COUNTED_REASON_UNBOUNDED_FREQUENCY,
    );
    expect(unverifiedAnswers.NOT_COUNTED_REASON_COPY.unknown_source_access).toBe(
      unverifiedAnswers.NOT_COUNTED_REASON_UNKNOWN_SOURCE_ACCESS,
    );
    expect(unverifiedAnswers.NOT_COUNTED_REASON_COPY.unknown_link_check).toBe(
      unverifiedAnswers.NOT_COUNTED_REASON_UNKNOWN_LINK_CHECK,
    );
    expect(unverifiedAnswers.getNotCountedReasonCopy('unknown_link_check')).toBe(
      unverifiedAnswers.NOT_COUNTED_REASON_UNKNOWN_LINK_CHECK,
    );
  });
});

describe('personal account callout', () => {
  it('uses counted wording when a number is shown', () => {
    const result = calculateUnverifiedAnswers(
      completeInput({ tools: ['chatgpt_personal', 'copilot_tenant'] }),
    );
    expect(result.personalAccountCallout).toContain('does not change the count above');
  });

  it('uses not-counted wording when the counter is blocked', () => {
    const result = calculateUnverifiedAnswers(
      completeInput({
        tools: ['chatgpt_personal', 'copilot_tenant'],
        sourceAccess: 'not_sure',
      }),
    );
    expect(result.status).toBe('not_counted');
    expect(result.personalAccountCallout).toContain(
      'does not change whether a count is shown',
    );
    expect(result.personalAccountCallout).not.toContain('count above');
  });
});

describe('type guards', () => {
  it('narrows countable frequency bands', () => {
    expect(unverifiedAnswers.isCountableFrequencyBand('3_5')).toBe(true);
    expect(unverifiedAnswers.isCountableFrequencyBand('more_than_20')).toBe(false);
  });

  it('narrows known link-check and source-access answers', () => {
    expect(unverifiedAnswers.isKnownLinkCheckAnswer('never')).toBe(true);
    expect(unverifiedAnswers.isKnownLinkCheckAnswer('not_sure')).toBe(false);
    expect(unverifiedAnswers.isKnownSourceAccessAnswer('yes')).toBe(true);
    expect(unverifiedAnswers.isKnownSourceAccessAnswer('not_sure')).toBe(false);
  });
});

describe('disclaimer', () => {
  it('denies assessment language explicitly', () => {
    expect(DISCLAIMER_LINE).toContain('not an assessment');
  });
});
