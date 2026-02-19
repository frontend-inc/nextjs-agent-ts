import { deleteChat } from '@/actions/supabase/chats';
import { NextRequest } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: chatId } = await params;
    await deleteChat(chatId);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Delete chat error:', error);
    return Response.json({ error: 'Failed to delete chat' }, { status: 500 });
  }
}
