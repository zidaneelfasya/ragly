# API Endpoints untuk Akses Data Konsultasi

## Ringkasan

Aplikasi sekarang memiliki 3 endpoint API utama untuk mengakses data konsultasi dengan level akses yang berbeda:

### 1. `/api/v1/konsultasi/all` (Legacy)
- **Status**: Deprecated, masih ada untuk backward compatibility
- **Akses**: Menggunakan parameter `enforceUserUnits` untuk mengontrol akses
- **Masalah**: Logika akses tidak konsisten

### 2. `/api/v1/konsultasi/admin` (Baru)
- **Status**: Aktif
- **Akses**: Khusus untuk SuperAdmin (user dengan unit_id = 1)
- **Data**: Menampilkan semua data konsultasi tanpa filter
- **Keamanan**: Memeriksa akses SuperAdmin di server-side

### 3. `/api/v1/konsultasi/unit-filtered` (Baru)
- **Status**: Aktif  
- **Akses**: Untuk semua user (SuperAdmin dan Non-SuperAdmin)
- **Data**: 
  - SuperAdmin: Semua data
  - Non-SuperAdmin: Hanya data dari unit yang ditugaskan
- **Keamanan**: Filter otomatis berdasarkan unit user

## Cara Kerja

### Frontend Logic
```typescript
// Di components/data-table-admin-konsultasi.tsx
const apiEndpoint = isAdmin 
    ? `/api/v1/konsultasi/admin?${params.toString()}`
    : `/api/v1/konsultasi/unit-filtered?${params.toString()}`;
```

### User Access Levels

#### SuperAdmin (unit_id = 1)
- Menggunakan `/api/v1/konsultasi/admin`
- Akses penuh ke semua data konsultasi
- Dapat melihat dan mengedit semua konsultasi

#### Regular User (unit_id ≠ 1)
- Menggunakan `/api/v1/konsultasi/unit-filtered`
- Hanya melihat konsultasi yang terkait dengan unit mereka
- Filter otomatis di level database

### Database Query

#### SuperAdmin Query
```sql
SELECT * FROM konsultasi_spbe 
LEFT JOIN konsultasi_unit ON konsultasi_spbe.id = konsultasi_unit.konsultasi_id
-- Tidak ada filter unit
```

#### Non-SuperAdmin Query
```sql
SELECT * FROM konsultasi_spbe 
INNER JOIN konsultasi_unit ON konsultasi_spbe.id = konsultasi_unit.konsultasi_id
WHERE konsultasi_unit.unit_id IN (user_unit_ids)
-- Filter berdasarkan unit user
```

## Testing

### Test SuperAdmin Access
1. Login dengan user yang memiliki unit_id = 1
2. Buka halaman admin konsultasi
3. Cek log browser: `Admin API - Is SuperAdmin: true`
4. Cek endpoint yang dipanggil: `/api/v1/konsultasi/admin`

### Test Non-SuperAdmin Access
1. Login dengan user yang memiliki unit_id ≠ 1 (contoh: unit_id = 4)
2. Buka halaman admin konsultasi  
3. Cek log browser: `Unit Filtered API - Is SuperAdmin: false`
4. Cek endpoint yang dipanggil: `/api/v1/konsultasi/unit-filtered`
5. Verifikasi data yang tampil hanya dari unit user tersebut

## Response Format

Semua endpoint mengembalikan format yang sama:

```json
{
  "success": true,
  "data": [...],
  "debug": {
    "userUnitIds": [1],
    "isSuperAdmin": true,
    "totalCount": 100,
    "filteredCount": 100,
    "accessLevel": "superadmin-full-access" // atau "unit-restricted"
  },
  "pagination": {...},
  "message": "Berhasil mengambil data..."
}
```

## Security Features

1. **Authentication Check**: Semua endpoint memverifikasi user login
2. **Unit Verification**: Mengecek unit assignment dari database
3. **Access Control**: SuperAdmin vs Non-SuperAdmin logic
4. **Data Filtering**: Automatic filtering berdasarkan unit user
5. **SQL Injection Prevention**: Menggunakan Supabase parameterized queries

## Migration dari Endpoint Lama

Untuk menggunakan system baru:

1. Frontend sudah otomatis menggunakan endpoint yang tepat
2. Endpoint lama `/api/v1/konsultasi/all` masih berfungsi tapi deprecated
3. Monitoring log untuk memastikan endpoint baru berfungsi dengan benar
