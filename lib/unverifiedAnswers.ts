import { calendlyUrl } from '@/lib/site';

/**
 * Server routes for this tool must post the eleven answers and run
 * calculateUnverifiedAnswers server-side. Do not accept a pre-rendered report
 * or a client-supplied count (see app/api/uk-lead-capture/route.ts for the
 * pattern to avoid).
 *
 * The two PI questions are recorded and drive report copy only. They must never
 * appear in a factor, a working step or the count.
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

export const TOTAL_QUESTIONS = 11;

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
  'Eleven questions. A plain count of how many AI answers on regulated subjects your firm may produce each month that nobody can trace to a source.';

export const INTRO_HEADLINE = 'How many AI answers are untraceable?';
export const INTRO_BODY =
  'Answer eleven questions about how your firm uses AI today. You will get an estimate based on what you enter. Nothing is sent anywhere until you choose to request a copy by email.';
export const INTRO_CTA = 'Start';

export const PRIVACY_NOTE =
  'Your answers stay in this browser until you request a copy by email. They are not sent to us or to any AI service before then.';

export const PROGRESS_LABEL = 'Question {current} of {total}';
export const BACK_BUTTON_LABEL = 'Back';
export const NEXT_BUTTON_LABEL = 'Next';
export const SEE_RESULT_BUTTON_LABEL = 'See my estimate';

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

/** Recorded for the report only. Never used in the count. */
export type PiDisclosureAnswer = 'yes' | 'no' | 'not_sure';

/** Recorded for the report only. Orders the report, never the count. */
export type PiRenewalMonthId =
  | 'january'
  | 'february'
  | 'march'
  | 'april'
  | 'may'
  | 'june'
  | 'july'
  | 'august'
  | 'september'
  | 'october'
  | 'november'
  | 'december'
  | 'not_sure';

export type KnownPiRenewalMonthId = Exclude<PiRenewalMonthId, 'not_sure'>;

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
  'How many questions does each employee ask in a typical week?';

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
  'Does AI have read access to a list of approved sources?';

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
  'Have AI use policies been documented?';

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

export const QUESTION_10_PROMPT =
  'Have you told your PI insurer how the firm uses AI?';
export const QUESTION_10_HINT =
  'This does not change the count. It decides what the report gives you.';

export const PI_DISCLOSURE_OPTIONS: readonly SingleChoiceOption<PiDisclosureAnswer>[] =
  [
    { id: 'yes', label: 'Yes' },
    { id: 'no', label: 'No' },
    { id: 'not_sure', label: 'Not sure' },
  ] as const;

export const PI_DISCLOSURE_LABELS: Record<PiDisclosureAnswer, string> = {
  yes: PI_DISCLOSURE_OPTIONS[0].label,
  no: PI_DISCLOSURE_OPTIONS[1].label,
  not_sure: PI_DISCLOSURE_OPTIONS[2].label,
};

export const QUESTION_11_PROMPT = 'Which month does your PI cover renew?';
export const QUESTION_11_HINT =
  'This does not change the count. It decides the order of the report.';

export const PI_RENEWAL_MONTH_OPTIONS: readonly SingleChoiceOption<PiRenewalMonthId>[] =
  [
    { id: 'january', label: 'January' },
    { id: 'february', label: 'February' },
    { id: 'march', label: 'March' },
    { id: 'april', label: 'April' },
    { id: 'may', label: 'May' },
    { id: 'june', label: 'June' },
    { id: 'july', label: 'July' },
    { id: 'august', label: 'August' },
    { id: 'september', label: 'September' },
    { id: 'october', label: 'October' },
    { id: 'november', label: 'November' },
    { id: 'december', label: 'December' },
    { id: 'not_sure', label: 'Not sure' },
  ] as const;

export const PI_RENEWAL_MONTH_LABELS: Record<PiRenewalMonthId, string> = {
  january: 'January',
  february: 'February',
  march: 'March',
  april: 'April',
  may: 'May',
  june: 'June',
  july: 'July',
  august: 'August',
  september: 'September',
  october: 'October',
  november: 'November',
  december: 'December',
  not_sure: 'Not sure',
};

/** Calendar position of each named renewal month, January being 0. */
export const PI_RENEWAL_MONTH_INDEX: Record<KnownPiRenewalMonthId, number> = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
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

/** Shown below the zero headline. */
export const ZERO_RESULT_BELOW_FOLD =
  'That is what your own figures produce. It is not a clean bill of health, and the questions in the report are still worth putting to your compliance officer.';

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

/**
 * Second teaser line, shown only when the firm has not told its PI insurer how
 * it uses AI. Names the deliverable. Does not deliver it.
 */
