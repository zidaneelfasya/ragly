# Dokumentasi Aplikasi BoCHATS - Platform AI Chatbot dengan Sistem Manajemen Konsultasi SPBE

## 📖 Pengenalan Aplikasi

**BoCHATS** adalah aplikasi web yang menggabungkan dua komponen utama:

1. **Platform Chatbot AI dengan RAG (Retrieval-Augmented Generation)**
2. **Sistem Manajemen Konsultasi SPBE (Sistem Pemerintahan Berbasis Elektronik)**

Aplikasi ini memungkinkan pengguna untuk membangun chatbot cerdas dengan knowledge base mereka sendiri, sekaligus menyediakan sistem manajemen konsultasi yang terstruktur dan efisien untuk instansi pemerintah.

---

## 🎯 Tujuan Utama

### Platform Chatbot AI
- Memungkinkan pembuatan chatbot AI yang dapat menjawab pertanyaan berdasarkan dokumen pengguna
- Menggunakan teknologi RAG untuk memberikan jawaban yang akurat dan kontekstual
- Menyediakan integrasi dengan berbagai platform termasuk Telegram

### Sistem Manajemen Konsultasi SPBE
- Mengelola proses konsultasi digital untuk implementasi SPBE
- Menyediakan sistem tiket untuk tracking konsultasi
- Dashboard admin untuk monitoring dan manajemen data
- Workflow yang sesuai dengan standar SPBE

---

## 🔧 Fitur Utama Aplikasi

### 1. **Chatbot LLM + RAG**
- **Knowledge Base Management**: Upload dan kelola dokumen (PDF, DOCX, TXT)
- **RAG Integration**: Sistem yang menggabungkan retrieval dan generation untuk jawaban yang akurat
- **Multi-Model Support**: Dukungan untuk GPT-4, GPT-3.5, dan Google Gemini
- **Telegram Integration**: Deployment chatbot ke Telegram
- **Real-time Chat**: Interface chat yang responsif dan intuitif

### 2. **Manajemen Tiket Konsultasi**
- **Sistem Tiket Otomatis**: Generate kode tiket unik untuk setiap konsultasi
- **Tracking Status**: Monitoring status konsultasi dari pengajuan hingga selesai
- **Form Konsultasi**: Interface untuk pengajuan konsultasi dengan validasi lengkap
- **Notifikasi**: Update otomatis status konsultasi

### 3. **Dashboard Admin/Direktur**
- **Data Management**: CRUD operations untuk data konsultasi
- **Filtering & Search**: Pencarian dan filter berdasarkan kategori, status, unit, dll
- **Export Data**: Export data konsultasi dalam berbagai format
- **Statistics**: Dashboard analitik dan statistik konsultasi

### 4. **Super Admin Document Ingestion**
- **Bulk Upload**: Upload multiple dokumen sekaligus
- **OCR Support**: Ekstraksi teks dari dokumen image-based
- **Vectorstore Management**: Manajemen dan optimasi knowledge base
- **Document Analytics**: Statistik dan monitoring dokumen

### 5. **Arsip Percakapan Otomatis**
- **Chat History**: Penyimpanan otomatis riwayat percakapan
- **Search Conversations**: Pencarian dalam riwayat chat
- **Export Conversations**: Export percakapan untuk audit
- **Data Retention**: Manajemen retensi data percakapan

### 6. **Workflow SPBE-Compliant**
- **Unit Management**: Pengelolaan unit penanggung jawab
- **Role-Based Access**: Kontrol akses berdasarkan unit dan role
- **Approval Workflow**: Alur persetujuan yang sesuai standar
- **Audit Trail**: Tracking semua aktivitas sistem

---

## 🏗️ Arsitektur Sistem

### Frontend
- **Framework**: Next.js 14 dengan App Router
- **UI Library**: Radix UI + Tailwind CSS + Shadcn/ui
- **State Management**: React Context API
- **Real-time**: WebSocket untuk chat real-time
- **Authentication**: Supabase Auth

### Backend
- **Runtime**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **File Storage**: Sistem file lokal dan cloud storage
- **RAG System**: External Python service untuk document processing

### External Services
- **AI Models**: OpenAI GPT-4/3.5, Google Gemini
- **RAG Service**: Python-based document processing dan vectorization
- **Telegram Bot API**: Untuk integrasi Telegram
- **Email Service**: Notifikasi dan komunikasi

---

## 🗂️ Struktur Database

### Tabel Utama

#### Chatbots
```sql
chatbots
├── id (primary key)
├── user_id (foreign key)
├── name
├── model
├── personality
├── welcome_message
├── fallback_message
├── created_at
└── updated_at
```

#### Konsultasi SPBE
```sql
konsultasi_spbe
├── id (primary key)
├── ticket (unique)
├── nama_lengkap
├── instansi_organisasi
├── kategori
├── status
├── uraian_kebutuhan_konsultasi
├── solusi
├── pic_id (foreign key)
├── created_at
└── updated_at
```

#### Relasi Tambahan
- `chatbot_rag_files`: Files untuk knowledge base
- `chatbot_commands`: Custom commands untuk chatbot
- `konsultasi_unit`: Relasi many-to-many konsultasi dengan unit
- `konsultasi_topik`: Relasi many-to-many konsultasi dengan topik
- `user_unit_penanggungjawab`: Assignment user ke unit

---

## 👥 Sistem User dan Akses

### Role Management
1. **SuperAdmin** (Unit ID = 1)
   - Akses penuh ke semua data konsultasi
   - Dapat mengelola semua chatbot
   - Import/export data
   - Manajemen user dan unit

