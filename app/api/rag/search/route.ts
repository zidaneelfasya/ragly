import { NextRequest, NextResponse } from 'next/server';

const RAG_API_URL = process.env.RAG_BASE_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, k = 3, chatbot_id } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    if (!chatbot_id) {
      return NextResponse.json({ error: 'Chatbot ID is required' }, { status: 400 });
    }

    // Forward the search request to your RAG system
    const response = await fetch(`${RAG_API_URL}/search/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        k,
        chatbot_id,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`RAG API Error: ${errorText}`);
    }

    const result = await response.json();

    return NextResponse.json({
      results: result.results || [],
      message,
      count: result.count || 0,
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { 
        error: 'Search failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
