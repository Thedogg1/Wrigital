import { calendlyUrl } from '@/lib/site';

/**
 * Server routes for this tool must post the nine answers and run
 * calculateUnverifiedAnswers server-side. Do not accept a pre-rendered report
 * or a client-supplied count (see app/api/uk-lead-capture/route.ts for the
 * pattern to avoid).
 */

// ---------------------------------------------------------------------------
// Calculation constants (change here, not in components)
// ---------------------------------------------------------------------------

/** Weeks in a typical month used to scale weekly figures. */
export const WEEKS_PER_MONTH = 4.3;

export const MIN_PEOPLE = 1;
export const MAX_PEOPLE = 200;

/** Midpoint of each closed weekly frequency band (questions per person per week). */
export const FREQUENCY_MIDPOINT_1_2 = 1.5;
export const FREQUENCY_MIDPOINT_3_5 = 4;
export const FREQUENCY_MIDPOINT_6_10 = 8;
export const FREQUENCY_MIDPOINT_11_20 = 15.5;

/** Midpoint of each regulated-subject share band. */
export const REGULATED_SHARE_MOST = 0.75;
export const REGULATED_SHARE_HALF = 0.5;
export const REGULATED_SHARE_FEW = 0.25;
export const REGULATED_SHARE_ALMOST_NONE = 0.05;

/** Traceability credit when someone in the firm opens links manually. */
export const MANUAL_CHECK_RATE_EVERY_TIME = 0.2;
export const MANUAL_CHECK_RATE_SOMETIMES = 0.1;
export const MANUAL_CHECK_RATE_NEVER = 0;

/** Traceability credit when AI reads a source library checked before use. */
export const CHECKED_LIBRARY_FACTOR_YES = 0.6;
export const CHECKED_LIBRARY_FACTOR_NO = 0;

export const TOTAL_QUESTIONS = 9;

/**
 * Shown with the working panel. Sources are checked at build time, before
 * entering the library. Nothing checks an answer after it is produced.
 */
export const ASSUMPTIONS_NOTE =
  'Sources are checked before they enter a signed-off library, not after an answer is produced. When someone opens a link manually, that only confirms the page loads at that moment. It does not record what the answer drew on and leaves nothing to show a client later. That is why manual link checking scores low in this model: every time 0.20, sometimes 0.10, never 0. A checked source library earns 0.60 because question 6 asks only whether AI can read an approved list, not whether citations are checked in code before they reach a person.';

// ---------------------------------------------------------------------------
// Page and flow copy
// ---------------------------------------------------------------------------

export const PAGE_TITLE = 'The unverified answer count';
export const PAGE_DESCRIPTION =
  'Nine questions. A plain count of how many AI answers on regulated subjects your firm may produce each month that nobody can trace to a source.';

export const INTRO_HEADLINE = 'How many AI answers can nobody trace?';
export const INTRO_BODY =
  'Answer nine questions about how your firm uses AI today. You will get an estimate based on what you enter. Nothing is sent anywhere until you choose to request a copy by email.';
export const INTRO_CTA = 'Start';

export const PRIVACY_NOTE =
  'Your answers stay in this browser until you request a copy by email. They are not sent to us or to any AI service before then.';

export const PROGRESS_LABEL = 'Question {current} of {total}';
export const BACK_BUTTON_LABEL = 'Back';
export const NEXT_BUTTON_LABEL = 'Next';
export const SEE_RESULT_BUTTON_LABEL = 'See my estimate';
export const PRINT_BUTTON_LABEL = 'Print or save as PDF';

export const QUESTION_1_PROMPT =
  'How many people in the firm use AI for work in a typical week?';
export const QUESTION_1_HINT = 'Enter a whole number between {min} and {max}.';
export const PEOPLE_VALIDATION_ERROR =
  'Enter a whole number between {min} and {max}.';

// ---------------------------------------------------------------------------
// Question definitions
// ---------------------------------------------------------------------------

export type FrequencyBandId =
  | '1_2'
  | '3_5'
  | '6_10'
  | '11_20'
  | 'more_than_20';

/** Frequency bands that have a stated midpoint and can feed the count. */
export type CountableFrequencyBandId = Exclude<FrequencyBandId, 'more_than_20'>;

export type SubjectId =
  | 'uk_tax'
  | 'pensions'
  | 'fca_rules'
  | 'product_provider'
  | 'client_correspondence'
  | 'drafting_admin';

export type RegulatedShareBandId = 'most' | 'half' | 'few' | 'almost_none';

export type ToolId =
  | 'chatgpt_personal'
  | 'copilot_tenant'
  | 'back_office'
  | 'not_sure';

export type SourceAccessAnswer = 'yes' | 'no' | 'not_sure';
export type LinkCheckAnswer = 'every_time' | 'sometimes' | 'never' | 'not_sure';
export type ClientTraceAnswer = 'yes_full' | 'partly' | 'no' | 'not_sure';
export type PolicyAnswer = 'yes' | 'no' | 'not_sure';

export type KnownSourceAccessAnswer = Exclude<SourceAccessAnswer, 'not_sure'>;
export type KnownLinkCheckAnswer = Exclude<LinkCheckAnswer, 'not_sure'>;

export interface FrequencyOption {
  id: FrequencyBandId;
  label: string;
}

export interface SubjectOption {
  id: SubjectId;
  label: string;
  regulated: boolean;
}

export interface RegulatedShareOption {
  id: RegulatedShareBandId;
  label: string;
}

export interface ToolOption {
  id: ToolId;
  label: string;
}

export interface SingleChoiceOption<T extends string> {
  id: T;
  label: string;
}

export const QUESTION_2_PROMPT =
  'How many work questions does a typical one of them ask in a week?';

export const FREQUENCY_OPTIONS: readonly FrequencyOption[] = [
  { id: '1_2', label: '1 to 2' },
  { id: '3_5', label: '3 to 5' },
  { id: '6_10', label: '6 to 10' },
  { id: '11_20', label: '11 to 20' },
  { id: 'more_than_20', label: 'More than 20' },
] as const;

export const FREQUENCY_LABELS: Record<FrequencyBandId, string> = {
  '1_2': FREQUENCY_OPTIONS[0].label,
  '3_5': FREQUENCY_OPTIONS[1].label,
  '6_10': FREQUENCY_OPTIONS[2].label,
  '11_20': FREQUENCY_OPTIONS[3].label,
  more_than_20: FREQUENCY_OPTIONS[4].label,
};

