import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GoogleGenAI } from "@google/genai";


interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
    chat: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      type: string;
    };
    date: number;
    text?: string;
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chatbotId: string }> }
) {
  try {
    const { chatbotId } = await params;
    const update: TelegramUpdate = await request.json();

    console.log('Received Telegram webhook:', JSON.stringify(update, null, 2));

    // Only handle text messages
    if (!update.message || !update.message.text) {
      return NextResponse.json({ ok: true });
    }

    const message = update.message;
    const chatId = message.chat.id;
    const userMessage = message.text;
    const userId = message.from.id;

    // Validate chatbotId
    if (!chatbotId) {
      console.error('Missing chatbotId parameter');
      return NextResponse.json({ error: 'Invalid chatbot ID' }, { status: 400 });
    }

    // Get chatbot and Telegram bot configuration
    const supabase = await createClient();
    
    const { data: chatbotData, error: chatbotError } = await supabase
      .from('chatbots')
      .select(`
        *,
        chatbot_telegram_bots!inner (
          id,
          bot_token,
          bot_username,
          is_active,
          session
        )
      `)
      .eq('id', chatbotId)
      .eq('chatbot_telegram_bots.is_active', true)
      .single();

    if (chatbotError || !chatbotData) {
      console.error('Chatbot or Telegram bot not found:', chatbotError);
      return NextResponse.json({ error: 'Chatbot not found' }, { status: 404 });
    }

    const botToken = chatbotData.chatbot_telegram_bots[0].bot_token;
    const telegramBotId = chatbotData.chatbot_telegram_bots[0].id;

    // Handle /start command
    if (userMessage === '/start') {
      // Set session to true in chatbot_telegram_bots table
      try {
        const { error: sessionError } = await supabase
          .from('chatbot_telegram_bots')
          .update({ 
            session: true,
            updated_at: new Date().toISOString()
          })
          .eq('chatbot_id', chatbotId)
          .eq('is_active', true);

        if (sessionError) {
          console.error('Failed to start session:', sessionError);
          await sendTelegramMessage(botToken, chatId, 'Maaf, terjadi kesalahan saat memulai sesi. Silakan coba lagi.');
          return NextResponse.json({ error: 'Failed to start session' }, { status: 500 });
        }

        console.log(`Session started for chatbot ${chatbotId}, user ${userId}, chat ${chatId}`);
        
        // Store session start in conversations table
        try {
          await supabase.from('telegram_conversations').insert({
            chatbot_id: chatbotId,
            telegram_user_id: userId.toString(),
            telegram_chat_id: chatId.toString(),
            user_message: '/start',
            timestamp: new Date().toISOString(),
          });
        } catch (insertError) {
          console.warn('Failed to store /start command:', insertError);
        }
        
      } catch (error) {
        console.error('Error starting session:', error);
        await sendTelegramMessage(botToken, chatId, 'Maaf, terjadi kesalahan saat memulai sesi. Silakan coba lagi.');
        return NextResponse.json({ error: 'Failed to start session' }, { status: 500 });
      }

      const welcomeMessage = chatbotData.welcome_message || 'Hello! How can I help you today?';
      await sendTelegramMessage(botToken, chatId, welcomeMessage);
      return NextResponse.json({ ok: true });
    }

    // Handle /end command to stop session
    if (userMessage === '/end') {
      try {
        const { error: sessionError } = await supabase
          .from('chatbot_telegram_bots')
          .update({ 
            session: false,
            updated_at: new Date().toISOString()
          })
          .eq('chatbot_id', chatbotId)
          .eq('is_active', true);

        if (sessionError) {
          console.error('Failed to end session:', sessionError);
          await sendTelegramMessage(botToken, chatId, 'Maaf, terjadi kesalahan saat mengakhiri sesi.');
          return NextResponse.json({ error: 'Failed to end session' }, { status: 500 });
        }

        console.log(`Session ended for chatbot ${chatbotId}, user ${userId}, chat ${chatId}`);
        
        // Store session end in conversations table
        try {
          await supabase.from('telegram_conversations').insert({
            chatbot_id: chatbotId,
            telegram_user_id: userId.toString(),
            telegram_chat_id: chatId.toString(),
            user_message: '/end',
            timestamp: new Date().toISOString(),
          });
        } catch (insertError) {
          console.warn('Failed to store /end command:', insertError);
        }

        await sendTelegramMessage(botToken, chatId, 'Sesi telah berakhir. Gunakan /start untuk memulai sesi baru.');
        return NextResponse.json({ ok: true });
        
      } catch (error) {
        console.error('Error ending session:', error);
        await sendTelegramMessage(botToken, chatId, 'Maaf, terjadi kesalahan saat mengakhiri sesi.');
        return NextResponse.json({ error: 'Failed to end session' }, { status: 500 });
      }
    }

    // Check if session is active by checking session column in chatbot_telegram_bots
    if (!chatbotData.chatbot_telegram_bots[0].session) {
      // Session is false - ignore the message
      console.log(`No active session found for user ${userId} in chat ${chatId}. Ignoring message. Use /start to begin a session.`);
      console.log(chatbotData.chatbot_telegram_bots[0].session)
      return NextResponse.json({ ok: true, ignored: true });
    }

    // Store the user message for conversation history
    try {
      await supabase.from('telegram_conversations').insert({
        chatbot_id: chatbotId,
        telegram_user_id: userId.toString(),
        telegram_chat_id: chatId.toString(),
        user_message: userMessage,
        timestamp: new Date().toISOString(),
      });
    } catch (insertError) {
      console.warn('Failed to store conversation:', insertError);
      // Continue processing even if storage fails
    }

    // Generate AI response using RAG system (similar to index.js implementation)
    try {
      let aiResponse;

      // Get context from RAG service (using same endpoint as index.js)
      const contextualChunks = await getContextFromRAG(userMessage!, chatbotId);
      
      if (contextualChunks && contextualChunks.length > 0) {
        // Generate response using the context (similar to index.js generateResponse function)
        aiResponse = await generateResponseWithContext(userMessage!, contextualChunks, chatbotData);
      } else {
        // No relevant context found, use fallback
        aiResponse = chatbotData.fallback_message || "Maaf, saya tidak dapat menemukan informasi yang relevan untuk pertanyaan Anda. Bisakah Anda mencoba dengan pertanyaan yang lebih spesifik?";
      }

      // Validate aiResponse before sending
      if (!aiResponse) {
        aiResponse = chatbotData.fallback_message || "Maaf, saya tidak dapat memproses pertanyaan Anda saat ini. Silakan coba lagi nanti.";
      }

      // Send response to Telegram
      await sendTelegramMessage(botToken, chatId, aiResponse);

      // Store AI response
      try {
        await supabase.from('telegram_conversations').insert({
          chatbot_id: chatbotId,
          telegram_user_id: userId.toString(),
          telegram_chat_id: chatId.toString(),
          ai_response: aiResponse,
          timestamp: new Date().toISOString(),
        });

        console.log('AI response stored for user:', userId);
      } catch (insertError) {
        console.warn('Failed to store AI response:', insertError);
      }

    } catch (aiError) {
      console.error('AI processing error:', aiError);
      
      // Send fallback message
      const fallbackMessage = chatbotData.fallback_message || "I'm sorry, I'm having trouble processing your request right now. Please try again later.";
      await sendTelegramMessage(botToken, chatId, fallbackMessage);
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Fungsi untuk mendapatkan konteks dari RAG service (menggunakan referensi handleSearch dari knowledge-base-manager.tsx)
async function getContextFromRAG(message: string, chatbotId: string) {
  try {
    // Menggunakan endpoint yang sama dengan searchDocuments di useRAGSystem hook
    const ragApiUrl = process.env.RAG_SERVICE_URL || process.env.RAG_BASE_URL || 'https://sort-edit-creatures-tall.trycloudflare.com';
    const apiUrl = `${ragApiUrl}/api/v1/ragly/chatbots/${chatbotId}/query`;
    
    // Menggunakan FormData seperti di handleSearch
    const formData = new FormData();
    formData.append('query', message);
    formData.append('k', '5'); // Mengambil 5 hasil teratas untuk konteks

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.error('RAG service error:', response.status, response.statusText);
      const errorData = await response.json().catch(() => ({}));
      console.error('RAG service error details:', errorData);
      return [];
    }

    const data = await response.json();
    console.log('RAG response:', data); // Log untuk debugging
    return data.results || [];
  } catch (error) {
    console.error('❌ Error mengakses RAG service:', error);
    return [];
  }
}

// Fungsi untuk generate response menggunakan context (menggunakan struktur SearchResult)
async function generateResponseWithContext(
  message: string,
  contextualChunks: any[],
  chatbotData: any
) {
  const combinedContext = contextualChunks
    .map(chunk => chunk?.content || chunk?.text || '')
    .join('\n\n---\n\n');

  const prompt = `
Kamu adalah asisten cerdas yang menjawab pertanyaan hanya berdasarkan informasi yang diberikan dari dokumen internal. berikan jawaban profesional yang panjang. Jika jawabannya tidak ditemukan di dokumen, katakan dengan jujur bahwa kamu tidak tahu atau informasinya tidak tersedia.
ATURAN PENTING:
- Jawaban HARUS berupa teks biasa (plain text).
- JANGAN gunakan format markdown apa pun.
- JANGAN gunakan simbol seperti *, _, \`, <, >, [, ], (, ).
- JANGAN gunakan bullet point dengan simbol khusus.
- Gunakan kalimat biasa dan paragraf sederhana.
- Jika informasi tidak ada di dokumen, katakan dengan jujur bahwa informasi tidak tersedia.

=== KONTEKS DOKUMEN ===
${combinedContext}
=== AKHIR KONTEKS ===

PERTANYAAN PENGGUNA:
${message}

GAYA BAHASA:
${chatbotData.personality || 'Ramah, profesional, dan jelas'}

JAWABAN (teks biasa tanpa simbol khusus):
`;

  return generateWithGemini(prompt);
}


// Fungsi untuk generate response dengan Gemini menggunakan Google GenAI SDK
async function generateWithGemini(prompt: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash", // ✅ FREE SAFE
      contents: prompt,

    });

    return result.text || "Maaf, saya belum bisa menjawab pertanyaan tersebut.";
  } catch (err: any) {
    // ✅ HANDLE RATE LIMIT
    if (err?.status === 429) {
      return "⚠️ Sistem sedang sibuk. Silakan coba lagi beberapa saat.";
    }
    throw err;
  }
}


// Fallback function untuk OpenAI
async function generateWithOpenAI(message: string, context: string, chatbotData: any) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://1284aa66cc28.ngrok-free.app'}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `Kamu adalah asisten yang membantu menjawab pertanyaan berdasarkan konteks yang diberikan. Jika konteks tidak mengandung informasi yang relevan, katakan dengan jujur bahwa informasi tersebut tidak tersedia.\n\nKonteks:\n${context}\n\nPersonalitas: ${chatbotData.personality || 'Jadilah ramah, profesional, dan membantu'}`
          },
          {
            role: 'user',
            content: message
          }
        ],
        chatbot_id: chatbotData.id,
      }),
    });

    if (response.ok) {
      const chatData = await response.json();
      return chatData.content || chatData.message;
    } else {
      throw new Error(`OpenAI API error: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Error with OpenAI API:', error);
    throw error;
  }
}

async function sendTelegramMessage(botToken: string, chatId: number, text: string) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown',
      }),
    });

    const data = await response.json();
    
    if (!data.ok) {
      console.error('Failed to send Telegram message:', data);
    }

    return data;
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    throw error;
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Telegram webhook endpoint' });
}
