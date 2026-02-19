import { supabase } from '@/actions/supabase/client';
import { NextRequest, NextResponse } from 'next/server';

const BUCKET = 'apps';
const FOLDER = process.env.NEXT_PUBLIC_FRONTEND_APP_ID!;

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const filePath = `${FOLDER}/${crypto.randomUUID()}-${file.name}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(filePath);

  return NextResponse.json({ url: urlData.publicUrl });
}

export async function GET() {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(FOLDER);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const files = (data || []).map((file) => {
    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(`${FOLDER}/${file.name}`);
    return { url: urlData.publicUrl, filename: file.name };
  });

  return NextResponse.json({ files });
}

export async function DELETE(request: NextRequest) {
  const { url } = await request.json();

  if (!url) {
    return NextResponse.json({ error: 'No url provided' }, { status: 400 });
  }

  const pathMatch = url.split(`/storage/v1/object/public/${BUCKET}/`)[1];
  if (!pathMatch) {
    return NextResponse.json({ error: 'Invalid file URL' }, { status: 400 });
  }

  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([pathMatch]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
