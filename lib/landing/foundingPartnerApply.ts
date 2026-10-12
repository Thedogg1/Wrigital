export const FOUNDING_PARTNER_CALENDLY_URL =
  'https://calendly.com/hello-wrigital/30min';

export const FOUNDING_PARTNER_QUESTIONS = [
  {
    id: 'meet',
    text: 'Do you regularly meet prospective high-net-worth business owners who are considering selling their business, planning their succession or preparing for a significant liquidity event?',
  },
  {
    id: 'demonstrate',
    text: "When you're competing for a new business-owner client, is it difficult to evidence your understanding of their business and financial situation before they've appointed you?",
  },
] as const;

export type FoundingPartnerQuestionId =
  (typeof FOUNDING_PARTNER_QUESTIONS)[number]['id'];

export type FoundingPartnerAnswer = 'yes' | 'no' | '';

export type FoundingPartnerAnswers = Record<
  FoundingPartnerQuestionId,
  FoundingPartnerAnswer
>;

export function emptyFoundingPartnerAnswers(): FoundingPartnerAnswers {
  return { meet: '', demonstrate: '' };
}

export type FoundingPartnerApplyResult = 'incomplete' | 'book' | 'not-a-fit';

export function foundingPartnerApplyResult(
  answers: FoundingPartnerAnswers,
): FoundingPartnerApplyResult {
  const values = FOUNDING_PARTNER_QUESTIONS.map((question) => answers[question.id]);
  if (values.some((value) => value !== 'yes' && value !== 'no')) {
    return 'incomplete';
  }
  if (values.every((value) => value === 'yes')) return 'book';
  return 'not-a-fit';
}
