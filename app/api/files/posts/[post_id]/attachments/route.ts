import { NextRequest, NextResponse } from 'next/server';

const FASTAPI_BACKEND_URL = process.env.FASTAPI_BACKEND_URL || 'http://localhost:8000';

// GET /api/files/posts/:post_id/attachments - Get post attachments
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ post_id: string }> }
) {
  try {
    const { post_id } = await params;

    const response = await fetch(
      `${FASTAPI_BACKEND_URL}/api/v1/files/posts/${post_id}/attachments`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Get attachments proxy error:', error);
    return NextResponse.json(
      { detail: 'Failed to get attachments' },
      { status: 500 }
    );
  }
}
