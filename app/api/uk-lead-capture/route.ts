import { NextRequest, NextResponse } from 'next/server';
import { contactEmail } from '@/lib/email/config';
import { leadSchema } from '@/features/lead-capture/leadSchema';
import { getUkLeadsFilePath, saveUkLead } from '@/lib/uk-landing/saveUkLead';
import { sendUkLeadReportEmail } from '@/lib/uk-landing/sendUkLeadReportEmail';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        {
          error:
            `Email delivery is not configured. Please contact ${contactEmail}.`,
        },
        { status: 503 },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 },
      );
    }

    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 },
      );
    }

    const { name, email, firmName, exitReportHtml } = parsed.data;
    const submittedAt = new Date().toISOString();
    const record = {
      name,
      email,
      firmName,
      source: '/uk Exit Tax Calculator',
      submittedAt,
    };

    try {
      await saveUkLead(record);
      console.log(`UK lead saved to ${getUkLeadsFilePath()}`);
    } catch (fileError) {
      console.error('Failed to save UK lead to file:', fileError);
    }

    try {
      await sendUkLeadReportEmail({ name, email, firmName, exitReportHtml });
    } catch (emailError) {
      console.error('Failed to send UK lead report email:', emailError);
      return NextResponse.json(
        {
          error:
            `We could not send your report by email. Please try again or contact ${contactEmail}.`,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('UK lead capture error:', error);
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 },
    );
  }
}
