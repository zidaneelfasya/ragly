# API v1 Migration Guide

## Overview

This document outlines the migration from the legacy RAG API endpoints to the new API v1 multi-tenant system. The migration has been completed for the Knowledge Base Manager components.

## Changes Made

### 1. API Endpoint Updates

**Before (Legacy API):**
```
Base URL: http://localhost:8000/admin/ragly/documents
```

**After (API v1):**
```
Base URL: http://localhost:8000/api/v1/ragly
```

### 2. URL Structure Changes

| Function | Legacy Endpoint | New API v1 Endpoint |
|----------|----------------|---------------------|
| Upload Document | `POST /admin/ragly/documents/upload` | `POST /api/v1/ragly/chatbots/{chatbot_id}/documents/upload` |
| List Documents | `GET /admin/ragly/documents?chatbot_id={id}` | `GET /api/v1/ragly/chatbots/{chatbot_id}/documents` |
| Delete Document | `DELETE /admin/ragly/documents/{file_id}?chatbot_id={id}` | `DELETE /api/v1/ragly/chatbots/{chatbot_id}/documents/{file_id}` |
| Search Documents | `POST /admin/ragly/search` | `POST /api/v1/ragly/chatbots/{chatbot_id}/query` |
| Get Stats | `GET /admin/ragly/stats?chatbot_id={id}` | `GET /api/v1/ragly/chatbots/{chatbot_id}/documents/status` |
| Rebuild Vectorstore | `POST /admin/ragly/stats` | `POST /api/v1/ragly/chatbots/{chatbot_id}/documents/rebuild-vectorstore` |

### 3. New Endpoints Added

- **Search Documents by Name**: `GET /api/v1/ragly/chatbots/{chatbot_id}/documents/search`
- **Get Document Info**: `GET /api/v1/ragly/chatbots/{chatbot_id}/documents/{file_id}`

### 4. Interface Updates

#### RAGDocument Interface
**Before:**
```typescript
interface RAGDocument {
  id: string;
  filename: string;
  source: string;
  file_path: string;
  extraction_strategy: string;
  added_at: string;
  chunk_count: number;
}
```

**After:**
```typescript
interface RAGDocument {
  id: string;
  original_name: string;
  unique_name: string;
  path_url: string;
  upload_date: string;
  file_size: number;
  processed: boolean;
}
```

#### RAGStats Interface
**Before:**
```typescript
interface RAGStats {
  total_documents: number;
  total_chunks: number;
  vectorstore_size: string;
  last_updated: string;
}
```

**After:**
```typescript
interface RAGStats {
  vectorstore_status: string;
  total_documents: number;
  total_chunks: number;
  vectorstore_size: string;
  ocr_available: boolean;
}
```

#### SearchResult Interface
**Before:**
```typescript
interface SearchResult {
  content: string;
  source: string;
  score?: number;
}
```

**After:**
```typescript
interface SearchResult {
  content: string;
  metadata: {
    source_file: string;
    upload_timestamp: string;
  };
  score?: number;
}
```

### 5. Request/Response Format Changes

#### Upload Document
**Request Changes:**
- Added `auto_process` parameter (default: true)
- Removed `chatbot_id` from form data (now in URL path)

**Response Changes:**
```json
{
  "message": "File uploaded successfully",
  "file_id": "uuid-string",
  "original_name": "document.pdf",
  "unique_name": "20231125_143022_a1b2c3d4_document.pdf",
  "path_url": "/data/users/{user_id}/{chatbot_id}/file.pdf",
  "file_size": 1024000,
  "chunks_added": 45
}
```

#### Error Handling
- Changed from `error` field to `detail` field in error responses
- Standardized HTTP status codes

### 6. Feature Enhancements

#### File Size Limit
- Increased from 10MB to 100MB maximum file size

#### Document Search
- Added local search functionality by document name
- Improved search UI with filtered results

#### Statistics Display
- Added vectorstore status indicator
- Added OCR availability status
- Reorganized stats layout with better grid system

### 7. Security Improvements

#### Multi-Tenant Isolation
- Each chatbot now has isolated document storage
- Path-based access control via chatbot_id in URL
- Automatic validation of chatbot ownership

#### Directory Structure
```
data/
└── users/
    └── {user_id}/
        └── {chatbot_id}/
            ├── document1.pdf
            └── document2.pdf

db_multilingual/
└── users/
    └── {user_id}/
        └── {chatbot_id}/
            ├── chroma.sqlite3
            └── vectorstore_files/
```

### 8. Rate Limiting

New rate limits implemented:
- File uploads: 10 files per minute per chatbot
- Queries: 100 requests per minute per chatbot
- Rebuilds: 1 rebuild per 5 minutes per chatbot

## Files Modified

### Core Files
- `hooks/useRAGSystem.ts` - Updated all API calls and interfaces
- `components/knowledge-base-manager.tsx` - Updated UI and data handling

### Functions Updated
1. `uploadDocument()` - New endpoint and parameters
2. `getDocuments()` - New endpoint and response format
3. `deleteDocument()` - New endpoint structure
4. `searchDocuments()` - New query endpoint
5. `getRAGStats()` - New status endpoint
6. `rebuildVectorstore()` - New rebuild endpoint

### Functions Added
1. `searchDocumentsByName()` - Document name search
2. `getDocumentInfo()` - Individual document details

## Testing Checklist

- [ ] Document upload functionality
- [ ] Document listing and display
- [ ] Document deletion
- [ ] Knowledge base querying
- [ ] Document name search
- [ ] Statistics display
- [ ] Vectorstore rebuild
- [ ] Error handling
- [ ] File size validation (100MB limit)
- [ ] Multi-tenant isolation

## Migration Benefits

1. **Better Security**: Multi-tenant isolation with path-based access control
2. **Improved Performance**: Optimized endpoints and caching
3. **Enhanced Features**: Document search, better stats, larger file support
4. **Standardized APIs**: Consistent response formats and error handling
5. **Future-Proof**: Built for scalability and additional features

## Backward Compatibility

The legacy endpoints (`/admin/ragly/*`) should still work but are deprecated. It's recommended to migrate all clients to the new API v1 endpoints for better performance and features.

## Support

For any issues during migration or questions about the new API, refer to:
1. `docs/API_DOCUMENTATION_V1.md` - Complete API documentation
2. Network tab in browser developer tools for debugging
3. Server logs for detailed error information
