import { uploadFile, listFiles, deleteFile } from '@/services/frontend-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const result = await uploadFile(file);
  return NextResponse.json(result);
}

export async function GET() {
  const result = await listFiles();
  return NextResponse.json(result);
}

export async function DELETE(request: NextRequest) {
  const { url } = await request.json();

  if (!url) {
    return NextResponse.json({ error: 'No url provided' }, { status: 400 });
  }

  await deleteFile(url);
  return NextResponse.json({ success: true });
}
