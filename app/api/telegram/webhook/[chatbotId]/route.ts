// File ini untuk menggantikan route.ts yang ada di:
// app/api/telegram/webhook/[chatbotId]/route.ts
//
// Route ini akan forward semua request webhook ke Express service yang berjalan di VPS

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// URL Express service yang berjalan di VPS
const TELEGRAM_WEBHOOK_SERVICE_URL = process.env.TELEGRAM_WEBHOOK_SERVICE_URL || 'http://localhost:3001';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chatbotId: string }> }
) {
  const startTime = Date.now();
  console.log('\n' + '='.repeat(80));
  console.log('🔀 TELEGRAM WEBHOOK - FORWARDING TO EXPRESS SERVICE');
  console.log('='.repeat(80));
  
  try {
    const { chatbotId } = await params;
    console.log('📋 Chatbot ID:', chatbotId);
    
    // Get raw body
    const body = await request.json();
    console.log('📦 Update ID:', body.update_id);
    console.log('📨 Message:', body.message?.text || 'N/A');

    // Forward request to Express service
    const serviceUrl = `${TELEGRAM_WEBHOOK_SERVICE_URL}/webhook/${chatbotId}`;
    console.log('🚀 Forwarding to:', serviceUrl);

    const response = await fetch(serviceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('📡 Service Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to read error');
      console.error('❌ Service returned error:', response.status);
      console.error('  - Error details:', errorText);
      
      // Still return 200 to Telegram to prevent retries
      return NextResponse.json({ 
        ok: true, 
        note: 'Forwarded but service returned error' 
      });
    }

    const data = await response.json();
    const duration = Date.now() - startTime;
    
    // Attempt to save conversation to generic table
    try {
      const supabase = await createClient();
      
      const userMessage = body.message?.text || '';
      // Assume express might return the ai_response in data.reply or data.ai_response or data.response.
      // If none exist, we'll just save what we can, maybe it'll be updated later or we just save the user message.
      const aiResponse = data.reply || data.ai_response || data.response || data.aiResponse || '';
      const telegramChatId = body.message?.chat?.id?.toString() || '';

      if (userMessage) {
        await supabase
          .from('chatbot_conversations')
          .insert({
            chatbot_id: chatbotId,
            session_id: telegramChatId,
            source: 'telegram',
            user_message: userMessage,
            ai_response: aiResponse,
          });
      }
    } catch (dbError) {
      console.error('❌ Error saving to chatbot_conversations:', dbError);
    }
    
    console.log('✅ Successfully forwarded to Express service');
    console.log(`⏱️  Total Duration: ${duration}ms`);
    console.log('='.repeat(80) + '\n');

    return NextResponse.json(data);

  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error('\n' + '='.repeat(80));
    console.error('❌ FORWARD ERROR');
    console.error('='.repeat(80));
    console.error('  - Error:', error.message);
    console.error('  - Type:', error.name);
    console.error('  - Duration:', duration, 'ms');
    console.error('='.repeat(80) + '\n');
    
    // Return 200 OK to Telegram to prevent retries
    // The Express service will handle the actual error
    return NextResponse.json({ 
      ok: true, 
      note: 'Forwarding failed but acknowledged' 
    });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Telegram webhook forwarder endpoint',
    service: 'Forwards to Express service',
    serviceUrl: TELEGRAM_WEBHOOK_SERVICE_URL 
  });
}
