import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Auth error in threads API:', userError);
      return NextResponse.json(
        { error: "Authentication failed" }, 
        { status: 401 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" }, 
        { status: 401 }
      );
    }

    // Fetch threads with message count and latest message for preview
    const { data: threads, error } = await supabase
      .from('threads')
      .select(`
        id,
        title,
        created_at,
        updated_at,
        messages(
          id,
          content,
          created_at,
          role
        )
      `)
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Database error fetching threads:', error);
      return NextResponse.json(
        { 
          error: "Failed to fetch chat history",
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      );
    }

    // Transform data for frontend
    const chatHistory = threads?.map(thread => {
      const messages = Array.isArray(thread.messages) ? thread.messages : [];
      const latestMessage = messages.length > 0 
        ? messages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
        : null;

      // Create preview from latest message (truncate to 100 chars)
      const preview = latestMessage?.content 
        ? latestMessage.content.length > 100 
          ? latestMessage.content.substring(0, 100) + '...'
          : latestMessage.content
        : 'No messages yet';

      return {
        id: thread.id,
        title: thread.title,
        preview,
        date: new Date(thread.updated_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        }),
        message_count: messages.length,
        updated_at: thread.updated_at
      };
    }) || [];

    return NextResponse.json(chatHistory);

  } catch (error) {
    console.error('Error in threads API:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
