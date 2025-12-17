import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, chatbot_id } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get context from RAG service
    const contextualChunks = await getContextFromRAG(message, chatbot_id);
    
    let reply;
    if (contextualChunks && contextualChunks.length > 0) {
      // Generate response menggunakan Gemini
      reply = await generateResponse(message, contextualChunks);
    } else {
      reply = "Maaf, saya tidak dapat menemukan informasi yang relevan untuk pertanyaan Anda. Bisakah Anda mencoba dengan pertanyaan yang lebih spesifik?";
    }

    return NextResponse.json({ 
      reply: reply,
      context_found: contextualChunks.length,
      contexts: contextualChunks.map(chunk => {
        // Handle SearchResult structure untuk debugging
        return {
          content: chunk.content || chunk.text || chunk,
          source: chunk.metadata?.source_file || 'unknown',
          score: chunk.score || 'unknown'
        };
      }).slice(0, 3), // Show first 3 contexts for debugging
      total_chunks: contextualChunks.length
    });

  } catch (error) {
    console.error('Error in chat test:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Fungsi untuk mendapatkan konteks dari RAG service (menggunakan referensi handleSearch)
async function getContextFromRAG(message: string, chatbotId?: string) {
  try {
    if (!chatbotId) {
      console.warn('No chatbot_id provided for RAG search');
      return [];
    }

    const ragApiUrl = process.env.RAG_SERVICE_URL || process.env.RAG_BASE_URL || 'https://sort-edit-creatures-tall.trycloudflare.com';
    const apiUrl = `${ragApiUrl}/api/v1/ragly/chatbots/${chatbotId}/query`;
    
    const formData = new FormData();
    formData.append('query', message);
    formData.append('k', '5');

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.error('RAG service error:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('❌ Error mengakses RAG service:', error);
    return [];
  }
}

// Fungsi untuk generate response menggunakan Gemini (menggunakan struktur SearchResult)
async function generateResponse(message: string, contextualChunks: any[]) {
  try {
    // Mengekstrak content dari SearchResult structure
    const combinedContext = contextualChunks
      .map(chunk => {
        // Handle struktur SearchResult dari RAG API
        if (chunk.content) {
          return chunk.content;
        }
        // Fallback untuk struktur lama
        return chunk.text || chunk;
      })
      .join('\n\n---\n\n');

    const prompt = `Kamu adalah asisten cerdas yang menjawab pertanyaan hanya berdasarkan informasi yang diberikan dari dokumen internal. Berikan jawaban profesional yang lengkap. Jika jawabannya tidak ditemukan di dokumen, katakan dengan jujur bahwa kamu tidak tahu atau informasinya tidak tersedia.

=== Informasi Konteks ===
${combinedContext}
=======================

Pertanyaan:
${message}

Berdasarkan informasi konteks di atas, jawablah pertanyaan dengan jelas dan detail:`;

    // Menggunakan Google Gemini AI (sama seperti di index.js)
    if (process.env.GEMINI_API_KEY) {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Maaf, saya tidak dapat menghasilkan jawaban saat ini.';
    } else {
      throw new Error('GEMINI_API_KEY not configured');
    }

  } catch (error) {
    console.error('❌ Error generating response:', error);
    throw error;
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Chat test endpoint - use POST with {"message": "your question", "chatbot_id": "optional"}',
    example: {
      message: "Apa itu konsultasi?",
      chatbot_id: "optional-chatbot-id"
    }
  });
}
