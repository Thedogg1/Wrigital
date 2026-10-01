import { getResendClient } from '@/lib/email/resendClient';
import { contactEmail, resendFromAddress } from '@/lib/email/config';
import { formatLondonTimestamp } from '@/lib/brochure/dates';
import {
  formatGbp,
  formatPercentFromDecimal,
  type PreparedBlueprintRequest,
  type SubmittedField,
} from '@/lib/uk-landing/blueprintRequest';

function notifyAddress(): string {
  return process.env.LEAD_NOTIFY_EMAIL?.trim() || contactEmail;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function subjectFirm(firm: string): string {
  return firm.replace(/[\r\n]+/g, ' ').trim();
}

function linesFor(fields: SubmittedField[]): string {
  if (fields.length === 0) return 'None supplied.\n';
  return fields
    .map(
      (field) =>
        `${field.label}\n${field.display}\n${field.provenance}\nPath: ${field.path}\n`,
    )
    .join('\n');
}

function htmlRows(fields: SubmittedField[]): string {
  if (fields.length === 0) {
    return '<p style="margin:0 0 16px;">None supplied.</p>';
  }
  return fields
    .map(
      (field) => `<p style="margin:0 0 16px;font-size:15px;line-height:1.5;">
        <strong>${escapeHtml(field.label)}</strong><br />
        ${escapeHtml(field.display)}<br />
        ${escapeHtml(field.provenance)}<br />
        <span style="color:#64748b;">${escapeHtml(field.path)}</span>
      </p>`,
    )
    .join('');
}

function buildText(input: PreparedBlueprintRequest, timestamp: string): string {
  const starting = input.fields.filter((field) => field.section === 'starting');
  const niche = input.fields.filter((field) => field.section === 'niche');
  const optional = input.fields.filter((field) => field.section === 'optional');
  const adviserProvided = input.fields.filter(
    (field) => field.provenance === 'ADVISER PROVIDED',
  ).length;
  const defaults = input.fields.filter(
    (field) => field.provenance === 'DEFAULT - DEMONSTRATION',
  ).length;
  const calculated = input.calculated
    ? `Owner stake: ${formatGbp(input.calculated.ownerStakeGbp)}\nBusiness concentration: ${formatPercentFromDecimal(input.calculated.businessConcentration)}\nFormula: business value x ownership / 100, then owner stake / net worth\nProvenance: CALCULATED\n`
    : 'Not calculated. The starting picture did not parse.\n';

  return `New Free FinPrint Blueprint request from /uk.

This email is the request as submitted. No Blueprint has been generated yet. No AI inference has been applied. Missing niche and optional fields were left blank on purpose.

LEAD DETAILS
Name: ${input.adviserName}
Firm: ${input.firmName}
Work email: ${input.email}
Niche: ${input.niche}
Submitted: ${timestamp}

FREE-TEXT DESCRIPTION
${input.description}

STARTING FINANCIAL PICTURE
${linesFor(starting)}
CALCULATED FROM THE STARTING PICTURE
${calculated}
NICHE-SPECIFIC INFORMATION SUPPLIED
${linesFor(niche)}
OPTIONAL INFORMATION SUPPLIED
${linesFor(optional)}
PROVENANCE SUMMARY
Adviser provided: ${adviserProvided}
Default demonstration: ${defaults}
Niche or optional values supplied: ${niche.length + optional.length}

Blank niche and optional fields are not listed. They remain not provided.
A machine-readable JSON copy is attached.`;
}

function buildHtml(input: PreparedBlueprintRequest, timestamp: string): string {
  const starting = input.fields.filter((field) => field.section === 'starting');
  const niche = input.fields.filter((field) => field.section === 'niche');
  const optional = input.fields.filter((field) => field.section === 'optional');
  const calculated = input.calculated
    ? `<p style="margin:0 0 8px;"><strong>Owner stake:</strong> ${escapeHtml(formatGbp(input.calculated.ownerStakeGbp))}</p>
       <p style="margin:0 0 8px;"><strong>Business concentration:</strong> ${escapeHtml(formatPercentFromDecimal(input.calculated.businessConcentration))}</p>
       <p style="margin:0;">Provenance: CALCULATED. Formula: business value x ownership / 100, then owner stake / net worth.</p>`
    : '<p style="margin:0;">Not calculated.</p>';

  return `<!DOCTYPE html>
<html lang="en-GB">
<body style="margin:0;padding:0;background:#f8fafc;color:#0f172a;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:680px;margin:0 auto;padding:32px 24px;">
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#0e7490;">Free FinPrint Blueprint</p>
    <h1 style="margin:0 0 12px;font-size:22px;">Request from /uk</h1>
    <p style="margin:0 0 24px;color:#475569;">Submission only. The Blueprint has not been generated, and no inferred values are included.</p>
    <h2 style="font-size:16px;">Lead details</h2>
    <p style="margin:0 0 8px;"><strong>Name:</strong> ${escapeHtml(input.adviserName)}</p>
    <p style="margin:0 0 8px;"><strong>Firm:</strong> ${escapeHtml(input.firmName)}</p>
    <p style="margin:0 0 8px;"><strong>Work email:</strong> <a href="mailto:${escapeHtml(input.email)}">${escapeHtml(input.email)}</a></p>
    <p style="margin:0 0 8px;"><strong>Niche:</strong> ${escapeHtml(input.niche)}</p>
    <p style="margin:0 0 24px;"><strong>Submitted:</strong> ${escapeHtml(timestamp)}</p>
    <h2 style="font-size:16px;">Free-text description</h2>
    <p style="margin:0 0 24px;line-height:1.6;">${escapeHtml(input.description).replace(/\n/g, '<br />')}</p>
    <h2 style="font-size:16px;">Starting financial picture</h2>
    ${htmlRows(starting)}
    <h2 style="font-size:16px;">Calculated from the starting picture</h2>
    <div style="margin:0 0 24px;">${calculated}</div>
    <h2 style="font-size:16px;">Niche-specific information supplied</h2>
    ${htmlRows(niche)}
    <h2 style="font-size:16px;">Optional information supplied</h2>
    ${htmlRows(optional)}
  </div>
</body>
</html>`;
}

export async function sendFinprintSampleRequestEmail(
  input: PreparedBlueprintRequest,
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  const timestamp = formatLondonTimestamp();
  const resend = getResendClient();
  const { error } = await resend.emails.send({
    from: resendFromAddress,
    replyTo: input.email,
    to: [notifyAddress()],
    subject: `New Free FinPrint Blueprint Request: ${subjectFirm(input.firmName)}`,
    text: buildText(input, timestamp),
    html: buildHtml(input, timestamp),
    attachments: [
      {
        filename: 'finprint-blueprint-request.json',
        content: Buffer.from(
          JSON.stringify(input.machineReadable, null, 2),
          'utf8',
        ),
      },
    ],
  });

  if (error) {
    throw new Error(error.message);
  }
}
