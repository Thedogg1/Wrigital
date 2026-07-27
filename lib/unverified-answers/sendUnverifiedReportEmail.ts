import { getResendClient } from '@/lib/email/resendClient';
import { resendFromAddress } from '@/lib/email/config';
import { calendlyUrl, siteUrl } from '@/lib/site';
import {
  EMAIL_BEYOND_SCREEN_NOTE,
  EMAIL_COMPLIANCE_OFFICER_SUBJECT_SUFFIX,
  EMAIL_DEMO_CTA_LABEL,
  EMAIL_DEMO_PROMPT,
  EMAIL_FOOTER_DISCLAIMER,
  EMAIL_GREETING,
  EMAIL_GREETING_COMPLIANCE_OFFICER,
  EMAIL_LINK_EXPIRY_NOTE,
  EMAIL_OPEN_REPORT_LABEL,
  EMAIL_REPORT_CONTENTS,
  EMAIL_SIGNATURE_NAME,
  EMAIL_SIGNATURE_ROLE,
  EMAIL_SUBJECT,
  PAGE_TITLE,
} from '@/lib/unverifiedAnswers';

/** Public inbox for this product (reply-to and signature). */
export const UNVERIFIED_REPLY_TO = 'hello@wrigital.com';

export interface SendUnverifiedReportEmailInput {
  email: string;
  reportUrl: string;
  isComplianceOfficerCopy?: boolean;
}

export function buildUnverifiedReportEmailHtml(
  input: SendUnverifiedReportEmailInput,
): string {
  const greeting = input.isComplianceOfficerCopy
    ? `<p>${EMAIL_GREETING_COMPLIANCE_OFFICER}</p>`
    : `<p>${EMAIL_GREETING}</p>`;

  const contents = EMAIL_REPORT_CONTENTS.map(
    (item) => `<li>${item}</li>`,
  ).join('');

  return `
  ${greeting}
  <p>${EMAIL_OPEN_REPORT_LABEL}</p>
  <p><a href="${input.reportUrl}">${input.reportUrl}</a></p>
  <p>${EMAIL_LINK_EXPIRY_NOTE}</p>
  <ul>${contents}</ul>
  <p>${EMAIL_BEYOND_SCREEN_NOTE}</p>
  <p>${EMAIL_DEMO_PROMPT}</p>
  <p><a href="${calendlyUrl}">${EMAIL_DEMO_CTA_LABEL}</a></p>
  <p>${EMAIL_SIGNATURE_NAME}<br/>${EMAIL_SIGNATURE_ROLE}</p>
  <p>
    <a href="mailto:${UNVERIFIED_REPLY_TO}">${UNVERIFIED_REPLY_TO}</a><br/>
    <a href="${siteUrl}">${siteUrl.replace(/^https?:\/\//, '')}</a>
  </p>
  <p style="font-size: 12px; color: #666;">
    ${EMAIL_FOOTER_DISCLAIMER}
  </p>
`;
}

export async function sendUnverifiedReportEmail(
  input: SendUnverifiedReportEmailInput,
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  const subject =
    process.env.UNVERIFIED_LEAD_EMAIL_SUBJECT?.trim() || EMAIL_SUBJECT;
  const html =
    process.env.UNVERIFIED_LEAD_EMAIL_HTML?.trim() ||
    buildUnverifiedReportEmailHtml(input);

  const resend = getResendClient();
  const { error } = await resend.emails.send({
    from: resendFromAddress,
    replyTo: UNVERIFIED_REPLY_TO,
    to: [input.email],
    subject: input.isComplianceOfficerCopy
      ? `${subject} ${EMAIL_COMPLIANCE_OFFICER_SUBJECT_SUFFIX}`
      : subject,
    html,
  });

  if (error) {
    throw new Error(error.message);
  }
}
