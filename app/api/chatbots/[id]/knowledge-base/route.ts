import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const chatbotId = params.id;

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify chatbot belongs to user
    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .select('id, user_id, name')
      .eq('id', chatbotId)
      .eq('user_id', user.id)
      .single();

    if (chatbotError || !chatbot) {
      return NextResponse.json({ error: 'Chatbot not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ 
        error: 'Invalid file type. Only PDF files are allowed.' 
      }, { status: 400 });
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 10MB.' 
      }, { status: 400 });
    }

    // Create upload directory for this chatbot
    const uploadDir = join(process.cwd(), 'uploads', 'knowledge-base', chatbotId);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}_${sanitizedName}`;
    const filepath = join(uploadDir, filename);

    // Write file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Save file info to database
    const { data: fileRecord, error: fileError } = await supabase
      .from('chatbot_rag_files')
      .insert({
        chatbot_id: chatbotId,
        filename: file.name,
        file_path: filepath,
        file_size: file.size,
        mime_type: file.type,
        status: 'uploaded'
      })
      .select()
      .single();

    if (fileError) {
      console.error('Error saving file record:', fileError);
      return NextResponse.json({ 
        error: 'Failed to save file record' 
      }, { status: 500 });
    }

    // Call RAG system to process the file
    try {
      const ragResponse = await fetch('http://localhost:8000/process-file/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatbot_id: chatbotId,
          file_path: filepath,
          filename: file.name
        }),
      });

      if (ragResponse.ok) {
        // Update file status to processed
        await supabase
          .from('chatbot_rag_files')
          .update({ status: 'processed' })
          .eq('id', fileRecord.id);
      } else {
        // Mark as failed but keep the file record
        await supabase
          .from('chatbot_rag_files')
          .update({ status: 'failed' })
          .eq('id', fileRecord.id);
        
        console.error('RAG processing failed:', await ragResponse.text());
      }
    } catch (ragError) {
      console.error('Error calling RAG system:', ragError);
      // Mark as failed but keep the file record
      await supabase
        .from('chatbot_rag_files')
        .update({ status: 'failed' })
        .eq('id', fileRecord.id);
    }

    return NextResponse.json({
      message: 'File uploaded successfully',
      file: {
        id: fileRecord.id,
        filename: fileRecord.filename,
        size: fileRecord.file_size,
        status: fileRecord.status
      }
    });

  } catch (error) {
    console.error('Error uploading knowledge base file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const chatbotId = params.id;

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify chatbot belongs to user
    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .select('id, user_id')
      .eq('id', chatbotId)
      .eq('user_id', user.id)
      .single();

    if (chatbotError || !chatbot) {
      return NextResponse.json({ error: 'Chatbot not found' }, { status: 404 });
    }

    // Get all files for this chatbot
    const { data: files, error: filesError } = await supabase
      .from('chatbot_rag_files')
      .select('*')
      .eq('chatbot_id', chatbotId)
      .order('created_at', { ascending: false });

    if (filesError) {
      console.error('Error fetching files:', filesError);
      return NextResponse.json({ 
        error: 'Failed to fetch files' 
      }, { status: 500 });
    }

    return NextResponse.json({ files: files || [] });

  } catch (error) {
    console.error('Error in GET knowledge base files:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const chatbotId = params.id;
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json({ error: 'File ID required' }, { status: 400 });
    }

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify file belongs to user's chatbot
    const { data: file, error: fileError } = await supabase
      .from('chatbot_rag_files')
      .select(`
        *,
        chatbots!inner(user_id)
      `)
      .eq('id', fileId)
      .eq('chatbot_id', chatbotId)
      .eq('chatbots.user_id', user.id)
      .single();

    if (fileError || !file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Delete file record from database
    const { error: deleteError } = await supabase
      .from('chatbot_rag_files')
      .delete()
      .eq('id', fileId);

    if (deleteError) {
      console.error('Error deleting file record:', deleteError);
      return NextResponse.json({ 
        error: 'Failed to delete file' 
      }, { status: 500 });
    }

    // TODO: Also remove from RAG vectorstore
    // This would require calling your RAG system's delete endpoint

    return NextResponse.json({ message: 'File deleted successfully' });

  } catch (error) {
    console.error('Error deleting knowledge base file:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
