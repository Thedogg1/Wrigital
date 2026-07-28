import { Resend } from 'resend';

let resend: Resend | null = null;
let resendContacts: Resend | null = null;

export function getResendClient(): Resend {
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
