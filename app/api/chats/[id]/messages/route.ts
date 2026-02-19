import { supabase } from '@/actions/supabase/client';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: chatId } = await params;

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    const messages = (data || []).map((msg) => ({
      role: msg.role,
      parts: msg.parts,
    }));

    return Response.json({ messages });
  } catch (error) {
    console.error('Fetch messages error:', error);
    return Response.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
