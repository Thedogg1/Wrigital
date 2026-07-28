import { getResendContactsClient } from '@/lib/email/resendClient';
import { normaliseFirmName } from '@/lib/unverifiedAnswers';

export const RESEND_CONTACT_SOURCE = 'unverified-answer-count';

export const RESEND_CONTACT_PROPERTY_KEYS = [
  'source',
  'firm_name',
  'result_status',
  'untraceable',
  'pi_disclosure',
  'pi_renewal_month',
  'marketing_consent',
] as const;

export interface SyncResendContactInput {
  email: string;
  firmName?: string | null;
  marketingConsent: boolean;
  resultStatus: 'counted' | 'not_counted';
  untraceable: number | null;
  piDisclosure: string;
  piRenewalMonth: string;
}

type ResendErrorLike = {
  message?: string;
  name?: string;
  statusCode?: number | null;
} | null;

function isRestrictedApiKeyError(error: ResendErrorLike): boolean {
  if (!error) return false;
  const message = (error.message ?? '').toLowerCase();
  const name = (error.name ?? '').toLowerCase();
  return (
    name === 'restricted_api_key' ||
    message.includes('restricted to only send emails')
  );
}

function throwIfRestricted(error: ResendErrorLike): void {
  if (!isRestrictedApiKeyError(error)) return;
  throw new Error(
    'Resend API key cannot manage contacts (Sending access only). Create a Full access key and set RESEND_CONTACTS_API_KEY, or replace RESEND_API_KEY with a Full access key.',
  );
}

function buildContactPayload(input: SyncResendContactInput) {
  const firmName = normaliseFirmName(input.firmName);

  return {
    email: input.email.trim().toLowerCase(),
    unsubscribed: !input.marketingConsent,
    ...(firmName ? { firstName: firmName } : {}),
    properties: {
      source: RESEND_CONTACT_SOURCE,
      firm_name: firmName ?? '',
      result_status: input.resultStatus,
      untraceable:
        input.untraceable === null ? '' : String(input.untraceable),
      pi_disclosure: input.piDisclosure,
      pi_renewal_month: input.piRenewalMonth,
      marketing_consent: input.marketingConsent ? 'yes' : 'no',
    },
    ...(getOptionalSegmentId()
      ? { segments: [{ id: getOptionalSegmentId()! }] }
      : {}),
  };
}

function getOptionalSegmentId(): string | undefined {
  const id = process.env.RESEND_UNVERIFIED_SEGMENT_ID?.trim();
  return id || undefined;
}

let propertiesEnsured = false;

/**
 * Custom contact properties must exist in Resend before they can be set on a
 * contact. Creates any missing keys once per process.
 */
export async function ensureResendContactProperties(): Promise<void> {
  if (propertiesEnsured) return;

  const resend = getResendContactsClient();
  const listed = await resend.contactProperties.list({ limit: 100 });
  throwIfRestricted(listed.error);
  if (listed.error) {
    throw new Error(listed.error.message);
  }

  const existing = new Set(
    (listed.data?.data ?? []).map((property) => property.key),
  );

  for (const key of RESEND_CONTACT_PROPERTY_KEYS) {
    if (existing.has(key)) continue;

    const created = await resend.contactProperties.create({
      key,
      type: 'string',
      fallbackValue: '',
    });
    throwIfRestricted(created.error);
    if (created.error) {
      const message = created.error.message.toLowerCase();
      if (message.includes('already') || message.includes('exists')) {
        continue;
      }
      throw new Error(created.error.message);
    }
  }

  propertiesEnsured = true;
}

/** Test helper: reset the one-shot properties cache. */
export function resetResendContactPropertiesCache(): void {
  propertiesEnsured = false;
}

/**
 * Upserts the submitter in Resend Contacts. Non-fatal at the route: callers
 * should catch failures so report delivery still succeeds.
 */
export async function syncResendContact(
  input: SyncResendContactInput,
): Promise<void> {
  const resend = getResendContactsClient();
  await ensureResendContactProperties();

  const payload = buildContactPayload(input);

  const created = await resend.contacts.create(payload);
  throwIfRestricted(created.error);
  if (!created.error) {
    return;
  }

  const updated = await resend.contacts.update({
    email: payload.email,
    unsubscribed: payload.unsubscribed,
    firstName: payload.firstName ?? null,
    properties: payload.properties,
  });
  throwIfRestricted(updated.error);

  if (updated.error) {
    throw new Error(updated.error.message);
  }
}
