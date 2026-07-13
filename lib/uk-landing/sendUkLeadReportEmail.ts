import { getResendClient } from '@/lib/email/resendClient';
import {
  contactEmail,
  resendFromAddress,
  resendReplyTo,
} from '@/lib/email/config';
import { loadRobertHartleySampleReport } from './loadRobertHartleySampleReport';
import { calendlyUrl, siteUrl } from '@/lib/site';

const DISCOVERY_CALL_URL = calendlyUrl;

const EMAIL_SUBJECT = 'Your exit tax report is attached';

const EMAIL_HTML = `
  <p>Hi {{firstName}},</p>
  <p>You'll find two attachments in this email.</p>
  <p>The first is the exit tax calculation you just ran. The figures are based on the inputs you entered. If any of those numbers change when you get to the precise data, the output changes proportionally; the structure of the opportunity won't.</p>
  <p>The second is a sample Wrigital intelligence report. It's built around a fictional business owner called Robert Hartley of Hartley Precision Components Ltd. The report itself is real. The figures are formula-driven, the risks are genuine, and the narrative is the kind of thing that makes a prospect want to book a second meeting before the first one has ended.</p>
  <p>The difference between the calculation and the full report is the difference between a number and a conversation.</p>
  <p>If you'd like to see a report built around one of your own prospects, I'd be glad to walk you through it.</p>
  <p><a href="${DISCOVERY_CALL_URL}">Book a Discovery Call →</a></p>
  <p>Terry Martin<br/>Founder, Wrigital</p>
  <p>
    <a href="mailto:${contactEmail}">${contactEmail}</a><br/>
    <a href="${siteUrl}">${siteUrl.replace(/^https?:\/\//, '')}</a>
  </p>
  <p style="font-size: 12px; color: #666;">
    Wrigital is a technology platform. It does not provide financial advice. All outputs are designed for use by FCA-regulated financial advisers and are subject to adviser review and approval before use. Robert Hartley and Hartley Precision Components Ltd are AI-generated fictional characters created for demonstration purposes only.
  </p>
`;

export interface SendUkLeadReportEmailInput {
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

export async function sendUkLeadReportEmail(input: SendUkLeadReportEmailInput): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  const sampleReport = await loadRobertHartleySampleReport();

  const subject = process.env.UK_LEAD_EMAIL_SUBJECT?.trim() || EMAIL_SUBJECT;
  const htmlTemplate = process.env.UK_LEAD_EMAIL_HTML?.trim() || EMAIL_HTML;
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
        filename: 'exit-tax-calculation-report.html',
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
