import { NextRequest, NextResponse } from 'next/server';

const FASTAPI_BACKEND_URL = process.env.FASTAPI_BACKEND_URL || 'http://localhost:8000';

// POST /api/comments/posts/:postId - Create comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { detail: 'Authorization header required' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await fetch(
      `${FASTAPI_BACKEND_URL}/api/v1/comments/posts/${postId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: JSON.stringify(body),
      }
    );

    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', text);
      return NextResponse.json(
        { detail: `Backend error: ${text.substring(0, 100)}` },
        { status: response.status }
      );
    }

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Comment create proxy error:', error);
    return NextResponse.json(
      { detail: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
