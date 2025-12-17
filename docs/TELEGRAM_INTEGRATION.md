# Telegram Bot Integration Guide

## Overview
Integrase Telegram Bot dengan sistem RAG yang mengikuti pola implementasi WhatsApp bot (index.js).

## Features
- ✅ Menangani perintah `/start` dengan welcome_message dari database
- ✅ Integrasi dengan sistem RAG menggunakan endpoint yang sama seperti WhatsApp bot
- ✅ Support Gemini AI untuk generate response
- ✅ Fallback ke OpenAI jika Gemini tidak tersedia
- ✅ Logging conversation untuk analytics
- ✅ Error handling yang robust

## Endpoints

### 1. Telegram Webhook
**URL:** `/api/telegram/webhook/[chatbotId]`
- Menerima updates dari Telegram
- Memproses pesan user dan memberikan response

### 2. Telegram Bot Management
**URL:** `/api/chatbots/[id]/telegram`
- `POST`: Create Telegram bot integration
- `GET`: Get existing bot configuration  
- `DELETE`: Remove bot integration

### 3. Testing Endpoints
**URL:** `/api/rag/test`
- Test RAG service connection
- **POST:** `{"message": "your question", "chatbot_id": "optional"}`

**URL:** `/api/chat/test`
- Test complete chat flow with RAG + Gemini
- **POST:** `{"message": "your question", "chatbot_id": "optional"}`

## Environment Variables

Tambahkan ke file `.env`:

```bash
# RAG Service Configuration
RAG_SERVICE_URL=http://localhost:8000
RAG_BASE_URL=http://localhost:8000

# AI Configuration
GEMINI_API_KEY=your-gemini-api-key
```

## Flow Diagram

```
1. User sends message to Telegram bot
   ↓
2. Telegram sends webhook to /api/telegram/webhook/[chatbotId]
   ↓
3. System validates chatbot & gets configuration from database
   ↓
4. If /start → Send welcome_message
   ↓
5. Else → Search RAG system for context
   ↓
6. Generate response using Gemini AI (or OpenAI fallback)
   ↓
7. Send response back to user via Telegram
   ↓
8. Log conversation for analytics
```

## Database Tables

### telegram_conversations
```sql
CREATE TABLE telegram_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
    telegram_user_id TEXT NOT NULL,
    telegram_chat_id TEXT NOT NULL,
    user_message TEXT,
    ai_response TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### chatbot_telegram_bots
```sql
CREATE TABLE chatbot_telegram_bots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    bot_token TEXT NOT NULL,
    bot_username TEXT NOT NULL,
    webhook_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Setup Instructions

### 1. Create Telegram Bot
1. Message @BotFather on Telegram
2. Send `/newbot`
3. Choose name and username for your bot
4. Copy the bot token

### 2. Configure in Ragly Dashboard
1. Go to your chatbot detail page
2. Find "Telegram Bot Integration" section
3. Enter bot token and username
4. Click "Create Telegram Bot"

### 3. Test Integration
1. Use testing endpoints:
   ```bash
   # Test RAG service (requires chatbot_id)
   curl -X POST http://localhost:3000/api/rag/test \
     -H "Content-Type: application/json" \
     -d '{"message": "test question", "chatbot_id": "your-chatbot-id"}'

   # Test complete chat flow
   curl -X POST http://localhost:3000/api/chat/test \
     -H "Content-Type: application/json" \
     -d '{"message": "test question", "chatbot_id": "your-chatbot-id"}'
   ```

   Expected response structure:
   ```json
   {
     "reply": "AI generated response...",
     "context_found": 3,
     "contexts": [
       {
         "content": "relevant document content...",
         "source": "document.pdf",
         "score": 0.85
       }
     ],
     "total_chunks": 3
   }
   ```

2. Test on Telegram:
   - Search for your bot
   - Send `/start`
   - Ask questions related to your knowledge base

## RAG Integration

Sistem menggunakan endpoint yang sama dengan `handleSearch` di knowledge-base-manager.tsx:

### 1. Context Search
```javascript
// Endpoint: {RAG_API_URL}/api/v1/ragly/chatbots/{chatbotId}/query
// Method: POST with FormData (same as searchDocuments in useRAGSystem)

const formData = new FormData();
formData.append('query', message);
formData.append('k', '5'); // Number of results

// Response structure (SearchResult[])
{
  "results": [
    {
      "content": "document content...",
      "metadata": {
        "source_file": "document.pdf",
        "upload_timestamp": "2024-01-01T00:00:00Z"
      },
      "score": 0.85
    }
  ]
}
```

### 2. Response Generation
Menggunakan Gemini AI dengan prompt template yang sama:
```javascript
const prompt = `Kamu adalah asisten cerdas yang menjawab pertanyaan hanya berdasarkan informasi yang diberikan dari dokumen internal. Berikan jawaban profesional yang lengkap. Jika jawabannya tidak ditemukan di dokumen, katakan dengan jujur bahwa kamu tidak tahu atau informasinya tidak tersedia.

=== Informasi Konteks ===
${combinedContext}
=======================

Pertanyaan:
${message}

Berdasarkan informasi konteks di atas, jawablah pertanyaan dengan jelas dan detail:`;
```

## Error Handling

- ✅ Validates bot token dengan Telegram API
- ✅ Handles RAG service connection errors
- ✅ Fallback responses when context not found
- ✅ Graceful degradation (Gemini → OpenAI → static fallback)
- ✅ Comprehensive logging untuk debugging

## Security

- ✅ Bot tokens disimpan di database (dalam production sebaiknya di-encrypt)
- ✅ User authentication untuk bot management
- ✅ Webhook validation
- ✅ Rate limiting (bisa ditambahkan)

## Monitoring

- Conversation logging untuk analytics
- Error logging untuk debugging
- Bot status tracking (active/inactive)
- Performance metrics (response time, success rate)

## Next Steps

1. **Encryption**: Encrypt bot tokens di database
2. **Rate Limiting**: Tambahkan rate limiting untuk webhook
3. **Analytics**: Dashboard untuk conversation analytics
4. **Multi-language**: Support multiple languages
5. **Rich Responses**: Support for images, buttons, inline keyboards
