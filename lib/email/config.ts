/** Verified Resend sending domain (must match Resend dashboard). */
const resendFromEmail =
  process.env.RESEND_FROM_EMAIL?.trim() || 'hello@contact.wrigital.com';

const resendFromName =
  process.env.RESEND_FROM_NAME?.trim() || 'Wrigital';

/** Public contact address (mailto links, error messages, email signatures). */
export const contactEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || 'admin@wrigital.com';

/** Resend `from` field — must use the verified sending domain. */
export const resendFromAddress =
  process.env.RESEND_FROM_ADDRESS?.trim() ||
  `${resendFromName} <${resendFromEmail}>`;

/** Reply-to for outbound mail (defaults to public contact inbox). */
export const resendReplyTo =
  process.env.RESEND_REPLY_TO?.trim() || contactEmail;

export const contactMailto = `mailto:${contactEmail}`;
