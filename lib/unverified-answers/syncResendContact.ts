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
  'check_domain',
  'check_behind',
  'budget_recheck',
] as const;

export interface SyncResendContactInput {
  email: string;
  firmName?: string | null;
  marketingConsent: boolean;
  resultStatus: 'counted' | 'not_counted';
  untraceable: number | null;
  piDisclosure: string;
  piRenewalMonth: string;
  /** Path or label stored on the Resend contact `source` property. */
  source?: string;
}

export interface SyncResendAudienceContactInput {
  email: string;
  source: string;
  /** When true, contact may receive marketing. When false, do not force-unsubscribe an existing opted-in contact. */
  marketingConsent?: boolean;
  firmName?: string | null;
  properties?: Record<string, string>;
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

function getOptionalSegmentId(): string | undefined {
  const id = process.env.RESEND_UNVERIFIED_SEGMENT_ID?.trim();
  return id || undefined;
}

function mergeSource(existing: string | undefined, next: string): string {
  const parts = new Set(
    `${existing ?? ''},${next}`
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  );
  return [...parts].join(', ');
}

function asPropertyMap(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object') return {};
  const out: Record<string, string> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (raw == null) continue;
    if (typeof raw === 'object' && raw !== null && 'value' in raw) {
      const nested = (raw as { value: unknown }).value;
      if (nested == null) continue;
      out[key] = String(nested);
      continue;
    }
    out[key] = String(raw);
  }
  return out;
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
 * Upserts one Resend contact by email. Existing contacts are updated in place
 * (no duplicate). Properties and sources are merged so figure-check and
 * unverified-answer flows can both write without wiping each other.
 */
export async function syncResendAudienceContact(
  input: SyncResendAudienceContactInput,
): Promise<void> {
  const resend = getResendContactsClient();
  await ensureResendContactProperties();

  const email = input.email.trim().toLowerCase();
  const firmName = normaliseFirmName(input.firmName);
  const segmentId = getOptionalSegmentId();

  const existing = await resend.contacts.get({ email });
  throwIfRestricted(existing.error);

  const existingProps = asPropertyMap(
    (existing.data as { properties?: unknown } | null)?.properties,
  );
  const mergedProperties: Record<string, string> = {
    ...existingProps,
    ...(input.properties ?? {}),
    source: mergeSource(existingProps.source, input.source),
  };
  if (firmName) {
    mergedProperties.firm_name = firmName;
  }

  const currentlyUnsubscribed = Boolean(
    (existing.data as { unsubscribed?: boolean } | null)?.unsubscribed,
  );
  let unsubscribed = currentlyUnsubscribed;
  if (input.marketingConsent === true) {
    unsubscribed = false;
  } else if (input.marketingConsent === false && !existing.data) {
    // New contact with no marketing opt-in.
    unsubscribed = true;
  }

  if (existing.data && !existing.error) {
    const updated = await resend.contacts.update({
      email,
      unsubscribed,
      firstName: firmName ?? undefined,
      properties: mergedProperties,
      ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
    });
    throwIfRestricted(updated.error);
    if (updated.error) {
      throw new Error(updated.error.message);
    }
    return;
  }

  const created = await resend.contacts.create({
    email,
    unsubscribed,
    ...(firmName ? { firstName: firmName } : {}),
    properties: mergedProperties,
    ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
  });
  throwIfRestricted(created.error);

  if (!created.error) {
    return;
  }

  // Race: created elsewhere between get and create — update instead.
  const updated = await resend.contacts.update({
    email,
    unsubscribed,
    firstName: firmName ?? undefined,
    properties: mergedProperties,
    ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
  });
  throwIfRestricted(updated.error);
  if (updated.error) {
    throw new Error(updated.error.message);
  }
}

/**
 * Upserts the unverified-answers submitter in Resend Contacts. Non-fatal at
 * the route: callers should catch failures so report delivery still succeeds.
 */
export async function syncResendContact(
  input: SyncResendContactInput,
): Promise<void> {
  const firmName = normaliseFirmName(input.firmName);
  await syncResendAudienceContact({
    email: input.email,
    source: input.source?.trim() || RESEND_CONTACT_SOURCE,
    marketingConsent: input.marketingConsent,
    firmName,
    properties: {
      firm_name: firmName ?? '',
      result_status: input.resultStatus,
      untraceable:
        input.untraceable === null ? '' : String(input.untraceable),
      pi_disclosure: input.piDisclosure,
      pi_renewal_month: input.piRenewalMonth,
      marketing_consent: input.marketingConsent ? 'yes' : 'no',
    },
  });
}
