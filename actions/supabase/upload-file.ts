'use server';

import { supabase } from '@/services/supabase/client';

const BUCKET = 'apps';
const FOLDER = process.env.NEXT_PUBLIC_SUPABASE_FOLDER_ID!;

export async function uploadFile(formData: FormData): Promise<{ url: string }> {
  const file = formData.get('file') as File;
  if (!file) throw new Error('No file provided');

  const shortId = crypto.randomUUID().slice(0, 4);
  const ext = file.name.includes('.') ? `.${file.name.split('.').pop()}` : '';
  const baseName = file.name.includes('.') ? file.name.slice(0, file.name.lastIndexOf('.')) : file.name;
  const filePath = `${FOLDER}/${baseName}-${shortId}${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file);

  if (error) throw new Error(error.message);

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(filePath);

  return { url: urlData.publicUrl };
}