export const QUESTION_3_PROMPT = 'Which subjects come up?';
export const QUESTION_3_HINT = 'Select all that apply.';

export const SUBJECT_OPTIONS: readonly SubjectOption[] = [
  { id: 'uk_tax', label: 'UK tax and allowances', regulated: true },
  { id: 'pensions', label: 'Pensions and transfers', regulated: true },
  { id: 'fca_rules', label: 'FCA rules and Consumer Duty', regulated: true },
  {
    id: 'product_provider',
    label: 'Product and provider detail',
    regulated: true,
  },
  {
    id: 'client_correspondence',
    label: 'Client correspondence',
    regulated: false,
  },
  {
    id: 'drafting_admin',
    label: 'General drafting and admin',
    regulated: false,
  },
] as const;

export const SUBJECT_LABELS: Record<SubjectId, string> = {
  uk_tax: SUBJECT_OPTIONS[0].label,
  pensions: SUBJECT_OPTIONS[1].label,
  fca_rules: SUBJECT_OPTIONS[2].label,
  product_provider: SUBJECT_OPTIONS[3].label,
  client_correspondence: SUBJECT_OPTIONS[4].label,
  drafting_admin: SUBJECT_OPTIONS[5].label,
};

export const REGULATED_SUBJECT_IDS: readonly SubjectId[] = SUBJECT_OPTIONS.filter(
  (s) => s.regulated,
).map((s) => s.id);

export const QUESTION_4_PROMPT =
  'Roughly what share of those questions touch tax, pensions, FCA rules or product detail?';

export const REGULATED_SHARE_OPTIONS: readonly RegulatedShareOption[] = [
  { id: 'most', label: 'Most of them, about 3 in 4' },
  { id: 'half', label: 'About half' },
  { id: 'few', label: 'A few, about 1 in 4' },
  { id: 'almost_none', label: 'Almost none, fewer than 1 in 10' },
] as const;

export const REGULATED_SHARE_LABELS: Record<RegulatedShareBandId, string> = {
  most: REGULATED_SHARE_OPTIONS[0].label,
  half: REGULATED_SHARE_OPTIONS[1].label,
  few: REGULATED_SHARE_OPTIONS[2].label,
  almost_none: REGULATED_SHARE_OPTIONS[3].label,
};

export const QUESTION_5_PROMPT = 'Which tools?';
export const QUESTION_5_HINT = 'Select all that apply.';

export const TOOL_OPTIONS: readonly ToolOption[] = [
  { id: 'chatgpt_personal', label: 'ChatGPT or similar, on personal accounts' },
  { id: 'copilot_tenant', label: 'Copilot in our own Microsoft tenant' },
  { id: 'back_office', label: 'Something built into our back office' },
  { id: 'not_sure', label: 'Not sure' },
] as const;

export const TOOL_LABELS: Record<ToolId, string> = {
  chatgpt_personal: TOOL_OPTIONS[0].label,
  copilot_tenant: TOOL_OPTIONS[1].label,
  back_office: TOOL_OPTIONS[2].label,
  not_sure: TOOL_OPTIONS[3].label,
};

export const QUESTION_6_PROMPT =
  'Can the AI read a list of sources someone in the firm has approved?';

export const SOURCE_ACCESS_OPTIONS: readonly SingleChoiceOption<SourceAccessAnswer>[] =
  [
    { id: 'yes', label: 'Yes' },
    { id: 'no', label: 'No' },
    { id: 'not_sure', label: 'Not sure' },
  ] as const;

export const SOURCE_ACCESS_LABELS: Record<SourceAccessAnswer, string> = {
  yes: SOURCE_ACCESS_OPTIONS[0].label,
  no: SOURCE_ACCESS_OPTIONS[1].label,
  not_sure: SOURCE_ACCESS_OPTIONS[2].label,
};

export const QUESTION_7_PROMPT =
  'When an answer includes a link, does anyone open it and check it says what the answer claimed?';

export const LINK_CHECK_OPTIONS: readonly SingleChoiceOption<LinkCheckAnswer>[] =
  [
    { id: 'every_time', label: 'Every time' },
    { id: 'sometimes', label: 'Sometimes' },
    { id: 'never', label: 'Never' },
    { id: 'not_sure', label: 'Not sure' },
  ] as const;

export const LINK_CHECK_LABELS: Record<LinkCheckAnswer, string> = {
  every_time: LINK_CHECK_OPTIONS[0].label,
  sometimes: LINK_CHECK_OPTIONS[1].label,
  never: LINK_CHECK_OPTIONS[2].label,
  not_sure: LINK_CHECK_OPTIONS[3].label,
};

export const QUESTION_8_PROMPT =
  'If a client asked next month what an AI-assisted document was based on, could you show them?';

export const CLIENT_TRACE_OPTIONS: readonly SingleChoiceOption<ClientTraceAnswer>[] =
  [
    { id: 'yes_full', label: 'Yes, in full' },
    { id: 'partly', label: 'Partly' },
    { id: 'no', label: 'No' },
    { id: 'not_sure', label: 'Not sure' },
  ] as const;

export const CLIENT_TRACE_LABELS: Record<ClientTraceAnswer, string> = {
  yes_full: CLIENT_TRACE_OPTIONS[0].label,
  partly: CLIENT_TRACE_OPTIONS[1].label,
  no: CLIENT_TRACE_OPTIONS[2].label,
  not_sure: CLIENT_TRACE_OPTIONS[3].label,
};

export const QUESTION_9_PROMPT =
  'Is there anything written down about what AI must not be used for here?';

export const POLICY_OPTIONS: readonly SingleChoiceOption<PolicyAnswer>[] = [
  { id: 'yes', label: 'Yes' },
  { id: 'no', label: 'No' },
  { id: 'not_sure', label: 'Not sure' },
] as const;

export const POLICY_LABELS: Record<PolicyAnswer, string> = {
  yes: POLICY_OPTIONS[0].label,
  no: POLICY_OPTIONS[1].label,
  not_sure: POLICY_OPTIONS[2].label,
};

// ---------------------------------------------------------------------------
// Result copy
// ---------------------------------------------------------------------------

export const RESULT_HEADLINE_SUFFIX_SINGULAR =
  'answer a month on regulated subjects that, on your figures, nothing would tie back to a source.';

export const RESULT_HEADLINE_SUFFIX =
  'answers a month on regulated subjects that, on your figures, nothing would tie back to a source.';

