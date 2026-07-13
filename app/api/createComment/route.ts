import { client } from '@/sanity/lib/client';
import { type NextRequest, NextResponse } from 'next/server';

type CommentRequest = {
  _id: string;
  name: string;
  email: string;
  comment: string;
};

export async function POST(request: NextRequest) {
  // Feature disabled - return 403 if comments are not enabled
  if (process.env.NEXT_PUBLIC_ENABLE_COMMENTS !== 'true') {
    return NextResponse.json(
      { error: 'Comments are currently disabled' },
      { status: 403 }
    );
  }

  let body: CommentRequest;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }

  const { _id, name, email, comment } = body;

  if (!_id || !name || !email || !comment) {
    return NextResponse.json(
      { error: 'Missing required fields: _id, name, email, comment' },
      { status: 400 }
    );
  }

  // Check if write token is available (server-side only)
  const writeToken = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
  if (!writeToken) {
    return NextResponse.json(
      { error: 'SANITY_API_READ_TOKEN or SANITY_API_WRITE_TOKEN is required for comment creation. Token must have Write permissions.' },
      { status: 500 }
    );
  }

  try {
    await client.create({
      _type: 'comment',
      post: {
        _type: 'reference',
        _ref: _id,
      },
      name,
      email,
      comment,
      approved: false, // Comments require approval
    });

    return NextResponse.json({ message: 'Message Sent Successfully' });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to submit comment';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
