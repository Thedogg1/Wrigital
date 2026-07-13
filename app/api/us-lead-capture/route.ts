import { NextRequest, NextResponse } from 'next/server';
import { contactEmail } from '@/lib/email/config';
import { leadSchema } from '@/features/lead-capture/leadSchema';
import { getUsLeadsFilePath, saveUsLead } from '@/lib/us-landing/saveUsLead';
import { sendUsLeadReportEmail } from '@/lib/us-landing/sendUsLeadReportEmail';

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
      source: '/us Exit Tax Calculator',
      submittedAt,
    };

    try {
      await saveUsLead(record);
      console.log(`US lead saved to ${getUsLeadsFilePath()}`);
    } catch (fileError) {
      console.error('Failed to save US lead to file:', fileError);
    }

    try {
      await sendUsLeadReportEmail({ name, email, firmName, exitReportHtml });
    } catch (emailError) {
      console.error('Failed to send US lead report email:', emailError);
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
    console.error('US lead capture error:', error);
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 },
    );
  }
}
