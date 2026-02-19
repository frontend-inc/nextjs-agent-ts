import { supabase } from '@/actions/supabase/client';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { id, title, user_id } = await request.json();

    const { data, error } = await supabase
      .from('chats')
      .insert({ id, title, user_id })
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

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

    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ chats: data });
  } catch (error) {
    console.error('List chats error:', error);
    return Response.json({ error: 'Failed to list chats' }, { status: 500 });
  }
}
