import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// LLM Service Configuration
const LLM_SERVICE_URL = process.env.LLM_SERVICE_URL || 'http://localhost:8000';

// In-memory deduplication cache for processed update_ids
// Stores update_id with expiration timestamp (5 minutes)
const processedUpdates = new Map<number, number>();
const DEDUP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

// Cleanup expired entries every minute
setInterval(() => {
  const now = Date.now();
  for (const [updateId, expiry] of processedUpdates.entries()) {
    if (now > expiry) {
      processedUpdates.delete(updateId);
    }
  }
}, 60 * 1000);

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

// ========================================
// DECISION TYPES - Decision-based routing
// ========================================
const DECISION_TYPES = {
  NO_RAG: 'NO_RAG',       // Sapaan, small talk, percakapan umum
  RAG: 'RAG',             // Pertanyaan membutuhkan knowledge base
  CLARIFY: 'CLARIFY'      // Pertanyaan ambigu butuh klarifikasi
} as const;

// Model configuration for efficiency
// const DECISION_MODEL = "gemini-2.5-flash-lite";  // Ringan & cepat untuk routing
// const RESPONSE_MODEL = "gemini-2.5-flash";        // Kualitas tinggi untuk response

// ========================================
// QUOTA ERROR HANDLER
// ========================================
function isQuotaError(error: any): boolean {
  return error && error.message && (
    error.message.includes('429') || 
    error.message.includes('Too Many Requests') ||
    error.message.includes('quota') ||
    error.message.includes('Quota exceeded')
  );
}

function getQuotaExceededMessage(): string {
  return "Maaf, sistem kami sedang mengalami keterbatasan kapasitas saat ini. 😔\n\n" +
         "Hal ini terjadi karena volume penggunaan yang tinggi. Kami mohon maaf atas ketidaknyamanan ini.\n\n" +
         "Silakan coba lagi beberapa saat lagi (sekitar 1-2 menit) atau hubungi admin untuk bantuan lebih lanjut. 🙏";
}

// ========================================
// DECISION ROUTER: LLM-based intent classification
// ========================================
/**
 * Decision Router menggunakan LLM service untuk klasifikasi intent
 * HANYA mengembalikan decision type, TIDAK menjawab user
 */