export const RESULT_INTRO =
  'Based on what you entered, your firm may produce roughly this many AI answers on regulated subjects each month that nobody can tie to a source.';

export const RESULT_SUBJECTS_LINE = 'You said questions touch {subjects}.';

export const RESULT_ZERO_HEADLINE =
  'No untraceable regulated answers in this estimate';
export const RESULT_ZERO_BODY =
  'Based on what you entered, either few questions fall on regulated subjects or your answers suggest most answers can be tied back to a source. That does not mean there is no risk. It means this counter landed at zero with your figures.';

/** Shown below the zero headline instead of the offer block. */
export const ZERO_RESULT_BELOW_FOLD =
  'The compliance questions below may still be worth putting to your compliance officer. This page does not show a product offer when the counter lands at zero.';

export const NOT_COUNTED_HEADLINE = 'No number from these answers';
export const NOT_COUNTED_BODY =
  'This counter will not guess. At least one answer you gave is not enough to produce a count.';

export const NOT_COUNTED_REASON_UNBOUNDED_FREQUENCY =
  'You said a typical person asks more than 20 work questions a week. That is beyond what a banded question can estimate without inventing a figure.';

export const NOT_COUNTED_REASON_UNKNOWN_SOURCE_ACCESS =
  'You were not sure whether AI can read a list of approved sources. Ask whoever manages your systems or compliance records.';

export const NOT_COUNTED_REASON_UNKNOWN_LINK_CHECK =
  'You were not sure whether anyone opens links in AI answers and checks them. Ask whoever oversees how staff use AI day to day.';

export const NOT_COUNTED_CLOSING =
  'A tool that refuses to produce a number it cannot support behaves the way a grounded assistant behaves when it has no source to cite.';

export const RESULT_TEASER_TEMPLATE =
  'Based on what you entered, the area that may need attention first is {area}.';

export const SHOW_WORKING_TOGGLE_LABEL = 'Show the working';
export const SHOW_WORKING_TOGGLE_HIDE_LABEL = 'Hide the working';

export const NOT_SURE_CALLOUT_ONE =
  'One of your answers was not sure. That is worth noting before you rely on any number here.';
export const NOT_SURE_CALLOUT_MANY =
  '{count} of your answers were not sure. Those gaps are worth noting before you rely on any number here.';

export const TOOLS_PERSONAL_ACCOUNT_CALLOUT =
  'You selected tools on personal accounts. Client material may leave your firm\'s own tenant when staff use them. This callout does not change the count above.';

export const TOOLS_PERSONAL_ACCOUNT_CALLOUT_NOT_COUNTED =
  'You selected tools on personal accounts. Client material may leave your firm\'s own tenant when staff use them. This callout does not change whether a count is shown.';

export const COMPLIANCE_QUESTIONS_HEADING =
  'Questions your compliance officer may ask first';

export const OFFER_HEADING = 'What changes with a grounded assistant';
export const OFFER_BODY =
  'A Verified Assistant answers only from your signed-off source library. Every citation is checked in code before it reaches a person in your firm.';
export const OFFER_SETUP_PRICE = '£1,200 setup';
export const OFFER_MONTHLY_PRICE = '£250 a month';
export const OFFER_CTA_LABEL = 'Book a demonstration';
export const OFFER_CTA_URL = calendlyUrl;

export const EMAIL_SECTION_HEADING = 'Send yourself a copy';
export const EMAIL_SECTION_BODY =
  'Optional. Enter an email after your result is shown. Only then is anything sent from this page.';
export const EMAIL_INPUT_LABEL = 'Email address';
export const EMAIL_SUBMIT_LABEL = 'Send copy';
export const EMAIL_SUCCESS_MESSAGE =
  'Thank you. We will send the report to the address you entered.';
export const EMAIL_ERROR_MESSAGE =
  'Something went wrong. Please try again or book a demonstration instead.';

export const EMAIL_REPORT_CONTENTS = [
  'What each question is really asking',
  'What a strong answer looks like for your firm',
  'A one-page summary you can put to your compliance officer',
  'A checklist of the two artefacts you can act on',
] as const;

export const REPORT_ARTEFACTS_HEADING = 'Two artefacts you can act on';

export const REPORT_QUESTION_GUIDANCE_HEADING =
  'What each question is really asking';

export interface ReportQuestionGuidanceEntry {
  prompt: string;
  meaning: string;
  strong: string;
}

export interface ReportArtefactEntry {
  title: string;
  body: string;
}

/** Report-only guidance shown in the emailed report, not on the results screen. */
export const REPORT_QUESTION_GUIDANCE: readonly ReportQuestionGuidanceEntry[] = [
  {
    prompt: QUESTION_1_PROMPT,
    meaning:
      'This sets the scale of the estimate. A whole number you can give without asking anyone else is enough.',
    strong:
      'A figure you can stand behind for a typical week, not a peak week or a guess about contractors you never see.',
  },
  {
    prompt: QUESTION_2_PROMPT,
    meaning:
      'This turns headcount into monthly volume using the midpoint of the band you chose.',
    strong:
      'A closed band that matches how people actually work, not an open-ended "more than" when you could narrow it.',
  },
  {
    prompt: QUESTION_3_PROMPT,
    meaning:
      'Only subjects that touch tax, pensions, FCA rules or product detail feed the regulated count.',
    strong:
      'Honest selection of what staff actually ask about, including the unregulated drafting work.',
  },
  {
    prompt: QUESTION_4_PROMPT,
    meaning:
      'This is the share applied to monthly questions to estimate regulated AI answers.',
    strong:
      'A share that matches the subjects you selected, not a high share when only admin drafting comes up.',
  },
  {
    prompt: QUESTION_5_PROMPT,
    meaning:
      'Tools on personal accounts do not change the count. They flag where client material may leave your tenant.',
    strong:
      'A list you know is used, or "Not sure" if you genuinely do not know which products staff open.',
  },
  {
    prompt: QUESTION_6_PROMPT,
    meaning:
      'This decides the checked-library factor. "Not sure" means this counter will not produce a number.',
    strong:
      'Yes only if there is a signed-off list the tools can actually read. Otherwise No, and find out who would know.',
  },
  {
    prompt: QUESTION_7_PROMPT,
    meaning:
      'This sets the manual link-check rate. Manual checking scores low because it leaves no record for a client later.',
    strong:
      'An answer that names how often it happens in practice, not what policy says should happen.',
  },
  {
    prompt: QUESTION_8_PROMPT,
    meaning:
      'This does not change the arithmetic. It surfaces a compliance question worth putting to your compliance officer.',
    strong:
      'Yes only if you could retrieve the sources without reconstructing the chat from memory.',
  },
  {
    prompt: QUESTION_9_PROMPT,
    meaning:
      'This does not change the arithmetic. It shows whether boundaries exist in writing.',
    strong:
      'Yes with a document people have actually read recently, or No if nothing exists yet.',
  },
] as const;

