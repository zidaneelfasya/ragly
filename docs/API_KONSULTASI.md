# API Dokumentasi - Konsultasi SPBE

## Base URL
`/api/v1/konsultasi`

## Endpoints

### 1. GET /api/v1/konsultasi
Mengambil daftar konsultasi atau detail konsultasi berdasarkan ID.

#### Query Parameters:
- `id` (optional): ID konsultasi spesifik
- `status` (optional): Filter berdasarkan status ('new', 'on process', 'ready to send', 'konsultasi zoom', 'done', 'FU pertanyaan', 'cancel')
- `kategori` (optional): Filter berdasarkan kategori ('tata kelola', 'infrastruktur', 'aplikasi', 'keamanan informasi', 'SDM')
- `pic_id` (optional): Filter berdasarkan ID PIC
- `instansi` (optional): Filter berdasarkan nama instansi (pencarian parsial)
- `limit` (optional): Jumlah data per halaman
- `offset` (optional): Offset untuk pagination
- `sortBy` (optional): Field untuk sorting (default: 'created_at')
- `sortOrder` (optional): Urutan sorting 'asc' atau 'desc' (default: 'desc')

#### Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nama_lengkap": "John Doe",
      "instansi_organisasi": "Pemda Jakarta",
      "status": "new",
      "kategori": "aplikasi",
      "pic_list": {
        "id": 1,
        "nama_pic": "Safira"
      },
      "konsultasi_unit": [...],
      "konsultasi_topik": [...],
      ...
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 10,
    "offset": 0,
    "hasNext": true
  },
  "message": "Data konsultasi berhasil diambil"
}
```

### 2. POST /api/v1/konsultasi
Membuat konsultasi baru.

#### Request Body:
```json
{
  "nama_lengkap": "John Doe",
  "nomor_telepon": "08123456789",
  "instansi_organisasi": "Pemda Jakarta",
  "asal_kota_kabupaten": "Jakarta Pusat",
  "asal_provinsi": "DKI Jakarta",
  "uraian_kebutuhan_konsultasi": "Butuh bantuan implementasi...",
  "skor_indeks_spbe": 2.5,
  "kondisi_implementasi_spbe": "Sudah ada aplikasi dasar",
  "fokus_tujuan": "Meningkatkan layanan digital",
  "mekanisme_konsultasi": "Online",
  "butuh_konsultasi_lanjut": true,
  "status": "new",
  "kategori": "aplikasi",
  "pic_id": 1
}
```

#### Response:
```json
{
  "success": true,
  "data": { ... },
  "message": "Data konsultasi berhasil disimpan"
}
```

### 3. PUT /api/v1/konsultasi
Mengupdate konsultasi yang sudah ada.

#### Request Body:
```json
{
  "id": 1,
  "status": "on process",
  "pic_id": 2,
  "solusi": "Implementasi sistem baru...",
  ...
}
```

#### Response:
```json
{
  "success": true,
  "data": { ... },
  "message": "Data konsultasi berhasil diupdate"
}
```

### 4. DELETE /api/v1/konsultasi
Menghapus konsultasi.

#### Query Parameters:
- `id`: ID konsultasi yang akan dihapus

#### Response:
```json
{
  "success": true,
  "message": "Data konsultasi berhasil dihapus"
}
```

---

## Endpoint Untuk Mengambil Semua Data

### 1. GET /api/v1/konsultasi/all
Mengambil semua data konsultasi dengan transformasi data yang lebih mudah digunakan.

#### Query Parameters:
- `limit` (optional): Jumlah data per halaman
- `offset` (optional): Offset untuk pagination
- `sortBy` (optional): Field untuk sorting (default: 'created_at')
- `sortOrder` (optional): Urutan sorting 'asc' atau 'desc' (default: 'desc')

#### Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nama_lengkap": "John Doe",
      "instansi_organisasi": "Pemda Jakarta",
      "status": "new",
      "kategori": "aplikasi",
      "pic_name": "Safira",
      "units": [
        {
          "unit_id": 1,
          "unit_name": "Tim Akselerasi Pemerintah Daerah",
          "unit_pic_name": "Safira"
        }
      ],
      "topics": [
        {
          "topik_id": 1,
          "topik_name": "Aplikasi SPBE/Pemerintah Digital"
        }
      ],
      ...
    }
  ],
  "pagination": { ... },
  "message": "Berhasil mengambil 10 dari 150 data konsultasi"
}
```

### 2. GET /api/v1/konsultasi/raw
Mengambil data konsultasi mentah dengan berbagai format.

#### Query Parameters:
- `format` (optional): Format data ('basic', 'export', 'full') - default: 'full'
- `limit` (optional): Jumlah data per halaman
- `offset` (optional): Offset untuk pagination
- `sortBy` (optional): Field untuk sorting (default: 'created_at')
- `sortOrder` (optional): Urutan sorting 'asc' atau 'desc' (default: 'desc')

#### Format Options:
- `basic`: Hanya field utama (id, nama, instansi, status, kategori, created_at, pic_name)
- `export`: Field untuk ekspor data (tanpa relasi kompleks)
- `full`: Semua field dengan relasi lengkap

