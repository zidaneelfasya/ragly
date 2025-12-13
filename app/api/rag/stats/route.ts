import { NextRequest, NextResponse } from 'next/server';

const RAG_API_URL = process.env.RAG_BASE_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chatbotId = searchParams.get('chatbot_id');

    if (!chatbotId) {
      return NextResponse.json({ error: 'Chatbot ID is required' }, { status: 400 });
    }

    // Forward the request to your RAG system
    const response = await fetch(`${RAG_API_URL}/admin/context/stats?chatbot_id=${chatbotId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`RAG API Error: ${errorText}`);
    }

    const result = await response.json();

    return NextResponse.json({
      stats: result.stats || {
        total_documents: 0,
        total_chunks: 0,
        vectorstore_size: '0 MB',
        last_updated: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch stats',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chatbot_id } = body;

    if (!chatbot_id) {
      return NextResponse.json({ error: 'Chatbot ID is required' }, { status: 400 });
    }

    // Forward the rebuild request to your RAG system
    const response = await fetch(`${RAG_API_URL}/rebuild`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatbot_id,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`RAG API Error: ${errorText}`);
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Vectorstore rebuilt successfully',
      result,
    });

  } catch (error) {
    console.error('Rebuild error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to rebuild vectorstore',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