2. **Admin Unit**
   - Akses terbatas pada unit yang ditugaskan
   - Dapat melihat konsultasi unit mereka
   - Manajemen chatbot sesuai scope

3. **Regular User**
   - Dapat membuat dan mengelola chatbot pribadi
   - Submit konsultasi
   - Akses riwayat konsultasi sendiri

### Unit-Based Access Control
- Sistem kontrol akses berbasis unit penanggung jawab
- Filter otomatis data berdasarkan assignment unit
- Inheritance permission dari parent unit
- Audit trail untuk semua akses data

---

## 🔄 Workflow Konsultasi SPBE

### 1. Pengajuan Konsultasi
```
User Form → Validasi → Generate Ticket → Email Notifikasi
```

### 2. Proses Konsultasi
```
New → On Process → Ready to Send → Konsultasi Zoom → Done
```

### 3. Status Tracking
- **New**: Konsultasi baru diajukan
- **On Process**: Sedang dalam proses penanganan
- **Ready to Send**: Siap untuk dijadwalkan
- **Konsultasi Zoom**: Sedang berlangsung konsultasi
- **Done**: Konsultasi selesai
- **FU Pertanyaan**: Follow-up diperlukan
- **Cancel**: Konsultasi dibatalkan

---

## 🤖 RAG (Retrieval-Augmented Generation) System

### Document Processing
1. **Upload**: Support PDF, DOCX, TXT (max 10MB)
2. **Text Extraction**: Hybrid extraction dengan OCR fallback
3. **Chunking**: Pembagian dokumen menjadi chunks optimal
4. **Vectorization**: Convert text ke vector embeddings
5. **Storage**: Simpan di vectorstore untuk retrieval

### Query Processing
1. **Question Analysis**: Analisis pertanyaan user
2. **Retrieval**: Cari chunks relevan dari vectorstore
3. **Context Building**: Gabungkan chunks menjadi context
4. **Generation**: Generate jawaban menggunakan LLM + context
5. **Response**: Return jawaban dengan source references

### Knowledge Base Management
- Real-time document indexing
- Similarity search dengan relevance scoring
- Automatic reindexing saat ada update
- Statistics dan monitoring knowledge base

---

## 🔌 Integrasi External

### Telegram Bot Integration
- Automatic bot creation dan setup
- Webhook configuration
- Command handling
- Rich message formatting
- Error handling dan fallback

### AI Model Integration
- **OpenAI**: GPT-4, GPT-3.5 Turbo
- **Google**: Gemini Pro
- **Fallback**: Multiple model support untuk reliability
- Rate limiting dan error handling

### Email & Notifications
- Automated email notifications
- SMS integration (optional)
- In-app notifications
- Webhook notifications

---

## 📊 Analytics dan Monitoring

### Dashboard Metrics
- Total konsultasi dan status breakdown
- Chatbot usage statistics
- Response time dan quality metrics
- User engagement analytics
- Document usage dan effectiveness

### Performance Monitoring
- API response times
- Database query performance
- RAG system latency
- Error rates dan debugging

### Audit & Compliance
- Full audit trail untuk semua operasi
- Data retention policies
- Privacy compliance (GDPR ready)
- Security monitoring

---

## 🚀 Deployment dan Scalability

### Production Setup
- Docker containerization
- Load balancing untuk high availability
- CDN untuk static assets
- Database replication dan backup
- Monitoring dan alerting

### Scalability Considerations
- Horizontal scaling untuk API routes
- Vectorstore optimization
- Caching strategies
- Queue system untuk heavy operations

---

## 🔒 Security Features

### Authentication & Authorization
- Multi-factor authentication support
- JWT token management
- Role-based access control
- Session management

### Data Protection
- Encryption at rest dan in transit
- Input validation dan sanitization
- SQL injection protection
- XSS prevention

### API Security
- Rate limiting
- CORS configuration
- API key management
- Request signing

---

## 📝 API Documentation

### Core Endpoints
- `/api/chatbots/*`: Chatbot management
- `/api/v1/konsultasi/*`: Konsultasi SPBE
- `/api/rag/*`: RAG system integration
- `/api/chat/*`: Chat functionality
- `/api/telegram/*`: Telegram integration

### Response Format
```json
{
  "success": boolean,
  "data": object | array,
  "message": string,
  "pagination": {
    "total": number,
    "limit": number,
    "offset": number,
    "hasNext": boolean
  }
}
```

---

## 🛠️ Development & Maintenance

### Tech Stack
- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, Next.js API Routes
- **Database**: PostgreSQL (Supabase)
- **AI/ML**: Python service untuk RAG
- **Deployment**: Vercel/Docker

### Development Workflow
- Git-based version control
- Feature branch workflow
- Automated testing
- CI/CD pipeline
- Code review process

### Maintenance Procedures
- Regular database cleanup
- Vectorstore optimization
- Performance monitoring
- Security updates
- Backup verification

---

## 📞 Support & Contact

### Technical Support
- In-app help system
- Documentation wiki
- Video tutorials
- Community forum

### Business Support
- Implementation consulting
- Training programs
- Custom development
- Enterprise support

---

## 🎯 Future Roadmap

### Planned Features
- Mobile app development
- Advanced analytics dashboard
- Multi-language support
- Voice interaction
- API marketplace
- Third-party integrations

### Performance Improvements
- Advanced caching strategies
- Database optimization
- AI model fine-tuning
- Real-time collaboration features

---

**Terakhir diperbarui**: Desember 2024
**Versi Aplikasi**: 1.0
**Status**: Production Ready

---

*Aplikasi BoCHATS dikembangkan untuk menyediakan solusi komprehensif dalam digitalisasi layanan konsultasi pemerintah dan pembangunan chatbot AI yang intelligent.*
