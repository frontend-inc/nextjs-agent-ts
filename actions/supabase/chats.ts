'use server';

import { supabase } from '@/actions/supabase/client';

export async function createChat(id: string, title: string, userId: string) {
  const { data, error } = await supabase
    .from('chats')
    .insert({ id, title, user_id: userId })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function listChats(userId: string) {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function deleteChat(chatId: string) {
  await supabase.from('messages').delete().eq('chat_id', chatId);

  const { error } = await supabase.from('chats').delete().eq('id', chatId);
  if (error) throw new Error(error.message);
}
