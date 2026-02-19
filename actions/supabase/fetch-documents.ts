'use server';

import { supabase } from '@/services/supabase/client';

export async function fetchPublishedDocuments(query?: string) {
  let request = supabase
    .from('documents')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (query) {
    request = request.ilike('title', `%${query}%`);
  }

  const { data, error } = await request;

  if (error) throw new Error(error.message);
  return data || [];
}