#### Response:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 150,
    "limit": 10,
    "offset": 0,
    "hasNext": true,
    "currentPage": 1,
    "totalPages": 15
  },
  "summary": {
    "total": 150,
    "byStatus": { "new": 20, "done": 85, ... },
    "byKategori": { "aplikasi": 45, ... }
  },
  "meta": {
    "format": "full",
    "sortBy": "created_at",
    "sortOrder": "desc",
    "timestamp": "2025-09-03T10:30:00.000Z"
  },
  "message": "Berhasil mengambil 10 dari 150 data konsultasi (format: full)"
}
```

### 3. GET /api/v1/konsultasi/bulk
Mengambil SEMUA data konsultasi beserta semua data pendukung tanpa pagination.

#### Response:
```json
{
  "success": true,
  "data": {
    "konsultasi": [...], // Semua data konsultasi dengan relasi
    "pic_list": [...],   // Semua data PIC
    "units": [...],      // Semua data unit penanggung jawab
    "topics": [...]      // Semua data topik konsultasi
  },
  "statistics": {
    "total_konsultasi": 150,
    "total_pic": 10,
    "total_units": 10,
    "total_topics": 9,
    "by_status": { "new": 20, ... },
    "by_kategori": { "aplikasi": 45, ... },
    "by_pic": { "Safira": 25, ... }
  },
  "meta": {
    "total_records": {
      "konsultasi": 150,
      "pic": 10,
      "units": 10,
      "topics": 9
    },
    "last_updated": "2025-09-03T10:30:00.000Z",
    "format": "complete_dataset"
  },
  "message": "Berhasil mengambil semua data konsultasi SPBE beserta semua data pendukung"
}
```

---

## Endpoint Pendukung

### 1. GET /api/v1/konsultasi/stats
Mengambil statistik konsultasi.

#### Response:
```json
{
  "success": true,
  "data": {
    "total": 150,
    "byStatus": {
      "new": 20,
      "on process": 30,
      "done": 85,
      ...
    },
    "byKategori": {
      "aplikasi": 45,
      "infrastruktur": 30,
      ...
    },
    "byPIC": {
      "1": {
        "count": 25,
        "pic_name": "Safira"
      },
      ...
    },
    "monthly": {
      "2024-01": 12,
      "2024-02": 18,
      ...
    },
    "recent": [...]
  },
  "message": "Statistik konsultasi berhasil diambil"
}
```

### 2. GET /api/v1/konsultasi/pic
Mengambil daftar PIC (Person In Charge).

#### Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nama_pic": "Safira"
    },
    ...
  ],
  "message": "Daftar PIC berhasil diambil"
}
```

### 3. GET /api/v1/konsultasi/units
Mengambil daftar unit penanggung jawab.

#### Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nama_unit": "Tim Akselerasi Pemerintah Daerah",
      "pic_id": 1,
      "pic_list": {
        "id": 1,
        "nama_pic": "Safira"
      }
    },
    ...
  ],
  "message": "Daftar unit penanggung jawab berhasil diambil"
}
```

### 4. PUT /api/v1/konsultasi/units
Mengupdate unit penanggung jawab untuk konsultasi (many-to-many relationship).

#### Request Body:
```json
{
  "konsultasi_id": 1,
  "unit_ids": [1, 3, 5]
}
```

#### Response:
```json
{
  "success": true,
  "message": "Unit penanggung jawab berhasil diperbarui untuk konsultasi #1"
}
```

**Catatan**: Endpoint ini akan menghapus semua relasi unit lama untuk konsultasi tersebut, kemudian menambahkan relasi baru sesuai dengan `unit_ids` yang diberikan. Jika `unit_ids` berupa array kosong `[]`, maka semua relasi unit untuk konsultasi tersebut akan dihapus.

### 5. GET /api/v1/konsultasi/topics
Mengambil daftar topik konsultasi.

#### Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nama_topik": "Arsitektur, Tata Kelola, Regulasi, dan Kebijakan"
    },
    ...
  ],
  "message": "Daftar topik konsultasi berhasil diambil"
}
```

---

## Status Codes

- `200`: Success
- `201`: Created (untuk POST request)
- `400`: Bad Request (data tidak valid)
- `404`: Not Found (data tidak ditemukan)
- `500`: Internal Server Error

## Error Response Format

```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

## Contoh Penggunaan

### Mengambil semua konsultasi (transformed):
```
GET /api/v1/konsultasi/all?limit=50&offset=0&sortBy=created_at&sortOrder=desc
```

### Mengambil data mentah untuk export:
```
GET /api/v1/konsultasi/raw?format=export&limit=1000
```

### Mengambil semua data sekaligus (bulk):
```
GET /api/v1/konsultasi/bulk
```

### Mengambil semua konsultasi dengan pagination:
```
GET /api/v1/konsultasi?limit=10&offset=0&sortBy=created_at&sortOrder=desc
```

### Mengambil konsultasi berdasarkan status:
```
GET /api/v1/konsultasi?status=new
```

### Mengambil detail konsultasi:
```
GET /api/v1/konsultasi?id=1
```

### Mengambil konsultasi berdasarkan instansi:
```
GET /api/v1/konsultasi?instansi=Jakarta
```
