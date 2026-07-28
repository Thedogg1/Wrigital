import { z } from 'zod';
import {
  CLIENT_TRACE_OPTIONS,
  CONSENT_WORDING_VERSION,
  FREQUENCY_OPTIONS,
  HONEYPOT_FIELD_NAME,
  LINK_CHECK_OPTIONS,
  MAX_FIRM_NAME_LENGTH,
  PI_DISCLOSURE_OPTIONS,
  PI_RENEWAL_MONTH_OPTIONS,
  POLICY_OPTIONS,
  REGULATED_SHARE_OPTIONS,
  SOURCE_ACCESS_OPTIONS,
  SUBJECT_OPTIONS,
  TOOL_OPTIONS,
} from '@/lib/unverifiedAnswers';

const frequencyBandIds = FREQUENCY_OPTIONS.map((o) => o.id) as [
  (typeof FREQUENCY_OPTIONS)[number]['id'],
  ...(typeof FREQUENCY_OPTIONS)[number]['id'][],
];

const subjectIds = SUBJECT_OPTIONS.map((o) => o.id) as [
  (typeof SUBJECT_OPTIONS)[number]['id'],
  ...(typeof SUBJECT_OPTIONS)[number]['id'][],
];

const regulatedShareBandIds = REGULATED_SHARE_OPTIONS.map((o) => o.id) as [
  (typeof REGULATED_SHARE_OPTIONS)[number]['id'],
  ...(typeof REGULATED_SHARE_OPTIONS)[number]['id'][],
];

const toolIds = TOOL_OPTIONS.map((o) => o.id) as [
  (typeof TOOL_OPTIONS)[number]['id'],
  ...(typeof TOOL_OPTIONS)[number]['id'][],
];

const sourceAccessIds = SOURCE_ACCESS_OPTIONS.map((o) => o.id) as [
  (typeof SOURCE_ACCESS_OPTIONS)[number]['id'],
  ...(typeof SOURCE_ACCESS_OPTIONS)[number]['id'][],
];

const linkCheckIds = LINK_CHECK_OPTIONS.map((o) => o.id) as [
  (typeof LINK_CHECK_OPTIONS)[number]['id'],
  ...(typeof LINK_CHECK_OPTIONS)[number]['id'][],
];

const clientTraceIds = CLIENT_TRACE_OPTIONS.map((o) => o.id) as [
  (typeof CLIENT_TRACE_OPTIONS)[number]['id'],
  ...(typeof CLIENT_TRACE_OPTIONS)[number]['id'][],
];

const policyIds = POLICY_OPTIONS.map((o) => o.id) as [
  (typeof POLICY_OPTIONS)[number]['id'],
  ...(typeof POLICY_OPTIONS)[number]['id'][],
];

const piDisclosureIds = PI_DISCLOSURE_OPTIONS.map((o) => o.id) as [
  (typeof PI_DISCLOSURE_OPTIONS)[number]['id'],
  ...(typeof PI_DISCLOSURE_OPTIONS)[number]['id'][],
];

const piRenewalMonthIds = PI_RENEWAL_MONTH_OPTIONS.map((o) => o.id) as [
  (typeof PI_RENEWAL_MONTH_OPTIONS)[number]['id'],
  ...(typeof PI_RENEWAL_MONTH_OPTIONS)[number]['id'][],
];

export const unverifiedAnswersPayloadSchema = z.object({
  people: z.number().int().min(1).max(200),
  frequencyBand: z.enum(frequencyBandIds),
  subjects: z.array(z.enum(subjectIds)).min(1),
  regulatedShareBand: z.enum(regulatedShareBandIds),
  tools: z.array(z.enum(toolIds)).min(1),
  sourceAccess: z.enum(sourceAccessIds),
  linkCheck: z.enum(linkCheckIds),
  clientTrace: z.enum(clientTraceIds),
  policy: z.enum(policyIds),
  piDisclosure: z.enum(piDisclosureIds),
  piRenewalMonth: z.enum(piRenewalMonthIds),
});

export const unverifiedLeadSchema = z
  .object({
    email: z.string().trim().email('Please enter a valid email address.'),
    firmName: z
      .string()
      .trim()
      .max(MAX_FIRM_NAME_LENGTH)
      .optional()
      .transform((value) => value ?? ''),
    complianceOfficerEmail: z
      .string()
      .trim()
      .optional()
      .transform((value) => value ?? ''),
    marketingConsent: z.boolean().default(false),
    consentWordingVersion: z.literal(CONSENT_WORDING_VERSION),
    answers: unverifiedAnswersPayloadSchema,
    [HONEYPOT_FIELD_NAME]: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.complianceOfficerEmail.length > 0 &&
      !z.string().email().safeParse(data.complianceOfficerEmail).success
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['complianceOfficerEmail'],
        message: 'Please enter a valid compliance officer email.',
      });
    }
  })
  .transform((data) => ({
    ...data,
    firmName: data.firmName.length > 0 ? data.firmName : undefined,
    complianceOfficerEmail:
      data.complianceOfficerEmail.length > 0
        ? data.complianceOfficerEmail
        : undefined,
  }));

export type UnverifiedLeadPayload = z.infer<typeof unverifiedLeadSchema>;
