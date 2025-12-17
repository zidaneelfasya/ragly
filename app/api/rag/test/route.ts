import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, chatbot_id } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get context from RAG service (menggunakan endpoint yang sama dengan handleSearch)
    const ragApiUrl = process.env.RAG_SERVICE_URL || process.env.RAG_BASE_URL || 'https://sort-edit-creatures-tall.trycloudflare.com';
    const apiUrl = `${ragApiUrl}/api/v1/ragly/chatbots/${chatbot_id}/query`;
    
    const formData = new FormData();
    formData.append('query', message);
    formData.append('k', '5');

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.error('RAG service error:', response.status, response.statusText);
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json({ 
        error: 'RAG service error',
        status: response.status,
        statusText: response.statusText,
        details: errorData
      }, { status: 500 });
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      results: data.results || [],
      total: data.results?.length || 0,
      query: message,
      chatbot_id: chatbot_id
    });

  } catch (error) {
    console.error('Error testing RAG:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'RAG test endpoint - use POST with {"message": "your question", "chatbot_id": "optional"}' 
  });
}