export const PI_TEASER_WITH_MONTH_TEMPLATE =
  'Your PI cover renews in {month}. The report includes a paragraph written from your own figures that you can put in front of your insurer or broker.';

export const PI_TEASER_WITHOUT_MONTH =
  'You were not sure when your PI cover renews. The report includes a paragraph written from your own figures that you can put in front of your insurer or broker.';

/** Verbatim boundary line. Shown wherever the disclosure paragraph is named. */
export const PI_BOUNDARY_LINE =
  'This is not a disclosure. It does not satisfy any insurer, and it does not tell you what to declare.';

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
export const OFFER_CTA_LABEL = 'Book a call';
export const OFFER_CTA_URL = calendlyUrl;

export const EMAIL_SECTION_HEADING = 'Get the four things this page does not show';
export const EMAIL_SECTION_BODY =
  'The count and the working above are yours already. The report adds four things: a paragraph written from your own figures that you can put in front of your insurer or broker, the three questions to answer first with what a good answer looks like for each, what to do about them without hiring anyone, and the free ICO and FCA material named so you can read it yourself.';
export const EMAIL_INPUT_LABEL = 'Email address';
export const EMAIL_SUBMIT_LABEL = 'Send the report';
export const EMAIL_SUCCESS_MESSAGE =
  'Thank you. We will send the report to the address you entered.';
export const EMAIL_ERROR_MESSAGE =
  'Something went wrong. Please try again or book a call instead.';

export const EMAIL_REPORT_CONTENTS = [
  'A paragraph written from your own figures that you can put in front of your insurer or broker',
  'The three questions to answer first, with what a good answer looks like for each',
  'What to do about them without hiring anyone',
  'The free ICO and FCA material, named so you can read it yourself',
] as const;

export const FIRM_NAME_LABEL =
  'Add your firm name so the report is headed with it.';
export const FIRM_NAME_PLACEHOLDER = 'Firm name (optional)';
export const MAX_FIRM_NAME_LENGTH = 120;

// ---------------------------------------------------------------------------
// Emailed report copy. None of this appears on the result screen.
// ---------------------------------------------------------------------------

export const REPORT_HEADING_TEMPLATE = '{firmName}: the unverified answer count';
export const REPORT_HEADING_NO_FIRM_NAME = 'The unverified answer count';
export const REPORT_DATE_LINE_TEMPLATE = 'Prepared {date} from figures you entered.';
export const REPORT_FIGURES_HEADING = 'The figures you entered';

export const DISCLOSURE_HEADING =
  'A paragraph you can put in front of your insurer or broker';
export const DISCLOSURE_INTRO =
  'This is written from your own figures. Read it, correct anything that does not match how the firm actually works, and decide with your broker whether any of it should be sent.';

/** Used in the disclosure paragraph when no firm name was given. */
export const DISCLOSURE_FIRM_NAME_FALLBACK = 'Our firm';

export const DISCLOSURE_PARAGRAPH_COUNTED_TEMPLATE =
  '{firmName} uses AI tools in the course of its work. As at {date}, on our own figures, {people} {peopleWord} in the firm use AI in a typical week, which we estimate at around {monthlyQuestions} work questions a month. Of those, approximately {regulatedAnswers} touch tax, pensions, FCA rules or product detail. On the same figures, approximately {untraceable} of those answers a month could not currently be tied back to a source that anyone here had approved before it was used. We are addressing this by {remedy}.';

export const DISCLOSURE_PARAGRAPH_ZERO_TEMPLATE =
  '{firmName} uses AI tools in the course of its work. As at {date}, on our own figures, {people} {peopleWord} in the firm use AI in a typical week, which we estimate at around {monthlyQuestions} work questions a month. On the figures we hold, we would expect answers on regulated subjects to be capable of being tied back to a source approved before use. We keep this under review by {remedy}.';

export const DISCLOSURE_PARAGRAPH_NOT_COUNTED_TEMPLATE =
  '{firmName} uses AI tools in the course of its work. As at {date}, we are not able to state how many AI answers on regulated subjects could not be tied back to an approved source, because at least one of the underlying questions could not yet be answered from within the firm. We are resolving that by {remedy}.';

export const DISCLOSURE_REMEDY =
  'naming someone to approve the sources AI is allowed to draw on, writing down what AI must not be used for, and keeping a record of what each AI-assisted document was based on';

export const REPORT_QUESTIONS_HEADING = 'The three questions to answer first';
export const REPORT_QUESTIONS_INTRO =
  'These are ranked by what your answers suggest needs attention soonest.';
export const REPORT_GOOD_ANSWER_LABEL = 'What a good answer looks like';

export const NO_HIRE_HEADING = 'What to do if you never hire anyone';
export const NO_HIRE_INTRO =
  'None of this requires a new role or a budget line. Each one can sit with someone who already works here.';

