import { getMessages } from '@/actions/supabase/messages';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: chatId } = await params;
    const messages = await getMessages(chatId);
    return Response.json({ messages });
  } catch (error) {
    console.error('Fetch messages error:', error);
    return Response.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
