import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    const body = await request.json();
    const { botToken, botUsername, chatbotId } = body;

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate input
    if (!botToken || !botUsername || !chatbotId) {
      return NextResponse.json({ 
        error: 'Bot token, username, and chatbot ID are required' 
      }, { status: 400 });
    }

    // Validate bot token format
    if (!botToken.includes(':')) {
      return NextResponse.json({ 
        error: 'Invalid bot token format' 
      }, { status: 400 });
    }

    // Verify the chatbot belongs to the user
    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .select('id, user_id, name')
      .eq('id', chatbotId)
      .eq('user_id', user.id)
      .single();

    if (chatbotError || !chatbot) {
      return NextResponse.json({ 
        error: 'Chatbot not found or unauthorized' 
      }, { status: 404 });
    }

    // Validate the Telegram bot token by calling Telegram API
    try {
      const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
      const telegramData = await telegramResponse.json();

      if (!telegramData.ok) {
        return NextResponse.json({ 
          error: 'Invalid bot token. Please check your token and try again.' 
        }, { status: 400 });
      }

      // Check if username matches
      const actualUsername = telegramData.result.username;
      const providedUsername = botUsername.replace('@', '');
      
      if (actualUsername !== providedUsername) {
        return NextResponse.json({ 
          error: `Username mismatch. Expected @${actualUsername}, got @${providedUsername}` 
        }, { status: 400 });
      }

    } catch (telegramError) {
      console.error('Telegram API error:', telegramError);
      return NextResponse.json({ 
        error: 'Failed to validate bot token with Telegram API' 
      }, { status: 500 });
    }

    // Set up webhook URL
    const webhookUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://1284aa66cc28.ngrok-free.app'}/api/telegram/webhook/${chatbotId}`;
    
    try {
      const webhookResponse = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ['message', 'edited_message'],
        }),
      });

      const webhookData = await webhookResponse.json();

      if (!webhookData.ok) {
        console.error('Webhook setup failed:', webhookData);
        return NextResponse.json({ 
          error: 'Failed to set up Telegram webhook' 
        }, { status: 500 });
      }

    } catch (webhookError) {
      console.error('Webhook setup error:', webhookError);
      return NextResponse.json({ 
        error: 'Failed to configure Telegram webhook' 
      }, { status: 500 });
    }

    // Store the Telegram bot information in the database
    const { error: insertError } = await supabase
      .from('chatbot_telegram_bots')
      .insert({
        chatbot_id: chatbotId,
        bot_token: botToken, // In production, encrypt this
        bot_username: botUsername,
        webhook_url: webhookUrl,
        is_active: true,
        created_at: new Date().toISOString(),
        user_id: user.id,
      });

    if (insertError) {
      console.error('Database insert error:', insertError);
      
      // If it's a duplicate entry, update instead
      if (insertError.code === '23505') { // Unique constraint violation
        const { error: updateError } = await supabase
          .from('chatbot_telegram_bots')
          .update({
            bot_token: botToken,
            bot_username: botUsername,
            webhook_url: webhookUrl,
            is_active: true,
            updated_at: new Date().toISOString(),
          })
          .eq('chatbot_id', chatbotId)
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Database update error:', updateError);
          return NextResponse.json({ 
            error: 'Failed to update Telegram bot configuration' 
          }, { status: 500 });
        }
      } else {
        return NextResponse.json({ 
          error: 'Failed to save Telegram bot configuration' 
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Telegram bot created successfully',
      webhookUrl,
      botUsername,
    });

  } catch (error) {
    console.error('Error creating Telegram bot:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get Telegram bot configuration for this chatbot
    const { data: telegramBot, error } = await supabase
      .from('chatbot_telegram_bots')
      .select('*')
      .eq('chatbot_id', id)
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error fetching Telegram bot:', error);
      return NextResponse.json(
        { error: 'Failed to fetch Telegram bot configuration' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      telegramBot: telegramBot || null,
      hasBot: !!telegramBot,
    });

  } catch (error) {
    console.error('Error in GET telegram bot:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the Telegram bot to remove webhook
    const { data: telegramBot, error: fetchError } = await supabase
      .from('chatbot_telegram_bots')
      .select('bot_token')
      .eq('chatbot_id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !telegramBot) {
      return NextResponse.json(
        { error: 'Telegram bot not found' },
        { status: 404 }
      );
    }

    // Remove webhook from Telegram
    try {
      await fetch(`https://api.telegram.org/bot${telegramBot.bot_token}/deleteWebhook`);
    } catch (webhookError) {
      console.warn('Failed to remove Telegram webhook:', webhookError);
      // Continue with database deletion even if webhook removal fails
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('chatbot_telegram_bots')
      .delete()
      .eq('chatbot_id', id)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Database delete error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete Telegram bot configuration' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Telegram bot removed successfully',
    });

  } catch (error) {
    console.error('Error deleting Telegram bot:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