async function decisionRouter(message: string, chatbotData: any): Promise<string> {
  try {
    console.log('\n🔍 [Decision Router] Calling LLM service for intent classification');
    console.log(`  - LLM Service URL: ${LLM_SERVICE_URL}/decision`);
    console.log(`  - Message: "${message}"`);
    
    const response = await fetch(`${LLM_SERVICE_URL}/decision`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        config: {
          bot_name: chatbotData.name || 'Assistant',
          bot_role: chatbotData.personality || 'helpful AI assistant',
          domain_context: chatbotData.personality,
          response_language: 'Indonesian',
        }
      }),
    });

    console.log(`  - Response Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to read error');
      console.error(`❌ [Decision Router] LLM service error: ${response.status}`);
      console.error(`  - Error Details: ${errorText}`);
      console.log('  - Fallback: Using RAG');
      return DECISION_TYPES.RAG; // Fallback
    }

    const data = await response.json();
    console.log('  - Response Data:', JSON.stringify(data));
    const decision = data.decision?.toUpperCase() || 'RAG';

    // Validasi output
    if (Object.values(DECISION_TYPES).includes(decision as any)) {
      console.log(`✅ [Decision Router] Decision: ${decision}`);
      return decision;
    }

    // Fallback jika output tidak sesuai
    console.warn(`⚠️  [Decision Router] Invalid decision: "${decision}", using RAG as fallback`);
    return DECISION_TYPES.RAG;

  } catch (error: any) {
    console.error('❌ [Decision Router] Exception caught:', error.message);
    console.error('  - Error Stack:', error.stack);
    console.log('  - Fallback: Using RAG');
    // Fallback ke RAG untuk keamanan
    return DECISION_TYPES.RAG;
  }
}

// ========================================
// RESPONSE WITHOUT RAG: Jawaban natural tanpa RAG
// ========================================
async function generateResponseWithoutRAG(message: string, chatbotData: any): Promise<string> {
  try {
    console.log('\n💬 [No RAG Response] Generating conversational response');
    console.log(`  - LLM Service URL: ${LLM_SERVICE_URL}/generate`);
    console.log(`  - Mode: NO_RAG`);
    
    const response = await fetch(`${LLM_SERVICE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        mode: 'NO_RAG',
        config: {
          bot_name: chatbotData.name || 'Assistant',
          bot_role: chatbotData.personality || 'helpful AI assistant',
          domain_context: chatbotData.personality,
          greeting_style: 'friendly and professional',
          response_language: 'Indonesian',
          max_response_length: '2-3 sentences',
          use_emojis: true,
        }
      }),
    });

    console.log(`  - Response Status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to read error');
      console.error(`❌ [No RAG Response] LLM service error: ${response.status}`);
      console.error(`  - Error Details: ${errorText}`);
      console.log('  - Using fallback message');
      return chatbotData.welcome_message || "Halo! Ada yang bisa saya bantu? 😊";
    }

    const data = await response.json();
    console.log('✅ [No RAG Response] Generated successfully');
    console.log(`  - Reply: "${data.reply}"`);
    return data.reply || "Halo! Ada yang bisa saya bantu? 😊";
    
  } catch (error: any) {
    console.error('❌ [No RAG Response] Exception:', error.message);
    console.error('  - Stack:', error.stack);
    console.log('  - Using fallback message');
    return chatbotData.welcome_message || "Halo! Ada yang bisa saya bantu? 😊";
  }
}

// ========================================
// RESPONSE WITH CLARIFICATION: Minta klarifikasi domain-guided (TANPA RAG)
// ========================================
async function generateClarificationResponse(message: string, chatbotData: any): Promise<string> {
  try {
    console.log('\n🤔 [Clarification] Generating clarification request');
    console.log(`  - LLM Service URL: ${LLM_SERVICE_URL}/generate`);
    console.log(`  - Mode: CLARIFY`);
    
    const response = await fetch(`${LLM_SERVICE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        mode: 'CLARIFY',
        config: {
          bot_name: chatbotData.name || 'Assistant',
          bot_role: chatbotData.personality || 'helpful AI assistant',
          domain_context: chatbotData.personality,
          response_language: 'Indonesian',
          use_emojis: true,
        }
      }),
    });

    console.log(`  - Response Status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to read error');
      console.error(`❌ [Clarification] LLM service error: ${response.status}`);
      console.error(`  - Error Details: ${errorText}`);
      console.log('  - Using fallback message');
      return "Maaf, pertanyaan Anda masih terlalu umum. Bisa lebih spesifik? 🤔\n\nSilakan tanyakan pertanyaan yang lebih detail agar saya bisa membantu dengan lebih baik. 🙏";
    }

    const data = await response.json();
    console.log('✅ [Clarification] Generated successfully');
    console.log(`  - Reply: "${data.reply}"`);
    return data.reply || "Maaf, pertanyaan Anda masih terlalu umum. Bisa lebih spesifik? 🤔";
    
  } catch (error: any) {
    console.error('❌ [Clarification] Exception:', error.message);
    console.error('  - Stack:', error.stack);
    console.log('  - Using fallback message');
    return "Maaf, pertanyaan Anda masih terlalu umum. Bisa lebih spesifik? 🤔\n\nSilakan tanyakan pertanyaan yang lebih detail agar saya bisa membantu dengan lebih baik. 🙏";
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chatbotId: string }> }
) {
  const startTime = Date.now();
  console.log('\n' + '='.repeat(80));
  console.log('🚀 TELEGRAM WEBHOOK RECEIVED');
  console.log('='.repeat(80));
  
  try {
    const { chatbotId } = await params;
    console.log('📋 Chatbot ID:', chatbotId);
    
    const update: TelegramUpdate = await request.json();
    console.log('📦 Raw Update:', JSON.stringify(update, null, 2));

    // ========================================
    // DEDUPLICATION: Check if already processed
    // ========================================
    const updateId = update.update_id;
    if (processedUpdates.has(updateId)) {
      console.log('⏭️  DUPLICATE DETECTED: Update', updateId, 'already processed');
      console.log('  - This is a Telegram retry/duplicate, ignoring');
      console.log('='.repeat(80) + '\n');
      return NextResponse.json({ ok: true, duplicate: true });
    }

    // Mark as processed immediately (before any async work)
    processedUpdates.set(updateId, Date.now() + DEDUP_EXPIRY_MS);
    console.log('✅ Update', updateId, 'marked as processed');

    // Only handle text messages
    if (!update.message || !update.message.text) {
      console.log('⚠️  SKIPPED: Not a text message or empty update');
      console.log('='.repeat(80) + '\n');
      return NextResponse.json({ ok: true });
    }

    const message = update.message;
    const chatId = message.chat.id;
    const userMessage = message.text;
    const userId = message.from.id;

    console.log('📨 Message Details:');
    console.log('  - Text:', userMessage);
    console.log('  - User ID:', userId);
    console.log('  - Chat ID:', chatId);
    console.log('  - User Name:', message.from.first_name, message.from.last_name || '');
    console.log('  - Timestamp:', new Date(message.date * 1000).toISOString());

    // Validate chatbotId
    if (!chatbotId) {
      console.error('❌ ERROR: Missing chatbotId parameter');
      console.log('='.repeat(80) + '\n');
      return NextResponse.json({ error: 'Invalid chatbot ID' }, { status: 400 });
    }

    // Get chatbot and Telegram bot configuration
    console.log('\n🔍 Fetching chatbot configuration from database...');
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

    console.log('📊 Database Query Result:');
    console.log('  - Data Found:', chatbotData ? '✅ Yes' : '❌ No');
    console.log('  - Error:', chatbotError ? `❌ ${JSON.stringify(chatbotError)}` : '✅ None');
    
    if (chatbotData) {
      console.log('  - Chatbot Name:', chatbotData.name || 'N/A');
      console.log('  - Chatbot ID:', chatbotData.id);
      console.log('  - Telegram Bot Username:', chatbotData.chatbot_telegram_bots[0]?.bot_username || 'N/A');
      console.log('  - Session Active:', chatbotData.chatbot_telegram_bots[0]?.session ? '✅ Yes' : '❌ No');
      console.log('  - Bot Active:', chatbotData.chatbot_telegram_bots[0]?.is_active ? '✅ Yes' : '❌ No');
    }

    if (chatbotError || !chatbotData) {
      console.error('❌ FATAL: Chatbot or Telegram bot not found');
      console.log('='.repeat(80) + '\n');
      return NextResponse.json({ error: 'Chatbot not found' }, { status: 404 });
    }

    const botToken = chatbotData.chatbot_telegram_bots[0].bot_token;
    const telegramBotId = chatbotData.chatbot_telegram_bots[0].id;
    
    console.log('  - Bot Token:', botToken ? `✅ Present (${botToken.substring(0, 10)}...)` : '❌ Missing');

    // ========================================
    // ASYNC PROCESSING: Return 200 OK immediately, process in background
    // ========================================
    console.log('\n🚀 STARTING ASYNC PROCESSING');
    console.log('  - Returning 200 OK to Telegram immediately');
    console.log('  - Message will be processed in background');
    
    // Ensure userMessage is not undefined before passing
    if (!userMessage) {
      console.error('❌ ERROR: userMessage is undefined');
      console.log('='.repeat(80) + '\n');
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }
    
    // Process message asynchronously (don't await)
    processMessageAsync(
      userMessage,
      chatId,
      userId,
      chatbotId,
      botToken,
      chatbotData,
      message.from.first_name,
      startTime
    ).catch(error => {
      console.error('❌ ASYNC PROCESSING ERROR:', error);
    });

    // Return 200 OK immediately to prevent Telegram retries
    const responseTime = Date.now() - startTime;
    console.log(`\n⏱️  Response Time: ${responseTime}ms (immediate)`);
    console.log('='.repeat(80) + '\n');
    return NextResponse.json({ ok: true, processing: 'async' });

  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error('\n' + '='.repeat(80));
    console.error('❌ FATAL WEBHOOK ERROR');
    console.error('='.repeat(80));
    console.error('  - Error:', error.message);
    console.error('  - Type:', error.name);
    console.error('  - Stack:', error.stack);
    console.error('  - Duration:', duration, 'ms');
    console.error('='.repeat(80) + '\n');
    
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// ========================================
// ASYNC MESSAGE PROCESSOR
// ========================================
async function processMessageAsync(
  userMessage: string,
  chatId: number,
  userId: number,
  chatbotId: string,
  botToken: string,
  chatbotData: any,
  userName: string,
  startTime: number
) {
  console.log('\n' + '─'.repeat(80));
  console.log('🔄 ASYNC PROCESSING STARTED');
  console.log('─'.repeat(80));
  console.log('  - User:', userName);
  console.log('  - Message:', userMessage);
  
  const supabase = await createClient();

  try {
    // Handle /start command
    if (userMessage === '/start') {
      console.log('\n🔵 COMMAND: /start detected');
      console.log('  - Action: Starting new session...');
      
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
          console.error('❌ ERROR: Failed to start session:', sessionError);
          await sendTelegramMessage(botToken, chatId, 'Maaf, terjadi kesalahan saat memulai sesi. Silakan coba lagi.');
          return;
        }

        console.log('✅ Session started successfully');
        console.log(`  - Chatbot ID: ${chatbotId}`);
        console.log(`  - User ID: ${userId}`);
        console.log(`  - Chat ID: ${chatId}`);
        
        // Store session start in conversations table
        try {
          await supabase.from('telegram_conversations').insert({
            chatbot_id: chatbotId,
            telegram_user_id: userId.toString(),
            telegram_chat_id: chatId.toString(),
            user_message: '/start',
            timestamp: new Date().toISOString(),
          });
          console.log('✅ /start command stored in conversations');
        } catch (insertError) {
          console.warn('⚠️  WARNING: Failed to store /start command:', insertError);
        }
        
      } catch (error) {
        console.error('❌ FATAL ERROR starting session:', error);
        await sendTelegramMessage(botToken, chatId, 'Maaf, terjadi kesalahan saat memulai sesi. Silakan coba lagi.');
        return;
      }

      const welcomeMessage = chatbotData.welcome_message || 'Hello! How can I help you today?';
      console.log('\n📤 Sending welcome message to Telegram...');
      console.log('  - Message:', welcomeMessage);
      
      const sendResult = await sendTelegramMessage(botToken, chatId, welcomeMessage);
      console.log('  - Send Result:', sendResult.ok ? '✅ Success' : '❌ Failed');
      
      const duration = Date.now() - startTime;
      console.log(`\n⏱️  Async Processing Duration: ${duration}ms`);
      console.log('─'.repeat(80) + '\n');
      
      return;
    }

    // Handle /end command to stop session
    if (userMessage === '/end') {
      console.log('\n🔴 COMMAND: /end detected');
      console.log('  - Action: Ending session...');
      
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
          console.error('❌ ERROR: Failed to end session:', sessionError);
          await sendTelegramMessage(botToken, chatId, 'Maaf, terjadi kesalahan saat mengakhiri sesi.');
          return;
        }

        console.log('✅ Session ended successfully');
        console.log(`  - Chatbot ID: ${chatbotId}`);
        console.log(`  - User ID: ${userId}`);
        console.log(`  - Chat ID: ${chatId}`);
        
        // Store session end in conversations table
        try {
          await supabase.from('telegram_conversations').insert({
            chatbot_id: chatbotId,
            telegram_user_id: userId.toString(),
            telegram_chat_id: chatId.toString(),
            user_message: '/end',
            timestamp: new Date().toISOString(),
          });
          console.log('✅ /end command stored in conversations');
        } catch (insertError) {
          console.warn('⚠️  WARNING: Failed to store /end command:', insertError);
        }

        console.log('\n📤 Sending goodbye message to Telegram...');
        const sendResult = await sendTelegramMessage(botToken, chatId, 'Sesi telah berakhir. Gunakan /start untuk memulai sesi baru.');
        console.log('  - Send Result:', sendResult.ok ? '✅ Success' : '❌ Failed');
        
        const duration = Date.now() - startTime;
        console.log(`\n⏱️  Async Processing Duration: ${duration}ms`);
        console.log('─'.repeat(80) + '\n');
        
        return;
        
      } catch (error) {
        console.error('❌ FATAL ERROR ending session:', error);
        await sendTelegramMessage(botToken, chatId, 'Maaf, terjadi kesalahan saat mengakhiri sesi.');
        return;
      }
    }

    // Check if session is active by checking session column in chatbot_telegram_bots
    console.log('\n🔒 Checking session status...');
    const sessionActive = chatbotData.chatbot_telegram_bots[0].session;
    console.log('  - Session Status:', sessionActive ? '✅ Active' : '❌ Inactive');
    
    if (!sessionActive) {
      // Session is false - ignore the message
      console.log('⚠️  MESSAGE IGNORED: No active session');
      console.log('  - User must send /start first to begin a session');
      console.log('  - User ID:', userId);
      console.log('  - Chat ID:', chatId);
      console.log('─'.repeat(80) + '\n');
      return;
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

    // ========================================
    // DECISION-BASED RAG REASONING - MAIN FLOW
    // ========================================
    console.log('\n' + '─'.repeat(80));
    console.log('🤖 PROCESSING MESSAGE WITH DECISION-BASED ROUTING');
    console.log('─'.repeat(80));
    
    // Validate userMessage is defined
    if (!userMessage || userMessage.trim() === '') {
      console.error('❌ [Main Flow] userMessage is undefined or empty');
      console.log('─'.repeat(80) + '\n');
      return;
    }
    
    let aiResponse: string;

    try {
      // STEP 1: Decision Routing menggunakan LLM
      console.log('\n📍 STEP 1: Analyzing intent with decision router');
      const decision = await decisionRouter(userMessage, chatbotData);
      console.log(`\n📊 Decision Result: ${decision}`);

      // STEP 2: Route ke response generator sesuai decision
      console.log('\n📍 STEP 2: Generating response based on decision');
      switch (decision) {
        case DECISION_TYPES.NO_RAG:
          // PATH 1: Percakapan natural tanpa RAG
          console.log('🟢 Path: Natural Conversation (No RAG)');
          aiResponse = await generateResponseWithoutRAG(userMessage, chatbotData);
          break;

        case DECISION_TYPES.RAG:
          // PATH 2: Pertanyaan dengan RAG
          console.log('🔵 Path: Knowledge-based (RAG Retrieval)');
          const contextualChunks = await getContextFromRAG(userMessage, chatbotId);
          aiResponse = await generateResponseWithContext(userMessage, contextualChunks, chatbotData);
          break;

        case DECISION_TYPES.CLARIFY:
          // PATH 3: Butuh klarifikasi
          console.log('🟡 Path: Clarification Needed');
          aiResponse = await generateClarificationResponse(userMessage, chatbotData);
          break;

        default:
          // Fallback (seharusnya tidak terjadi)
          console.warn('⚠️  Unknown decision, fallback to RAG');
          const fallbackChunks = await getContextFromRAG(userMessage, chatbotId);
          aiResponse = await generateResponseWithContext(userMessage, fallbackChunks, chatbotData);
      }

      // Validate aiResponse before sending
      console.log('\n✅ Validating generated response...');
      if (!aiResponse || aiResponse.trim() === '') {
        console.warn('⚠️  Empty response detected, using fallback');
        aiResponse = chatbotData.fallback_message || "Maaf, saya tidak dapat memproses pertanyaan Anda saat ini. Silakan coba lagi nanti.";
      }
      console.log('  - Response length:', aiResponse.length, 'characters');
      console.log('  - Response preview:', aiResponse.substring(0, 100) + (aiResponse.length > 100 ? '...' : ''));

      // Send response to Telegram
      console.log('\n📤 Sending response to Telegram...');
      const sendResult = await sendTelegramMessage(botToken, chatId, aiResponse);
      console.log('  - Send result:', sendResult.ok ? '✅ Success' : '❌ Failed');

      // Store AI response
      console.log('\n💾 Storing AI response in database...');
      try {
        await supabase.from('telegram_conversations').insert({
          chatbot_id: chatbotId,
          telegram_user_id: userId.toString(),
          telegram_chat_id: chatId.toString(),
          ai_response: aiResponse,
          timestamp: new Date().toISOString(),
        });

        console.log('✅ AI response stored successfully');
      } catch (insertError) {
        console.warn('⚠️  Failed to store AI response:', insertError);
      }

    } catch (aiError: any) {
      console.error('\n❌ AI PROCESSING ERROR');
      console.error('  - Error:', aiError.message);
      console.error('  - Stack:', aiError.stack);
      
      // Check if quota error
      if (isQuotaError(aiError)) {
        console.log('  - Type: Quota Error');
        aiResponse = getQuotaExceededMessage();
      } else {
        console.log('  - Type: General Error');
        // Send fallback message
        aiResponse = chatbotData.fallback_message || "Maaf, saya tidak dapat memproses permintaan Anda saat ini. Silakan coba lagi nanti.";
      }
      
      console.log('  - Sending error response to user...');
      await sendTelegramMessage(botToken, chatId, aiResponse);
    }

    const duration = Date.now() - startTime;
    console.log('\n⏱️  Async Processing Duration:', duration, 'ms');
    console.log('─'.repeat(80) + '\n');

  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error('\n' + '─'.repeat(80));
    console.error('❌ ASYNC PROCESSING ERROR');
    console.error('─'.repeat(80));
    console.error('  - Error:', error.message);
    console.error('  - Type:', error.name);
    console.error('  - Stack:', error.stack);
    console.error('  - Duration:', duration, 'ms');
    console.error('─'.repeat(80) + '\n');
  }
}

// Fungsi untuk mendapatkan konteks dari RAG service (menggunakan referensi handleSearch dari knowledge-base-manager.tsx)
async function getContextFromRAG(message: string, chatbotId: string) {
  try {
    console.log('\n📚 [RAG Service] Fetching context from knowledge base');
    // Menggunakan endpoint yang sama dengan searchDocuments di useRAGSystem hook
    const ragApiUrl = process.env.RAG_SERVICE_URL || process.env.RAG_BASE_URL || 'https://sort-edit-creatures-tall.trycloudflare.com';
    const apiUrl = `${ragApiUrl}/api/v1/ragly/chatbots/${chatbotId}/query`;
    
    console.log(`  - RAG URL: ${apiUrl}`);
    console.log(`  - Query: "${message}"`);
    
    // Menggunakan FormData seperti di handleSearch
    const formData = new FormData();
    formData.append('query', message);
    formData.append('k', '5'); // Mengambil 5 hasil teratas untuk konteks

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });

    console.log(`  - Response Status: ${response.status}`);

    if (!response.ok) {
      console.error('❌ RAG service error:', response.status, response.statusText);
      const errorData = await response.json().catch(() => ({}));
      console.error('  - Error details:', errorData);
      return [];
    }

    const data = await response.json();
    const resultCount = data.results?.length || 0;
    console.log(`✅ RAG context retrieved: ${resultCount} chunks`);
    if (resultCount > 0) {
      console.log('  - First chunk preview:', data.results[0]?.content?.substring(0, 100) + '...');
    }
    return data.results || [];
  } catch (error: any) {
    console.error('❌ Exception accessing RAG service:', error.message);
    console.error('  - Stack:', error.stack);
    return [];
  }
}

// Fungsi untuk generate response menggunakan context (menggunakan struktur SearchResult)
async function generateResponseWithContext(
  message: string,
  contextualChunks: any[],
  chatbotData: any
): Promise<string> {
  console.log('\n📖 [RAG Response] Generating response with context');
  console.log(`  - Context chunks received: ${contextualChunks?.length || 0}`);
  
  // ========================================
  // ANTI-HALUSINASI: Tolak jika tidak ada konteks
  // ========================================
  if (!contextualChunks || contextualChunks.length === 0) {
    console.log('⚠️  [RAG Response] No context from RAG, refusing to answer to prevent hallucination');
    
    return "Maaf, informasi tersebut belum tersedia dalam knowledge base saya saat ini. 😔\n\n" +
           "Untuk informasi lebih detail, silakan hubungi admin atau coba tanyakan pertanyaan lain yang lebih spesifik. 🙏";
  }

  const combinedContext = contextualChunks
    .map(chunk => chunk?.content || chunk?.text || '')
    .filter(text => text.trim() !== '')
    .join('\n\n---\n\n');

  // Jika setelah filtering context kosong
  if (!combinedContext.trim()) {
    console.log('⚠️  [RAG Response] Context is empty after filtering');
    return "Maaf, informasi tersebut belum tersedia dalam knowledge base saya saat ini. 😔\n\n" +
           "Untuk informasi lebih detail, silakan hubungi admin atau coba tanyakan pertanyaan lain yang lebih spesifik. 🙏";
  }

  try {
    // Extract context chunks as array of strings
    const contextChunks = contextualChunks
      .map(chunk => chunk?.content || chunk?.text || '')
      .filter(text => text.trim() !== '');

    console.log(`  - Valid context chunks: ${contextChunks.length}`);
    console.log(`  - Total context length: ${combinedContext.length} characters`);
    console.log(`  - Calling LLM service: ${LLM_SERVICE_URL}/generate`);

    const response = await fetch(`${LLM_SERVICE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        mode: 'RAG',
        context: contextChunks,
        config: {
          bot_name: chatbotData.name || 'Assistant',
          bot_role: chatbotData.personality || 'helpful AI assistant',
          domain_context: chatbotData.personality,
          greeting_style: 'friendly and professional',
          response_language: 'Indonesian',
          max_response_length: '3-6 sentences',
          use_emojis: true,
          fallback_message: "Maaf, informasi tersebut belum tersedia dalam knowledge base saya saat ini. 😔\n\nUntuk informasi lebih detail, silakan hubungi admin atau coba tanyakan pertanyaan lain yang lebih spesifik. 🙏"
        }
      }),
    });

    console.log(`  - Response Status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to read error');
      console.error(`❌ [RAG Response] LLM service error: ${response.status}`);
      console.error(`  - Error Details: ${errorText}`);
      return "Maaf, saya belum bisa menjawab pertanyaan tersebut.";
    }

    const data = await response.json();
    console.log('✅ [RAG Response] Generated successfully');
    console.log(`  - Reply length: ${data.reply?.length || 0} characters`);
    return data.reply || "Maaf, saya belum bisa menjawab pertanyaan tersebut.";
    
  } catch (err: any) {
    console.error('❌ [RAG Response] Exception:', err.message);
    console.error('  - Stack:', err.stack);
    throw err;
  }
}


async function sendTelegramMessage(botToken: string, chatId: number, text: string) {
  try {
    console.log('  📡 Sending to Telegram API...');
    console.log('    - Chat ID:', chatId);
    console.log('    - Message length:', text.length, 'chars');
    
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
      console.error('  ❌ Failed to send Telegram message');
      console.error('    - Response:', JSON.stringify(data, null, 2));
    } else {
      console.log('  ✅ Message sent successfully');
      console.log('    - Message ID:', data.result?.message_id);
    }

    return data;
  } catch (error: any) {
    console.error('  ❌ Exception sending Telegram message:', error.message);
    console.error('    - Stack:', error.stack);
    throw error;
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Telegram webhook endpoint' });
}
