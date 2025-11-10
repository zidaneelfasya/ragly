import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { generateThreadTitle } from "@/lib/chat-utils";

export async function POST(request: NextRequest) {
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

    const { title, firstMessage } = await request.json();

    // Auto-generate title from first message if not provided
    const threadTitle = title?.trim() || (firstMessage?.content ? generateThreadTitle(firstMessage.content) : 'New Conversation');

    // Create new thread
    const { data: thread, error: threadError } = await supabase
      .from('threads')
      .insert({
        title: threadTitle,
        user_id: user.id
      })
      .select()
      .single();

    if (threadError) {
      console.error('Error creating thread:', threadError);
      return NextResponse.json(
        { error: "Failed to create thread" },
        { status: 500 }
      );
    }

    // If there's a first message, add it to the thread
    if (firstMessage?.content?.trim()) {
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          content: firstMessage.content.trim(),
          role: firstMessage.role || 'user',
          thread_id: thread.id
        });

      if (messageError) {
        console.error('Error creating first message:', messageError);
        // Still return the thread even if message creation fails
      }
    }

    return NextResponse.json(thread, { status: 201 });

  } catch (error) {
    console.error('Error in create thread API:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
