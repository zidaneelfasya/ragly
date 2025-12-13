import { NextRequest, NextResponse } from 'next/server';

const RAG_API_URL = process.env.RAG_BASE_URL || 'http://localhost:8000';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const chatbotId = searchParams.get('chatbot_id');
    const documentId = params.id;

    if (!chatbotId) {
      return NextResponse.json({ error: 'Chatbot ID is required' }, { status: 400 });
    }

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }

    // Forward the request to your RAG system
    const response = await fetch(`${RAG_API_URL}/admin/documents/${documentId}?chatbot_id=${chatbotId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`RAG API Error: ${errorText}`);
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully',
      result,
    });

  } catch (error) {
    console.error('Document delete error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete document',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
