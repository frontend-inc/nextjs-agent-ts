import { supabase } from '@/actions/supabase/client';
import { NextRequest } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: chatId } = await params;

    // Delete messages first (foreign key)
    await supabase.from('messages').delete().eq('chat_id', chatId);

    const { error } = await supabase.from('chats').delete().eq('id', chatId);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Delete chat error:', error);
    return Response.json({ error: 'Failed to delete chat' }, { status: 500 });
  }
}
