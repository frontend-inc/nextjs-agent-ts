'use server';

import { supabase } from '@/actions/supabase/client';

const BUCKET = 'apps';
const FOLDER = process.env.NEXT_PUBLIC_SUPABASE_FOLDER_ID!;

export async function uploadFile(formData: FormData): Promise<{ url: string }> {
  const file = formData.get('file') as File;
  if (!file) throw new Error('No file provided');

  const filePath = `${FOLDER}/${crypto.randomUUID()}-${file.name}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file);

  if (error) throw new Error(error.message);

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(filePath);

  return { url: urlData.publicUrl };
}
