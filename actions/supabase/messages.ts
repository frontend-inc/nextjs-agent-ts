'use server';

import { supabase } from '@/actions/supabase/client';

export async function getMessages(chatId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);

  return (data || []).map((msg) => ({
    role: msg.role,
    parts: msg.parts,
  }));
}

export async function insertMessages(
  messages: Array<{ chat_id: string; role: string; parts: unknown }>
) {
  const { error } = await supabase.from('messages').insert(messages);
  if (error) throw new Error(error.message);
}