export const REPORT_ARTEFACTS: readonly ReportArtefactEntry[] = [
  {
    title: 'A signed-off source library',
    body: 'A list of sources someone in the firm has approved before AI can use them, with a named owner for additions and removals.',
  },
  {
    title: 'A retrieval trail for each answer',
    body: 'A record of which sources an AI-assisted document drew on, so a client or compliance officer can be shown the basis without reconstructing a chat.',
  },
] as const;

export const EMAIL_SUBJECT = `Your ${PAGE_TITLE} report`;

export const EMAIL_GREETING =
  'Here is the report from the unverified answer count.';

export const EMAIL_GREETING_COMPLIANCE_OFFICER =
  'A colleague asked us to send you this report.';

export const EMAIL_OPEN_REPORT_LABEL = 'Open your report here:';

export const EMAIL_LINK_EXPIRY_NOTE =
  'The link expires after 30 days. The report includes:';

export const EMAIL_BEYOND_SCREEN_NOTE =
  'The count and the working stay on the page you already saw. This report adds the detail that sits behind them.';

export const EMAIL_DEMO_PROMPT =
  'If you want to see how a grounded assistant changes that number:';

export const EMAIL_DEMO_CTA_LABEL = 'Book a demonstration';

export const EMAIL_SIGNATURE_NAME = 'Terry Martin';

export const EMAIL_SIGNATURE_ROLE = 'Founder, Wrigital';

export const EMAIL_FOOTER_DISCLAIMER =
  'This is an estimate from the figures entered on the page, not an assessment of your firm. What is acceptable remains your compliance officer\'s judgement.';

export const EMAIL_COMPLIANCE_OFFICER_SUBJECT_SUFFIX = '(shared with you)';

export const MARKETING_CONSENT_LABEL =
  'Send me occasional updates about grounded AI for advice firms';
export const MARKETING_CONSENT_DEFAULT = false;
export const CONSENT_WORDING_VERSION = '1.0';

export const COMPLIANCE_OFFICER_EMAIL_LABEL =
  'Send a copy to your compliance officer (optional)';
export const COMPLIANCE_OFFICER_EMAIL_HINT =
  'Leave blank if you only want the report yourself.';

export const REPORT_EXPIRED_HEADLINE = 'This report link has expired';
export const REPORT_EXPIRED_BODY =
  'Report links expire after a set period. Run the counter again from the main page if you still need a copy.';

export const HONEYPOT_FIELD_NAME = 'website';

export const DISCLAIMER_LINE =
  'This is an estimate from your own figures, not an assessment of your firm. What is acceptable here remains your compliance officer\'s judgement.';

export const BROWSER_ONLY_REMINDER =
  'Your answers stayed in this browser until you chose to send an email. When you request a copy, your answers travel with it so the count can be checked again on our side.';

// ---------------------------------------------------------------------------
// Working panel step labels
// ---------------------------------------------------------------------------

export const WORKING_STEP_MONTHLY_QUESTIONS = 'Monthly work questions';
export const WORKING_STEP_NO_REGULATED_SUBJECT = 'No regulated subject selected';
export const WORKING_STEP_REGULATED_SHARE = 'Share on regulated subjects';
export const WORKING_STEP_REGULATED_ANSWERS = 'Regulated AI answers per month';
export const WORKING_STEP_MANUAL_CHECK_RATE = 'Manual link-check rate applied';
export const WORKING_STEP_CHECKED_LIBRARY_FACTOR =
  'Checked source library factor applied';
export const WORKING_STEP_PROTECTION =
  'Higher of manual link checking and a checked source library';
export const WORKING_STEP_UNTRACEABLE = 'Untraceable regulated answers per month';

export const WORKING_EXPRESSION_MONTHLY =
  'round(people × questions per week (midpoint of band) × weeks per month)';
export const WORKING_EXPRESSION_NO_REGULATED_SUBJECT =
  'none of the subjects you selected are regulated';
export const WORKING_EXPRESSION_REGULATED_SHARE =
  'regulated share band midpoint from your answer';
export const WORKING_EXPRESSION_REGULATED_ANSWERS =
  'round(monthly questions × regulated share)';
export const WORKING_EXPRESSION_MANUAL_CHECK =
  'manual link-check rate from your answer (see assumptions note)';
export const WORKING_EXPRESSION_CHECKED_LIBRARY =
  'checked source library factor from your answer (see assumptions note)';
export const WORKING_EXPRESSION_PROTECTION =
  'max(manual link-check rate, checked library factor)';
export const WORKING_EXPRESSION_UNTRACEABLE =
  'round(regulated answers × (1 − protection factor))';

/** Midpoints used in tests to confirm no fallback keys exist for unknown answers. */
export const COUNTABLE_FREQUENCY_MIDPOINTS: Record<
  CountableFrequencyBandId,
  number
> = {
  '1_2': FREQUENCY_MIDPOINT_1_2,
  '3_5': FREQUENCY_MIDPOINT_3_5,
  '6_10': FREQUENCY_MIDPOINT_6_10,
  '11_20': FREQUENCY_MIDPOINT_11_20,
};

// ---------------------------------------------------------------------------
// Compliance-officer questions (Q6–Q9), ranked by severity when answers are weak
// ---------------------------------------------------------------------------

export type ComplianceQuestionKey = 'q6' | 'q7' | 'q8' | 'q9';

type ComplianceAnswerByKey = {
  q6: SourceAccessAnswer;
  q7: LinkCheckAnswer;
  q8: ClientTraceAnswer;
  q9: PolicyAnswer;
};

export type ComplianceQuestionEntry<
  K extends ComplianceQuestionKey = ComplianceQuestionKey,
> = {
  questionKey: K;
  answer: ComplianceAnswerByKey[K];
  severity: number;
  text: string;
};

