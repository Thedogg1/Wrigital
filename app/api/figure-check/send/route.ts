import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getResendClient } from '@/lib/email/resendClient';
import {
  contactEmail,
  resendFromAddress,
  resendReplyTo,
} from '@/lib/email/config';
import { buildLeadNotifyHtml, buildReportHtml } from '@/lib/figure-check/report';
import { saveFigureCheckLead } from '@/lib/figure-check/saveLead';
import { getScan } from '@/lib/figure-check/scanStore';
import { syncResendAudienceContact } from '@/lib/unverified-answers/syncResendContact';

const FREE_MAIL = new Set([
  'gmail.com',
  'googlemail.com',
  'outlook.com',
  'hotmail.com',
  'yahoo.com',
  'yahoo.co.uk',
  'icloud.com',
  'me.com',
  'mac.com',
  'live.com',
  'aol.com',
]);

const bodySchema = z.object({
  scanId: z.string().min(1),
  email: z.string().email('Please enter a valid email address.'),
  firmName: z.string().optional(),
  budgetRecheck: z.boolean(),
});

function emailFromAddress(): string {
  return process.env.EMAIL_FROM?.trim() || resendFromAddress;
}

function leadNotifyAddress(): string {
  return process.env.LEAD_NOTIFY_EMAIL?.trim() || contactEmail;
}

function isFreeMail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase() ?? '';
  return FREE_MAIL.has(domain);
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        {
          error:
            process.env.NODE_ENV === 'development'
              ? 'RESEND_API_KEY is not configured. Add it to .env.local and restart.'
              : 'Something went wrong. Please try again later.',
        },
        { status: 503 },
      );
    }

    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Please send a JSON body with scanId and email.' },
        { status: 400 },
      );
    }

    const parsed = bodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ??
            'Please check the email address and try again.',
        },
        { status: 400 },
      );
    }

    const { scanId, email, firmName, budgetRecheck } = parsed.data;
    const normalisedEmail = email.trim().toLowerCase();

    if (isFreeMail(normalisedEmail)) {
      return NextResponse.json(
        {
          error:
            'Please use a work email address (not Gmail, Outlook, Yahoo, iCloud, or similar free-mail providers).',
        },
        { status: 400 },
      );
    }

    const scan = getScan(scanId);
    if (!scan) {
      return NextResponse.json(
        {
          error:
            'That scan has expired or was not found. Please run the check again.',
        },
        { status: 404 },
      );
    }

    const resend = getResendClient();
    const from = emailFromAddress();
    const reportHtml = buildReportHtml(scan, { firmName, budgetRecheck });

    const { error: sendError } = await resend.emails.send({
      from,
      replyTo: resendReplyTo,
      to: [normalisedEmail],
      subject: `Stale Figure Check — ${scan.domain}`,
      html: reportHtml,
    });

    if (sendError) {
      console.error('[figure-check:send] Resend error', sendError);
      return NextResponse.json(
        { error: 'We could not send the report. Please try again later.' },
        { status: 502 },
      );
    }

    try {
      await saveFigureCheckLead({
        email: normalisedEmail,
        firmName: firmName?.trim() || undefined,
        domain: scan.domain,
        budgetRecheck,
        scannedAt: scan.scannedAt,
      });
    } catch (e) {
      console.error('[figure-check:send] lead persist error', e);
    }

    try {
      await syncResendAudienceContact({
        email: normalisedEmail,
        source: '/website-figure-check',
        marketingConsent: false,
        firmName: firmName?.trim() || undefined,
        properties: {
          check_domain: scan.domain,
          check_behind: String(scan.counts.stale),
          budget_recheck: budgetRecheck ? 'yes' : 'no',
        },
      });
    } catch (contactError) {
      console.error('[figure-check:send] Resend contact sync failed', contactError);
    }

    const notifyTo = leadNotifyAddress().toLowerCase();
    // Avoid a second near-empty mail when testing with the notify inbox itself.
    if (notifyTo && notifyTo !== normalisedEmail) {
      const { error: notifyError } = await resend.emails.send({
        from,
        replyTo: resendReplyTo,
        to: [notifyTo],
        subject: `Lead: Stale Figure Check — ${scan.domain}`,
        html: buildLeadNotifyHtml({
          domain: scan.domain,
          email: normalisedEmail,
          firmName,
          counts: scan.counts,
          pagesScanned: scan.pagesScanned,
          budgetRecheck,
        }),
      });
      if (notifyError) {
        console.error('[figure-check:send] notify error', notifyError);
      }
    }

    return NextResponse.json({ sent: true });
  } catch (e) {
    console.error('[figure-check:send:unexpected]', e);
    return NextResponse.json(
      { error: 'We could not send the report. Please try again later.' },
      { status: 500 },
    );
  }
}
