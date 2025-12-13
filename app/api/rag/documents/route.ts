import { NextRequest, NextResponse } from 'next/server';

const RAG_API_URL = process.env.RAG_BASE_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const chatbotId = formData.get('chatbot_id') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!chatbotId) {
      return NextResponse.json({ error: 'Chatbot ID is required' }, { status: 400 });
    }

    // Create new FormData for the RAG API
    const ragFormData = new FormData();
    ragFormData.append('file', file);
    ragFormData.append('chatbot_id', chatbotId);

    // Forward the request to your RAG system
    const response = await fetch(`${RAG_API_URL}/admin/documents/upload`, {
      method: 'POST',
      body: ragFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`RAG API Error: ${errorText}`);
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Document uploaded successfully',
      document: result.document || {},
    });

  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload document',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chatbotId = searchParams.get('chatbot_id');

    if (!chatbotId) {
      return NextResponse.json({ error: 'Chatbot ID is required' }, { status: 400 });
    }

    // Forward the request to your RAG system
    const response = await fetch(`${RAG_API_URL}/admin/documents/list?chatbot_id=${chatbotId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`RAG API Error: ${errorText}`);
    }

    const result = await response.json();

    return NextResponse.json({
      documents: result.documents || [],
    });

  } catch (error) {
    console.error('Document list error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch documents',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