export const COMPLIANCE_QUESTIONS_BY_ANSWER: {
  [K in ComplianceQuestionKey]: readonly ComplianceQuestionEntry<K>[];
} = {
  q6: [
    {
      questionKey: 'q6',
      answer: 'no',
      severity: 90,
      text: 'Who keeps the list of sources that staff are allowed to use when they ask AI a work question?',
    },
    {
      questionKey: 'q6',
      answer: 'not_sure',
      severity: 70,
      text: 'Who would know whether AI tools in this firm can read from a list of approved sources?',
    },
    {
      questionKey: 'q6',
      answer: 'yes',
      severity: 11,
      text: 'When someone adds a new source to the approved list, who signs it off before AI can use it?',
    },
  ],
  q7: [
    {
      questionKey: 'q7',
      answer: 'never',
      severity: 95,
      text: 'What would need to happen before someone opened a link in an AI answer and checked it against what was claimed?',
    },
    {
      questionKey: 'q7',
      answer: 'not_sure',
      severity: 75,
      text: 'When an AI answer includes a link, who is responsible for checking it says what the answer claimed?',
    },
    {
      questionKey: 'q7',
      answer: 'sometimes',
      severity: 50,
      text: 'On what occasions does someone open a link in an AI answer and check it against what was claimed?',
    },
    {
      questionKey: 'q7',
      answer: 'every_time',
      severity: 15,
      text: 'Who checks links in AI answers, and where is that recorded?',
    },
  ],
  q8: [
    {
      questionKey: 'q8',
      answer: 'no',
      severity: 100,
      text: 'What could we put in front of a client who asked what an AI-assisted document was based on?',
    },
    {
      questionKey: 'q8',
      answer: 'not_sure',
      severity: 80,
      text: 'If a client asked what an AI-assisted document was based on, who would know where to look?',
    },
    {
      questionKey: 'q8',
      answer: 'partly',
      severity: 55,
      text: 'What could you show a client if they asked what an AI-assisted document was based on?',
    },
    {
      questionKey: 'q8',
      answer: 'yes_full',
      severity: 10,
      text: 'How long would it take to gather the sources behind an AI-assisted document if a client asked?',
    },
  ],
  q9: [
    {
      questionKey: 'q9',
      answer: 'no',
      severity: 60,
      text: 'Who would need to write down what AI must not be used for here, and what should it cover?',
    },
    {
      questionKey: 'q9',
      answer: 'not_sure',
      severity: 45,
      text: 'Who would know if there is a written rule about what AI must not be used for here?',
    },
    {
      questionKey: 'q9',
      answer: 'yes',
      severity: 12,
      text: 'When did someone last read the written rules about what AI must not be used for?',
    },
  ],
};

export const PRIORITISED_COMPLIANCE_QUESTION_COUNT = 3;

export type NotCountedReason =
  | 'unbounded_frequency'
  | 'unknown_source_access'
  | 'unknown_link_check';

export const NOT_COUNTED_REASON_COPY: Record<NotCountedReason, string> = {
  unbounded_frequency: NOT_COUNTED_REASON_UNBOUNDED_FREQUENCY,
  unknown_source_access: NOT_COUNTED_REASON_UNKNOWN_SOURCE_ACCESS,
  unknown_link_check: NOT_COUNTED_REASON_UNKNOWN_LINK_CHECK,
};

export function getNotCountedReasonCopy(reason: NotCountedReason): string {
  return NOT_COUNTED_REASON_COPY[reason];
}

const COMPLIANCE_AREA_BY_KEY: Record<ComplianceQuestionKey, string> = {
  q6: 'whether AI can read approved sources',
  q7: 'what happens when an AI answer includes a link',
  q8: 'what you could show a client about an AI-assisted document',
  q9: 'written rules on what AI must not be used for',
};

// ---------------------------------------------------------------------------
// Form state and calculation
// ---------------------------------------------------------------------------

export interface UnverifiedAnswersInput {
  people: number | null;
  frequencyBand: FrequencyBandId | null;
  subjects: SubjectId[];
  regulatedShareBand: RegulatedShareBandId | null;
  tools: ToolId[];
  sourceAccess: SourceAccessAnswer | null;
  linkCheck: LinkCheckAnswer | null;
  clientTrace: ClientTraceAnswer | null;
  policy: PolicyAnswer | null;
}

export interface CompleteUnverifiedAnswersInput {
  people: number;
  frequencyBand: FrequencyBandId;
  subjects: SubjectId[];
  regulatedShareBand: RegulatedShareBandId;
  tools: ToolId[];
  sourceAccess: SourceAccessAnswer;
  linkCheck: LinkCheckAnswer;
  clientTrace: ClientTraceAnswer;
  policy: PolicyAnswer;
}

export interface WorkingStep {
  name: string;
  expression: string;
  substitution: string;
  result?: string;
  notDoneReason?: string;
}

interface UnverifiedAnswersResultBase {
  notSureCount: number;
  notSureCallout: string | null;
  personalAccountCallout: string | null;
  subjectsLine: string;
  hasRegulatedSubject: boolean;
  prioritisedComplianceQuestions: string[];
  workingSteps: WorkingStep[];
  assumptionsNote: string;
  teaser: string;
  showOffer: boolean;
}

export interface CountedUnverifiedAnswersResult
  extends UnverifiedAnswersResultBase {
  status: 'counted';
  untraceable: number;
  monthlyQuestions: number;
  regulatedShare: number;
  regulatedAnswers: number;
  manualCheckRate: number;
  checkedLibraryFactor: number;
  protectionFactor: number;
  headlineSuffix: string;
  isZeroResult: boolean;
}

export interface NotCountedUnverifiedAnswersResult
  extends UnverifiedAnswersResultBase {
  status: 'not_counted';
  reasons: readonly NotCountedReason[];
}

export type UnverifiedAnswersResult =
  | CountedUnverifiedAnswersResult
  | NotCountedUnverifiedAnswersResult;

export class IncompleteUnverifiedAnswersError extends Error {
  constructor() {
    super('All questions must be answered before calculating an estimate.');
    this.name = 'IncompleteUnverifiedAnswersError';
  }
}

const REGULATED_SHARE_MIDPOINTS: Record<RegulatedShareBandId, number> = {
  most: REGULATED_SHARE_MOST,
  half: REGULATED_SHARE_HALF,
  few: REGULATED_SHARE_FEW,
  almost_none: REGULATED_SHARE_ALMOST_NONE,
};

const MANUAL_CHECK_RATES: Record<KnownLinkCheckAnswer, number> = {
  every_time: MANUAL_CHECK_RATE_EVERY_TIME,
  sometimes: MANUAL_CHECK_RATE_SOMETIMES,
  never: MANUAL_CHECK_RATE_NEVER,
};

