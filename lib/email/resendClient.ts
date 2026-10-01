import { Resend } from 'resend';
import { Agent, setGlobalDispatcher } from 'undici';

let resend: Resend | null = null;
let resendContacts: Resend | null = null;
let localTlsDispatcherApplied = false;

/**
 * This machine's local network intercepts TLS. Node then rejects Resend's
 * certificate (UNABLE_TO_VERIFY_LEAF_SIGNATURE) and the SDK reports that as
 * "Unable to fetch data". Opt in with FIGURE_CHECK_INSECURE_TLS=1, and only
 * outside production.
 */
function applyLocalTlsInterceptionIfEnabled(): void {
  if (localTlsDispatcherApplied) return;
  if (process.env.FIGURE_CHECK_INSECURE_TLS !== '1') return;
  if (process.env.NODE_ENV === 'production') return;
  setGlobalDispatcher(new Agent({ connect: { rejectUnauthorized: false } }));
  localTlsDispatcherApplied = true;
}

export function getResendClient(): Resend {
  applyLocalTlsInterceptionIfEnabled();
  if (!resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error('RESEND_API_KEY is not configured');
    }
    resend = new Resend(key);
  }
  return resend;
}

/**
 * Client for Contacts / Audiences. Prefer RESEND_CONTACTS_API_KEY when the
 * sending key is restricted to "Sending access" only.
 */
export function getResendContactsClient(): Resend {
  const contactsKey = process.env.RESEND_CONTACTS_API_KEY?.trim();
  if (contactsKey) {
    if (!resendContacts) {
      resendContacts = new Resend(contactsKey);
    }
    return resendContacts;
  }
  return getResendClient();
}

export function interpolateTemplate(
  template: string,
  vars: Record<string, string>,
): string {
  return Object.entries(vars).reduce(
    (result, [key, value]) =>
      result.replaceAll(`{{${key}}}`, value),
    template,
  );
}
