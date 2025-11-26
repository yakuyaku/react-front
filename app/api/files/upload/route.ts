import { NextRequest, NextResponse } from 'next/server';

const FASTAPI_BACKEND_URL = process.env.FASTAPI_BACKEND_URL || 'http://localhost:8000';

// POST /api/files/upload - Upload file
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { detail: 'Authorization header required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const isPublic = formData.get('is_public');
    const isTemp = formData.get('is_temp');

    if (!file) {
      return NextResponse.json(
        { detail: 'File is required' },
        { status: 400 }
      );
    }

    // Create new FormData for backend
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    // Build query params
    const params = new URLSearchParams();
    if (isPublic !== null) params.append('is_public', isPublic as string);
    if (isTemp !== null) params.append('is_temp', isTemp as string);

    const url = `${FASTAPI_BACKEND_URL}/api/v1/files/upload${params.toString() ? `?${params.toString()}` : ''}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
      },
      body: backendFormData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('File upload proxy error:', error);
    return NextResponse.json(
      { detail: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