export interface ReportStepEntry {
  title: string;
  body: string;
}

export const NO_HIRE_STEPS: readonly ReportStepEntry[] = [
  {
    title: 'Name someone to approve sources',
    body: 'One person decides which documents, providers and guidance AI is allowed to draw on, and signs off anything added later. A named person with a short list beats an unnamed committee with a long one.',
  },
  {
    title: 'Write down what AI must not be used for',
    body: 'A single page is enough. Name the work where AI output must not go to a client without a human source check, and say who to ask when someone is unsure.',
  },
  {
    title: 'Keep a record of what was checked',
    body: 'When an AI-assisted document goes out, record which sources it drew on. A line in the file note is enough to answer a client or a compliance officer months later without reconstructing a chat.',
  },
] as const;

export interface ReportSourceLink {
  name: string;
  url: string;
  note: string;
}

export const REPORT_SOURCES_HEADING = 'Free material worth reading';
export const REPORT_SOURCES_INTRO =
  'All three are free and published by the regulators themselves. None of them is ours.';

export const REPORT_SOURCES: readonly ReportSourceLink[] = [
  {
    name: 'ICO AI and data protection risk toolkit',
    url: 'https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/artificial-intelligence/guidance-on-ai-and-data-protection/ai-and-data-protection-risk-toolkit/',
    note: 'A spreadsheet that walks through the risks your own AI use creates for the people whose data goes into it.',
  },
  {
    name: 'ICO guide to accountability and governance',
    url: 'https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/guide-to-accountability-and-governance/',
    note: 'The ICO position on policies, procedures and keeping records of what you do and why, including for a smaller firm.',
  },
  {
    name: 'AI and the FCA: our approach',
    url: 'https://www.fca.org.uk/firms/innovation/ai-approach',
    note: 'The FCA states it does not plan to introduce extra regulations for AI and will rely on existing frameworks instead.',
  },
] as const;

/** The only offer in the report, and it goes at the very bottom. */
export const REPORT_OFFER_LINE = `Wrigital builds assistants that answer only from a source library your firm has signed off, with every citation checked in code before it reaches anyone. ${OFFER_SETUP_PRICE}, ${OFFER_MONTHLY_PRICE}.`;

/**
 * No benchmark or comparison figure until there is response data of our own or
 * a citable public source. A number here without one would be invented.
 */
export interface ReportBenchmark {
  label: string;
  value: number;
  sourceName: string;
  sourceUrl: string;
}

export const REPORT_BENCHMARK: ReportBenchmark | null = null;

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

export const EMAIL_DEMO_CTA_LABEL = 'Book a call';

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
  'Send a copy to your compliance officer or your broker (optional)';
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

/** Report-only. What a good answer to each area looks like. */
export const COMPLIANCE_GOOD_ANSWER_BY_KEY: Record<
  ComplianceQuestionKey,
  string
> = {
  q6: 'A named person owns a written list of sources AI is allowed to draw on, the tools can actually read that list, and additions are signed off before use rather than after.',
  q7: 'Someone opens the link, confirms it says what the answer claimed, and records that they did. An answer that describes what happens in practice beats one that describes the policy.',
  q8: 'You could retrieve the sources behind an AI-assisted document from the file, months later, without reconstructing a chat from memory or asking the person who wrote it.',
  q9: 'A short document that names the work AI must not be used for, says who to ask when someone is unsure, and has been read recently by the people it applies to.',
};

export interface PrioritisedComplianceQuestion {
  questionKey: ComplianceQuestionKey;
  text: string;
  goodAnswer: string;
}

// ---------------------------------------------------------------------------
// PI answers: report copy and report ordering only
// ---------------------------------------------------------------------------

export type ReportSectionOrder = 'insurer_first' | 'compliance_first';

/** Renewal this month or within this many months puts the insurer section first. */
export const RENEWAL_SOON_MONTHS = 3;

/** Whole months from now until the named renewal month. Null when not known. */
export function monthsUntilRenewal(
  month: PiRenewalMonthId,
  from: Date = new Date(),
): number | null {
  if (month === 'not_sure') return null;
  return (PI_RENEWAL_MONTH_INDEX[month] - from.getUTCMonth() + 12) % 12;
}

export function isRenewalSoon(
  month: PiRenewalMonthId,
  from: Date = new Date(),
): boolean {
  const months = monthsUntilRenewal(month, from);
  return months !== null && months <= RENEWAL_SOON_MONTHS;
}

export function resolveReportSectionOrder(
  month: PiRenewalMonthId,
  from: Date = new Date(),
): ReportSectionOrder {
  return isRenewalSoon(month, from) ? 'insurer_first' : 'compliance_first';
}

