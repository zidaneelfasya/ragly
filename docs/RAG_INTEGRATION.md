# RAG Knowledge Base Integration

This feature integrates your existing RAG (Retrieval-Augmented Generation) system with the chatbot management interface, allowing you to upload and manage documents for each chatbot's knowledge base.

## Features

### Document Management
- **Upload PDF documents** to your chatbot's knowledge base
- **View uploaded documents** with extraction strategy information
- **Delete documents** from the knowledge base
- **Support for large files** (up to 10MB)

### Search & Testing
- **Test search functionality** directly in the interface
- **View search results** with relevance scores
- **Real-time search** against your knowledge base

### Statistics & Monitoring
- **View knowledge base statistics** (document count, chunks, vectorstore size)
- **Monitor last update times**
- **Track extraction strategies** used for each document

### RAG System Integration
- **Automatic text extraction** using your advanced pipeline
- **OCR support** for image-based PDFs
- **Hybrid extraction strategies** for optimal results
- **Vectorstore management** with rebuild functionality

## API Endpoints

The system creates proxy endpoints that communicate with your RAG API:

- `POST /api/rag/documents` - Upload new documents
- `GET /api/rag/documents` - List all documents for a chatbot
- `DELETE /api/rag/documents/[id]` - Delete a specific document
- `POST /api/rag/search` - Search the knowledge base
- `GET /api/rag/stats` - Get knowledge base statistics
- `POST /api/rag/stats` - Rebuild vectorstore

## Configuration

Ensure your RAG API is running and accessible at the URL specified in your environment variables:

```bash
RAG_BASE_URL=http://localhost:8000
```

## Usage

1. **Navigate to a chatbot's detail page**
2. **Scroll to the "Knowledge Base Manager" section**
3. **Use the tabs to switch between:**
   - **Documents**: Upload and manage PDF files
   - **Search**: Test search functionality
   - **Stats**: View knowledge base statistics

### Uploading Documents

1. Click the "Documents" tab
2. Select a PDF file (max 10MB)
3. Click "Upload Document"
4. The system will automatically extract text using the optimal strategy
5. Documents are immediately available for search

### Testing Search

1. Click the "Search" tab
2. Enter your search query
3. Click "Search" to see results with relevance scores
4. Results are displayed with source information

### Monitoring Statistics

1. Click the "Stats" tab
2. View total documents, chunks, and vectorstore size
3. Use "Rebuild Index" button if needed

## Integration with Your RAG System

The integration works by:

1. **Proxying requests** through Next.js API routes
2. **Forwarding file uploads** to your RAG system's `/admin/documents/upload` endpoint
3. **Managing document lifecycle** through your existing endpoints
4. **Providing a user-friendly interface** for document management

## Error Handling

The system includes comprehensive error handling:

- **File validation** (PDF only, size limits)
- **Upload progress tracking**
- **Network error recovery**
- **User-friendly error messages**

## Future Enhancements

Potential improvements:

- **Multiple file format support**
- **Batch document upload**
- **Advanced search filters**
- **Document versioning**
- **Knowledge base analytics dashboard**
