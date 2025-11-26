import { NextRequest, NextResponse } from 'next/server';

const FASTAPI_BACKEND_URL = process.env.FASTAPI_BACKEND_URL || 'http://localhost:8000';

// POST /api/files/posts/:post_id/attach - Attach files to post
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ post_id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { detail: 'Authorization header required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { post_id } = await params;

    const response = await fetch(
      `${FASTAPI_BACKEND_URL}/api/v1/files/posts/${post_id}/attach`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('File attach proxy error:', error);
    return NextResponse.json(
      { detail: 'Failed to attach files' },
      { status: 500 }
    );
  }
}