export function buildPiTeaser(
  input: Pick<CompleteUnverifiedAnswersInput, 'piDisclosure' | 'piRenewalMonth'>,
): string | null {
  if (input.piDisclosure === 'yes') return null;
  if (input.piRenewalMonth === 'not_sure') return PI_TEASER_WITHOUT_MONTH;

  return PI_TEASER_WITH_MONTH_TEMPLATE.replace(
    '{month}',
    PI_RENEWAL_MONTH_LABELS[input.piRenewalMonth],
  );
}

/** Trimmed firm name, or null when nothing usable was given. */
export function normaliseFirmName(
  value: string | null | undefined,
): string | null {
  const trimmed = value?.trim() ?? '';
  if (!trimmed) return null;
  return trimmed.slice(0, MAX_FIRM_NAME_LENGTH);
}

export function buildReportHeading(
  firmName: string | null | undefined,
): string {
  const name = normaliseFirmName(firmName);
  if (!name) return REPORT_HEADING_NO_FIRM_NAME;
  return REPORT_HEADING_TEMPLATE.replace('{firmName}', name);
}

export function formatReportDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function buildReportDateLine(date: Date): string {
  return REPORT_DATE_LINE_TEMPLATE.replace('{date}', formatReportDate(date));
}

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
  piDisclosure: PiDisclosureAnswer | null;
  piRenewalMonth: PiRenewalMonthId | null;
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
  piDisclosure: PiDisclosureAnswer;
  piRenewalMonth: PiRenewalMonthId;
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
  reportComplianceQuestions: PrioritisedComplianceQuestion[];
  workingSteps: WorkingStep[];
  assumptionsNote: string;
  teaser: string;
  /** Second on-screen teaser line. Null when PI cover has been disclosed. */
  piTeaser: string | null;
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
): PrioritisedComplianceQuestion[] {
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
    .map((entry) => ({
      questionKey: entry.questionKey,
      text: entry.text,
      goodAnswer: COMPLIANCE_GOOD_ANSWER_BY_KEY[entry.questionKey],
    }));
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
    input.policy !== null &&
    input.piDisclosure !== null &&
    input.piRenewalMonth !== null
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
  const notSure = countNotSureAnswers(input);
  const complianceQuestions = selectComplianceQuestions({
    sourceAccess: input.sourceAccess,
    linkCheck: input.linkCheck,
    clientTrace: input.clientTrace,
    policy: input.policy,
  });

  return {
    notSureCount: notSure,
    notSureCallout: notSureCallout(notSure),
    personalAccountCallout: resolvePersonalAccountCallout(input),
    subjectsLine: buildSubjectsLine(input.subjects),
    hasRegulatedSubject,
    prioritisedComplianceQuestions: complianceQuestions.map((q) => q.text),
    reportComplianceQuestions: complianceQuestions,
    assumptionsNote: ASSUMPTIONS_NOTE,
    teaser: buildTeaser({
      sourceAccess: input.sourceAccess,
      linkCheck: input.linkCheck,
      clientTrace: input.clientTrace,
      policy: input.policy,
    }),
    piTeaser: buildPiTeaser({
      piDisclosure: input.piDisclosure,
      piRenewalMonth: input.piRenewalMonth,
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

export interface DisclosureParagraphInput {
  firmName?: string | null;
  result: UnverifiedAnswersResult;
  people: number;
  date: Date;
}

/**
 * The covering-letter paragraph, filled with the firm's own figures. Makes no
 * claim about what any insurer asks for or accepts.
 */
export function buildDisclosureParagraph({
  firmName,
  result,
  people,
  date,
}: DisclosureParagraphInput): string {
  const substitutions: Record<string, string> = {
    '{firmName}': normaliseFirmName(firmName) ?? DISCLOSURE_FIRM_NAME_FALLBACK,
    '{date}': formatReportDate(date),
    '{people}': formatNumber(people),
    '{peopleWord}': people === 1 ? 'person' : 'people',
    '{remedy}': DISCLOSURE_REMEDY,
  };

  let template = DISCLOSURE_PARAGRAPH_NOT_COUNTED_TEMPLATE;

  if (isCountedResult(result)) {
    substitutions['{monthlyQuestions}'] = formatNumber(result.monthlyQuestions);
    substitutions['{regulatedAnswers}'] = formatNumber(result.regulatedAnswers);
    substitutions['{untraceable}'] = formatNumber(result.untraceable);
    template = result.isZeroResult
      ? DISCLOSURE_PARAGRAPH_ZERO_TEMPLATE
      : DISCLOSURE_PARAGRAPH_COUNTED_TEMPLATE;
  }

  return Object.entries(substitutions).reduce(
    (text, [token, value]) => text.split(token).join(value),
    template,
  );
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
  piDisclosure: null,
  piRenewalMonth: null,
};
