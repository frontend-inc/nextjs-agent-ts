import { createChat, listChats } from '@/actions/supabase/chats';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { id, title, user_id } = await request.json();
    const data = await createChat(id, title, user_id);
    return Response.json(data);
  } catch (error) {
    console.error('Create chat error:', error);
    return Response.json({ error: 'Failed to create chat' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return Response.json({ error: 'userId is required' }, { status: 400 });
    }

    const chats = await listChats(userId);
    return Response.json({ chats });
  } catch (error) {
    console.error('List chats error:', error);
    return Response.json({ error: 'Failed to list chats' }, { status: 500 });
  }
}
