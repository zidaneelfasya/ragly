import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { generateInitials, generateUserCode } from "@/lib/chat-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const { threadId } = params;

    // First verify the thread belongs to the user
    const { data: thread, error: threadError } = await supabase
      .from('threads')
      .select('id, title, user_id')
      .eq('id', threadId)
      .eq('user_id', user.id)
      .single();

    if (threadError || !thread) {
      return NextResponse.json(
        { error: "Thread not found or access denied" },
        { status: 404 }
      );
    }

    // Fetch messages for the thread
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      return NextResponse.json(
        { error: "Failed to fetch messages" },
        { status: 500 }
      );
    }

    // Get user profile for display info
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();

    // Transform messages for frontend
    const transformedMessages = messages?.map(message => ({
      id: message.id,
      role: message.role,
      content: message.content,
      timestamp: new Date(message.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      sender: message.role === 'user' 
        ? profile?.full_name || user.email?.split('@')[0] || 'User'
        : 'Chatbot Asik',
      code: message.role === 'user' 
        ? generateUserCode(user.id)
        : 'CHATBOT01',
      avatar: message.role === 'user' 
        ? '/generic-user-avatar.png'
        : '/chatbot-avatar.png',
      initials: message.role === 'user'
        ? generateInitials(profile?.full_name, user.email)
        : 'CA',
      isUser: message.role === 'user',
      created_at: message.created_at
    })) || [];

    return NextResponse.json({
      thread: {
        id: thread.id,
        title: thread.title
      },
      messages: transformedMessages
    });

  } catch (error) {
    console.error('Error in messages API:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const { threadId } = params;
    const { content, role = 'user' } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    // Verify thread belongs to user
    const { data: thread, error: threadError } = await supabase
      .from('threads')
      .select('id')
      .eq('id', threadId)
      .eq('user_id', user.id)
      .single();

    if (threadError || !thread) {
      return NextResponse.json(
        { error: "Thread not found or access denied" },
        { status: 404 }
      );
    }

    // Insert the new message
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        content: content.trim(),
        role,
        thread_id: threadId
      })
      .select()
      .single();

    if (messageError) {
      console.error('Error creating message:', messageError);
      return NextResponse.json(
        { error: "Failed to create message" },
        { status: 500 }
      );
    }

    // Update thread updated_at
    await supabase
      .from('threads')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', threadId);

    return NextResponse.json(message, { status: 201 });

  } catch (error) {
    console.error('Error in create message API:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
