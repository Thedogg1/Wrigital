import { Resend } from 'resend';

let resend: Resend | null = null;

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
