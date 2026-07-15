import { getResendClient } from '@/lib/email/resendClient';
import {
  resendFromAddress,
  resendReplyTo,
} from '@/lib/email/config';
import { loadMarcusEllisonSampleReport } from './loadMarcusEllisonSampleReport';
import { calendlyUrl } from '@/lib/site';

const DISCOVERY_CALL_URL = calendlyUrl;

const EMAIL_SUBJECT = 'Your US exit tax report is attached';

const EMAIL_HTML = `
  <p>Hi {{firstName}},</p>
  <p>The first attachment is the exit tax calculation you just ran. The figures are based on the inputs you entered.</p>
  <p>The second is a sample FinPrint intelligence report built around a fictional business owner called Marcus T. Ellison of Ellison Dynamics.</p>
  <p>If you'd like to see a report built around one of your own prospects, I'd be glad to walk you through it.</p>
  <p><a href="${DISCOVERY_CALL_URL}">Book a Discovery Call →</a></p>
  <p>Terry Martin<br/>Founder, Wrigital</p>
  <p style="font-size: 12px; color: #666;">
    FinPrint is a technology product from Wrigital. It does not provide financial, tax, or investment advice. All outputs are designed for use by SEC- and FINRA-regulated financial advisors and are subject to advisor review and approval before use. Marcus T. Ellison and Ellison Dynamics are AI-generated fictional characters created for demonstration purposes only.
  </p>
`;

export interface SendUsLeadReportEmailInput {
  name: string;
  email: string;
  firmName: string;
  exitReportHtml: string;
}

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || fullName;
}

function interpolate(template: string, values: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => values[key] ?? '');
}

export async function sendUsLeadReportEmail(input: SendUsLeadReportEmailInput): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  const sampleReport = await loadMarcusEllisonSampleReport();
  const subject = process.env.US_LEAD_EMAIL_SUBJECT?.trim() || EMAIL_SUBJECT;
  const htmlTemplate = process.env.US_LEAD_EMAIL_HTML?.trim() || EMAIL_HTML;
  const html = interpolate(htmlTemplate, {
    firstName: firstName(input.name),
    name: input.name,
    firmName: input.firmName,
    email: input.email,
  });

  const resend = getResendClient();
  const { error } = await resend.emails.send({
    from: resendFromAddress,
    replyTo: resendReplyTo,
    to: [input.email],
    subject,
    html,
    attachments: [
      {
        filename: 'us-exit-tax-calculation-report.html',
        content: Buffer.from(input.exitReportHtml, 'utf-8'),
      },
      {
        filename: sampleReport.filename,
        content: sampleReport.content,
      },
    ],
  });

  if (error) {
    throw new Error(error.message);
  }
}