const CHECKED_LIBRARY_FACTORS: Record<KnownSourceAccessAnswer, number> = {
  yes: CHECKED_LIBRARY_FACTOR_YES,
  no: CHECKED_LIBRARY_FACTOR_NO,
};

export function isValidPeople(value: number | null): value is number {
  return (
    value !== null &&
    Number.isFinite(value) &&
    Number.isInteger(value) &&
    value >= MIN_PEOPLE &&
    value <= MAX_PEOPLE
  );
}

export function isCountedResult(
  result: UnverifiedAnswersResult,
): result is CountedUnverifiedAnswersResult {
  return result.status === 'counted';
}

export function roundMonthlyQuestions(
  people: number,
  frequencyMidpoint: number,
): number {
  return Math.round(people * frequencyMidpoint * WEEKS_PER_MONTH);
}

export function roundRegulatedShare(share: number): number {
  return Math.round(share * 100) / 100;
}

export function parseFormattedNumber(value: string): number {
  return Number(value.replace(/,/g, ''));
}

function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString('en-GB', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatRate(value: number): string {
  return value.toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Oxford-comma list for result copy. */
export function formatSubjectList(subjects: SubjectId[]): string {
  const labels = subjects.map((id) => SUBJECT_LABELS[id]);
  if (labels.length === 0) return '';
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]}`;
}

export function selectedRegulatedSubjects(subjects: SubjectId[]): SubjectId[] {
  return subjects.filter((id) => REGULATED_SUBJECT_IDS.includes(id));
}

export function inputHasRegulatedSubject(subjects: SubjectId[]): boolean {
  return selectedRegulatedSubjects(subjects).length > 0;
}

export function buildSubjectsLine(subjects: SubjectId[]): string {
  const formatted = formatSubjectList(selectedRegulatedSubjects(subjects));
  if (!formatted) return '';
  return RESULT_SUBJECTS_LINE.replace('{subjects}', formatted);
}

function countNotSureAnswers(input: CompleteUnverifiedAnswersInput): number {
  let count = 0;
  if (input.tools.includes('not_sure')) count += 1;
  if (input.sourceAccess === 'not_sure') count += 1;
  if (input.linkCheck === 'not_sure') count += 1;
  if (input.clientTrace === 'not_sure') count += 1;
  if (input.policy === 'not_sure') count += 1;
  return count;
}

function notSureCallout(count: number): string | null {
  if (count === 0) return null;
  if (count === 1) return NOT_SURE_CALLOUT_ONE;
  return NOT_SURE_CALLOUT_MANY.replace('{count}', String(count));
}

function collectNotCountedReasons(
  input: CompleteUnverifiedAnswersInput,
): NotCountedReason[] {
  const reasons: NotCountedReason[] = [];

  if (input.frequencyBand === 'more_than_20') {
    reasons.push('unbounded_frequency');
  }
  if (input.sourceAccess === 'not_sure') {
    reasons.push('unknown_source_access');
  }
  if (input.linkCheck === 'not_sure') {
    reasons.push('unknown_link_check');
  }

  return reasons;
}

function selectComplianceQuestions(
  input: Pick<
    CompleteUnverifiedAnswersInput,
    'sourceAccess' | 'linkCheck' | 'clientTrace' | 'policy'
  >,
): string[] {
  const answers: ComplianceQuestionEntry[] = [];

  const q6 = COMPLIANCE_QUESTIONS_BY_ANSWER.q6.find(
    (e) => e.answer === input.sourceAccess,
  );
  if (q6) answers.push(q6);

  const q7 = COMPLIANCE_QUESTIONS_BY_ANSWER.q7.find(
    (e) => e.answer === input.linkCheck,
  );
  if (q7) answers.push(q7);

  const q8 = COMPLIANCE_QUESTIONS_BY_ANSWER.q8.find(
    (e) => e.answer === input.clientTrace,
  );
  if (q8) answers.push(q8);

  const q9 = COMPLIANCE_QUESTIONS_BY_ANSWER.q9.find(
    (e) => e.answer === input.policy,
  );
  if (q9) answers.push(q9);

  return answers
    .sort((a, b) => b.severity - a.severity)
    .slice(0, PRIORITISED_COMPLIANCE_QUESTION_COUNT)
    .map((entry) => entry.text);
}

function buildTeaser(
  input: Pick<
    CompleteUnverifiedAnswersInput,
    'sourceAccess' | 'linkCheck' | 'clientTrace' | 'policy'
  >,
): string {
  const answers: ComplianceQuestionEntry[] = [
    COMPLIANCE_QUESTIONS_BY_ANSWER.q6.find(
      (e) => e.answer === input.sourceAccess,
    )!,
    COMPLIANCE_QUESTIONS_BY_ANSWER.q7.find(
      (e) => e.answer === input.linkCheck,
    )!,
    COMPLIANCE_QUESTIONS_BY_ANSWER.q8.find(
      (e) => e.answer === input.clientTrace,
    )!,
    COMPLIANCE_QUESTIONS_BY_ANSWER.q9.find((e) => e.answer === input.policy)!,
  ];

  const weakest = answers.sort((a, b) => b.severity - a.severity)[0];
  const area = COMPLIANCE_AREA_BY_KEY[weakest.questionKey];

  return RESULT_TEASER_TEMPLATE.replace('{area}', area);
}

export function isComplete(
  input: UnverifiedAnswersInput,
): input is CompleteUnverifiedAnswersInput {
  return (
    isValidPeople(input.people) &&
    input.frequencyBand !== null &&
    input.subjects.length > 0 &&
    input.regulatedShareBand !== null &&
    input.tools.length > 0 &&
    input.sourceAccess !== null &&
    input.linkCheck !== null &&
    input.clientTrace !== null &&
    input.policy !== null
  );
}

/** Toggle a tool option; "not sure" is mutually exclusive with all other options. */
export function toggleToolSelection(
  current: ToolId[],
  toggled: ToolId,
): ToolId[] {
  if (toggled === 'not_sure') {
    return current.includes('not_sure') ? [] : ['not_sure'];
  }

  const withoutNotSure = current.filter((id) => id !== 'not_sure');
  if (withoutNotSure.includes(toggled)) {
    return withoutNotSure.filter((id) => id !== toggled);
  }

  return [...withoutNotSure, toggled];
}

export function getFrequencyMidpoint(
  band: CountableFrequencyBandId,
): number {
  return COUNTABLE_FREQUENCY_MIDPOINTS[band];
}

export function getRegulatedShareMidpoint(band: RegulatedShareBandId): number {
  return REGULATED_SHARE_MIDPOINTS[band];
}

export function getManualCheckRate(answer: KnownLinkCheckAnswer): number {
  return MANUAL_CHECK_RATES[answer];
}

export function getCheckedLibraryFactor(
  answer: KnownSourceAccessAnswer,
): number {
  return CHECKED_LIBRARY_FACTORS[answer];
}

export function isCountableFrequencyBand(
  band: FrequencyBandId,
): band is CountableFrequencyBandId {
  return band !== 'more_than_20';
}

export function isKnownLinkCheckAnswer(
  answer: LinkCheckAnswer,
): answer is KnownLinkCheckAnswer {
  return answer !== 'not_sure';
}

export function isKnownSourceAccessAnswer(
  answer: SourceAccessAnswer,
): answer is KnownSourceAccessAnswer {
  return answer !== 'not_sure';
}

/** Human-readable label for the frequency band used in working copy. */
export function describeFrequencyBand(band: CountableFrequencyBandId): string {
  return `${FREQUENCY_LABELS[band]} (${formatNumber(getFrequencyMidpoint(band), 1)} midpoint)`;
}

function buildMonthlyWorkingSubstitution(
  people: number,
  band: CountableFrequencyBandId,
): string {
  return `round(${formatNumber(people)} × ${describeFrequencyBand(band)} × ${formatNumber(WEEKS_PER_MONTH, 1)})`;
}

function resolveHeadlineSuffix(untraceable: number): string {
  return untraceable === 1
    ? RESULT_HEADLINE_SUFFIX_SINGULAR
    : RESULT_HEADLINE_SUFFIX;
}

function resolvePersonalAccountCallout(
  input: CompleteUnverifiedAnswersInput,
): string | null {
  if (!input.tools.includes('chatgpt_personal')) {
    return null;
  }

  if (collectNotCountedReasons(input).length > 0) {
    return TOOLS_PERSONAL_ACCOUNT_CALLOUT_NOT_COUNTED;
  }

  return TOOLS_PERSONAL_ACCOUNT_CALLOUT;
}

function buildSharedResultFields(
  input: CompleteUnverifiedAnswersInput,
): Omit<
  UnverifiedAnswersResultBase,
  'workingSteps' | 'showOffer'
> {
  const hasRegulatedSubject = inputHasRegulatedSubject(input.subjects);

  return {
    notSureCount: countNotSureAnswers(input),
    notSureCallout: notSureCallout(countNotSureAnswers(input)),
    personalAccountCallout: resolvePersonalAccountCallout(input),
    subjectsLine: buildSubjectsLine(input.subjects),
    hasRegulatedSubject,
    prioritisedComplianceQuestions: selectComplianceQuestions({
      sourceAccess: input.sourceAccess,
      linkCheck: input.linkCheck,
      clientTrace: input.clientTrace,
      policy: input.policy,
    }),
    assumptionsNote: ASSUMPTIONS_NOTE,
    teaser: buildTeaser({
      sourceAccess: input.sourceAccess,
      linkCheck: input.linkCheck,
      clientTrace: input.clientTrace,
      policy: input.policy,
    }),
  };
}

function buildVolumeWorkingSteps(
  input: CompleteUnverifiedAnswersInput,
  people: number,
): {
  workingSteps: WorkingStep[];
  monthlyQuestions: number;
  regulatedShare: number;
  regulatedAnswers: number;
} {
  if (!isCountableFrequencyBand(input.frequencyBand)) {
    throw new Error('Volume steps require a countable frequency band.');
  }

  const band = input.frequencyBand;
  const frequencyMidpoint = getFrequencyMidpoint(band);
  const monthlyQuestions = roundMonthlyQuestions(people, frequencyMidpoint);

  const workingSteps: WorkingStep[] = [
    {
      name: WORKING_STEP_MONTHLY_QUESTIONS,
      expression: WORKING_EXPRESSION_MONTHLY,
      substitution: buildMonthlyWorkingSubstitution(people, band),
      result: formatNumber(monthlyQuestions),
    },
  ];

  const hasRegulatedSubject = inputHasRegulatedSubject(input.subjects);

  if (!hasRegulatedSubject) {
    workingSteps.push({
      name: WORKING_STEP_NO_REGULATED_SUBJECT,
      expression: WORKING_EXPRESSION_NO_REGULATED_SUBJECT,
      substitution: WORKING_EXPRESSION_NO_REGULATED_SUBJECT,
      result: '0.00',
    });

    workingSteps.push({
      name: WORKING_STEP_REGULATED_SHARE,
      expression: WORKING_EXPRESSION_REGULATED_SHARE,
      substitution: 'no regulated subject selected → 0.00',
      result: '0.00',
    });

    workingSteps.push({
      name: WORKING_STEP_REGULATED_ANSWERS,
      expression: WORKING_EXPRESSION_REGULATED_ANSWERS,
      substitution: `round(${formatNumber(monthlyQuestions)} × 0.00)`,
      result: '0',
    });

    return {
      workingSteps,
      monthlyQuestions,
      regulatedShare: 0,
      regulatedAnswers: 0,
    };
  }

  const regulatedShare = roundRegulatedShare(
    getRegulatedShareMidpoint(input.regulatedShareBand),
  );
  const regulatedAnswers = Math.round(monthlyQuestions * regulatedShare);
  const shareMidpointDisplay = formatRate(regulatedShare);

  workingSteps.push({
    name: WORKING_STEP_REGULATED_SHARE,
    expression: WORKING_EXPRESSION_REGULATED_SHARE,
    substitution: `${REGULATED_SHARE_LABELS[input.regulatedShareBand]} → ${shareMidpointDisplay}`,
    result: shareMidpointDisplay,
  });

  workingSteps.push({
    name: WORKING_STEP_REGULATED_ANSWERS,
    expression: WORKING_EXPRESSION_REGULATED_ANSWERS,
    substitution: `round(${formatNumber(monthlyQuestions)} × ${shareMidpointDisplay})`,
    result: formatNumber(regulatedAnswers),
  });

  return {
    workingSteps,
    monthlyQuestions,
    regulatedShare,
    regulatedAnswers,
  };
}

function appendProtectionWorkingSteps(
  workingSteps: WorkingStep[],
  input: CompleteUnverifiedAnswersInput,
  regulatedAnswers: number,
): {
  manualCheckRate: number;
  checkedLibraryFactor: number;
  protectionFactor: number;
  untraceable: number;
} {
  if (!isKnownLinkCheckAnswer(input.linkCheck)) {
    throw new Error('Protection steps require a known link-check answer.');
  }
  if (!isKnownSourceAccessAnswer(input.sourceAccess)) {
    throw new Error('Protection steps require a known source-access answer.');
  }

  const manualCheckRate = getManualCheckRate(input.linkCheck);
  const checkedLibraryFactor = getCheckedLibraryFactor(input.sourceAccess);
  const protectionFactor = Math.max(manualCheckRate, checkedLibraryFactor);
  const untraceable = Math.round(regulatedAnswers * (1 - protectionFactor));

  workingSteps.push({
    name: WORKING_STEP_MANUAL_CHECK_RATE,
    expression: WORKING_EXPRESSION_MANUAL_CHECK,
    substitution: `${LINK_CHECK_LABELS[input.linkCheck]} → ${formatRate(manualCheckRate)} (see assumptions note)`,
    result: formatRate(manualCheckRate),
  });

  workingSteps.push({
    name: WORKING_STEP_CHECKED_LIBRARY_FACTOR,
    expression: WORKING_EXPRESSION_CHECKED_LIBRARY,
    substitution: `${SOURCE_ACCESS_LABELS[input.sourceAccess]} → ${formatRate(checkedLibraryFactor)} (see assumptions note)`,
    result: formatRate(checkedLibraryFactor),
  });

  workingSteps.push({
    name: WORKING_STEP_PROTECTION,
    expression: WORKING_EXPRESSION_PROTECTION,
    substitution: `max(${formatRate(manualCheckRate)}, ${formatRate(checkedLibraryFactor)})`,
    result: formatRate(protectionFactor),
  });

  workingSteps.push({
    name: WORKING_STEP_UNTRACEABLE,
    expression: WORKING_EXPRESSION_UNTRACEABLE,
    substitution: `round(${formatNumber(regulatedAnswers)} × (1 − ${formatRate(protectionFactor)}))`,
    result: formatNumber(untraceable),
  });

  return {
    manualCheckRate,
    checkedLibraryFactor,
    protectionFactor,
    untraceable,
  };
}

function appendNotDoneStep(
  workingSteps: WorkingStep[],
  reason: NotCountedReason,
): void {
  const stepByReason: Record<
    NotCountedReason,
    Pick<WorkingStep, 'name' | 'expression'>
  > = {
    unbounded_frequency: {
      name: WORKING_STEP_MONTHLY_QUESTIONS,
      expression: WORKING_EXPRESSION_MONTHLY,
    },
    unknown_link_check: {
      name: WORKING_STEP_MANUAL_CHECK_RATE,
      expression: WORKING_EXPRESSION_MANUAL_CHECK,
    },
    unknown_source_access: {
      name: WORKING_STEP_CHECKED_LIBRARY_FACTOR,
      expression: WORKING_EXPRESSION_CHECKED_LIBRARY,
    },
  };

  const step = stepByReason[reason];

  workingSteps.push({
    name: step.name,
    expression: step.expression,
    substitution: NOT_COUNTED_REASON_COPY[reason],
    notDoneReason: NOT_COUNTED_REASON_COPY[reason],
  });
}

export function calculateUnverifiedAnswers(
  rawInput: UnverifiedAnswersInput,
): UnverifiedAnswersResult {
  if (!isComplete(rawInput)) {
    throw new IncompleteUnverifiedAnswersError();
  }

  const shared = buildSharedResultFields(rawInput);
  const reasons = collectNotCountedReasons(rawInput);
  const people = rawInput.people;

  if (reasons.includes('unbounded_frequency')) {
    const workingSteps: WorkingStep[] = [
      {
        name: WORKING_STEP_MONTHLY_QUESTIONS,
        expression: WORKING_EXPRESSION_MONTHLY,
        substitution: `${FREQUENCY_LABELS.more_than_20}: no midpoint assigned`,
        notDoneReason: NOT_COUNTED_REASON_UNBOUNDED_FREQUENCY,
      },
    ];

    return {
      status: 'not_counted',
      reasons,
      ...shared,
      workingSteps,
      showOffer: true,
    };
  }

  const volume = buildVolumeWorkingSteps(rawInput, people);
  const workingSteps = [...volume.workingSteps];

  if (reasons.length > 0) {
    if (reasons.includes('unknown_link_check')) {
      appendNotDoneStep(workingSteps, 'unknown_link_check');
    } else if (isKnownLinkCheckAnswer(rawInput.linkCheck)) {
      const manualCheckRate = getManualCheckRate(rawInput.linkCheck);
      workingSteps.push({
        name: WORKING_STEP_MANUAL_CHECK_RATE,
        expression: WORKING_EXPRESSION_MANUAL_CHECK,
        substitution: `${LINK_CHECK_LABELS[rawInput.linkCheck]} → ${formatRate(manualCheckRate)} (see assumptions note)`,
        result: formatRate(manualCheckRate),
      });
      appendNotDoneStep(workingSteps, 'unknown_source_access');
    }

    return {
      status: 'not_counted',
      reasons,
      ...shared,
      workingSteps,
      showOffer: true,
    };
  }

  const protection = appendProtectionWorkingSteps(
    workingSteps,
    rawInput,
    volume.regulatedAnswers,
  );

  const isZeroResult =
    volume.regulatedAnswers === 0 || protection.untraceable === 0;

  return {
    status: 'counted',
    ...shared,
    workingSteps,
    monthlyQuestions: volume.monthlyQuestions,
    regulatedShare: volume.regulatedShare,
    regulatedAnswers: volume.regulatedAnswers,
    manualCheckRate: protection.manualCheckRate,
    checkedLibraryFactor: protection.checkedLibraryFactor,
    protectionFactor: protection.protectionFactor,
    untraceable: protection.untraceable,
    headlineSuffix: resolveHeadlineSuffix(protection.untraceable),
    isZeroResult,
    showOffer: !isZeroResult,
  };
}

/** Default form values for a fresh session. */
export const DEFAULT_UNVERIFIED_ANSWERS_INPUT: UnverifiedAnswersInput = {
  people: null,
  frequencyBand: null,
  subjects: [],
  regulatedShareBand: null,
  tools: [],
  sourceAccess: null,
  linkCheck: null,
  clientTrace: null,
  policy: null,
};
