import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const chatbotId = params.id;

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get specific chatbot with its commands and files
    const { data: chatbot, error } = await supabase
      .from('chatbots')
      .select(`
        *,
        chatbot_commands (*),
        chatbot_rag_files (*)
      `)
      .eq('id', chatbotId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching chatbot:', error);
      return NextResponse.json(
        { error: 'Chatbot not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ chatbot });

  } catch (error) {
    console.error('Error in fetching chatbot:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const chatbotId = params.id;

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
      knowledgeUrl,
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

    // Update chatbot
    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .update({
        name,
        model,
        language: language || 'en',
        is_public: isPublic || false,
        personality,
        manual_knowledge: manualKnowledge,
        knowledge_url: knowledgeUrl,
        welcome_message: welcomeMessage || 'Hello! How can I help you today?',
        fallback_message: fallbackMessage || 'I apologize, but I could not find an answer to your question.',
        tone: tone || 'Friendly',
        temperature: temperature || 0.7,
        updated_at: new Date().toISOString()
      })
      .eq('id', chatbotId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (chatbotError) {
      console.error('Error updating chatbot:', chatbotError);
      return NextResponse.json(
        { error: 'Failed to update chatbot' },
        { status: 500 }
      );
    }

    // Delete existing commands and insert new ones
    await supabase
      .from('chatbot_commands')
      .delete()
      .eq('chatbot_id', chatbotId);

    if (commands && commands.length > 0) {
      const validCommands = commands.filter(
        (cmd: any) => cmd.command && cmd.command.trim() && cmd.description && cmd.description.trim()
      );

      if (validCommands.length > 0) {
        const { error: commandsError } = await supabase
          .from('chatbot_commands')
          .insert(
            validCommands.map((cmd: any) => ({
              chatbot_id: chatbotId,
              command_name: cmd.command.trim(),
              command_description: cmd.description.trim(),
              command_action: cmd.description.trim(),
              is_active: true
            }))
          );

        if (commandsError) {
          console.error('Error updating commands:', commandsError);
        }
      }
    }

    // Handle file updates (for now, just log)
    if (files && files.length > 0) {
      console.log('Files to update:', files);
      // File update logic will be implemented when file upload is added
    }

    return NextResponse.json({
      success: true,
      chatbot,
      message: 'Chatbot updated successfully'
    });

  } catch (error) {
    console.error('Error in chatbot update:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const chatbotId = params.id;

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete chatbot (this will cascade delete commands and files due to foreign key constraints)
    const { error: deleteError } = await supabase
      .from('chatbots')
      .delete()
      .eq('id', chatbotId)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error deleting chatbot:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete chatbot' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Chatbot deleted successfully'
    });

  } catch (error) {
    console.error('Error in chatbot deletion:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
