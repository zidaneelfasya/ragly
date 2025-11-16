import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const {
      name,
      model,
      language,
      isPublic,
      personality,
      manualKnowledge,
      welcomeMessage,
      fallbackMessage,
      tone,
      temperature,
      commands,
      files
    } = body;

    // Validate required fields
    if (!name || !model) {
      return NextResponse.json(
        { error: 'Name and model are required' },
        { status: 400 }
      );
    }

    // Insert chatbot
    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .insert([
        {
          user_id: user.id,
          name,
          model,
          language: language || 'en',
          is_public: isPublic || false,
          personality,
          manual_knowledge: manualKnowledge,
          // knowledge_url: knowledgeUrl,
          welcome_message: welcomeMessage || 'Hello! How can I help you today?',
          fallback_message: fallbackMessage || 'I apologize, but I could not find an answer to your question.',
          tone: tone || 'Friendly',
          temperature: temperature || 0.7,
          status: 'draft'
        }
      ])
      .select()
      .single();

    if (chatbotError) {
      console.error('Error creating chatbot:', chatbotError);
      return NextResponse.json(
        { error: 'Failed to create chatbot' },
        { status: 500 }
      );
    }

    // Insert commands if provided
    if (commands && commands.length > 0) {
      console.log('Commands received:', commands);
      
      const validCommands = commands.filter(
        (cmd: any) => cmd.command && cmd.command.trim() && cmd.description && cmd.description.trim()
      );

      console.log('Valid commands after filtering:', validCommands);

      if (validCommands.length > 0) {
        const commandsToInsert = validCommands.map((cmd: any) => ({
          chatbot_id: chatbot.id,
          command_name: cmd.command.trim(),
          command_description: cmd.description.trim(),
          command_action: cmd.description.trim(), // For now, use description as action
          is_active: true
        }));

        console.log('Commands to insert:', commandsToInsert);

        const { error: commandsError } = await supabase
          .from('chatbot_commands')
          .insert(commandsToInsert);

        if (commandsError) {
          console.error('Error creating commands:', commandsError);
          // Continue execution, don't fail the entire request
        } else {
          console.log('Commands created successfully');
        }
      }
    }

    // Insert files if provided (placeholder for now)
    if (files && files.length > 0) {
      const validFiles = files.filter((file: any) => file.name);

      if (validFiles.length > 0) {
        const { error: filesError } = await supabase
          .from('chatbot_rag_files')
          .insert(
            validFiles.map((file: any) => ({
              chatbot_id: chatbot.id,
              original_name: file.name,
              unique_name: file.name, // Will be updated when file upload is implemented
              path_url: '', // Will be updated when file upload is implemented
              upload_date: new Date().toISOString(),
              created_at: new Date().toISOString()
            }))
          );

        if (filesError) {
          console.error('Error creating file records:', filesError);
          // Continue execution, don't fail the entire request
        }
      }
    }

    return NextResponse.json({
      success: true,
      chatbot,
      message: 'Chatbot created successfully'
    });

  } catch (error) {
    console.error('Error in chatbot creation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's chatbots
    const { data: chatbots, error } = await supabase
      .from('chatbots')
      .select(`
        *,
        chatbot_commands (*),
        chatbot_rag_files (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching chatbots:', error);
      return NextResponse.json(
        { error: 'Failed to fetch chatbots' },
        { status: 500 }
      );
    }

    return NextResponse.json({ chatbots });

  } catch (error) {
    console.error('Error in fetching chatbots:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
