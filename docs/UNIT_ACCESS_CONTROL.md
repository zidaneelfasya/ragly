# Unit-Based Access Control System

## Overview

Sistem kontrol akses berbasis unit telah diimplementasikan untuk membatasi akses data konsultasi berdasarkan unit penanggungjawab yang ditugaskan kepada setiap user.

## Konsep Utama

### 1. Superadmin (Unit ID = 1)
- Unit dengan ID = 1 ("Tim Akselerasi Pemerintah Daerah") bertindak sebagai **superadmin**
- User yang memiliki akses ke unit ID = 1 dapat melihat **semua data konsultasi**
- Tidak ada pembatasan filtering berdasarkan unit

### 2. Unit-Based Access
- User yang tidak memiliki akses ke unit ID = 1 hanya dapat melihat data konsultasi yang terkait dengan unit mereka
- Filtering dilakukan berdasarkan relasi `konsultasi_unit` di database
- User dapat memiliki akses ke multiple units

### 3. No Unit Access
- User yang tidak memiliki unit assignment tidak dapat melihat data konsultasi apa pun
- API akan mengembalikan array kosong

## Implementasi

### Database Schema

```sql
-- Tabel unit penanggungjawab
CREATE TABLE unit_penanggungjawab (
    id SERIAL PRIMARY KEY,
    nama_unit TEXT UNIQUE NOT NULL,
    nama_pic TEXT
);

-- Unit superadmin (ID = 1)
INSERT INTO unit_penanggungjawab (nama_unit, nama_pic) VALUES
('Tim Akselerasi Pemerintah Daerah','Safira'), -- ID = 1, Superadmin

-- Tabel assignment user ke unit
CREATE TABLE user_unit_penanggungjawab (
  user_id uuid NOT NULL,
  unit_id integer NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT user_unit_penanggungjawab_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT user_unit_penanggungjawab_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.unit_penanggungjawab(id),
  CONSTRAINT user_unit_penanggungjawab_unique UNIQUE (user_id, unit_id)
);

-- Tabel relasi konsultasi dengan unit
CREATE TABLE konsultasi_unit (
    konsultasi_id INTEGER REFERENCES konsultasi_spbe(id) ON DELETE CASCADE,
    unit_id INTEGER REFERENCES unit_penanggungjawab(id) ON DELETE CASCADE,
    PRIMARY KEY (konsultasi_id, unit_id)
);
```

### API Implementation

#### GET /api/v1/konsultasi/all

Parameter tambahan:
- `enforceUserUnits=true`: Mengaktifkan filtering berdasarkan unit user

Logika filtering:
1. Jika `enforceUserUnits=true`, sistem akan:
   - Mengambil unit assignment user dari `user_unit_penanggungjawab`
   - Cek apakah user memiliki akses ke unit ID = 1 (superadmin)
   - Jika superadmin: tampilkan semua data
   - Jika bukan superadmin: filter data berdasarkan unit user
   - Jika tidak ada unit: return array kosong

#### User Context

```typescript
interface UserContextType {
  userUnits: UserUnit[];
  loading: boolean;
  isAdmin: boolean; // true jika user memiliki akses ke unit ID = 1
  userRole: string | null;
  error: string | null;
  refreshUserData: () => Promise<void>;
}
```

### Frontend Implementation

#### Components
- `DataTableAdminKonsultasi`: Menampilkan badge status akses user (Superadmin vs Unit Access)
- `FilterBar`: Menambahkan parameter `enforceUserUnits` saat fetching data
- `UserProvider`: Menentukan status admin berdasarkan unit assignment

#### Logic Flow
1. User login → `UserProvider` fetch user units
2. Cek apakah user memiliki unit ID = 1 → set `isAdmin`
3. `DataTableAdminKonsultasi` load data dengan parameter `enforceUserUnits` (kecuali jika superadmin)
4. API filter data berdasarkan unit user
5. Display data sesuai akses user

## Usage Examples

### Contoh 1: Superadmin Access
```sql
-- User dengan akses superadmin
INSERT INTO user_unit_penanggungjawab (user_id, unit_id) VALUES 
('user-uuid', 1); -- Unit ID = 1

-- Result: User dapat melihat SEMUA data konsultasi
```

### Contoh 2: Unit-Specific Access
```sql
-- User dengan akses unit tertentu
INSERT INTO user_unit_penanggungjawab (user_id, unit_id) VALUES 
('user-uuid', 7); -- Unit ID = 7 (BAKTI)

-- Result: User hanya dapat melihat konsultasi yang ditangani oleh unit BAKTI
```

### Contoh 3: Multiple Unit Access
```sql
-- User dengan akses multiple units
INSERT INTO user_unit_penanggungjawab (user_id, unit_id) VALUES 
('user-uuid', 2), -- Tim Smart City
('user-uuid', 3); -- Tim Desa dan Konkuren

-- Result: User dapat melihat konsultasi yang ditangani oleh kedua unit tersebut
```

## Benefits

1. **Security**: Data konsultasi terlindungi berdasarkan unit assignment
2. **Scalability**: Mudah menambah/mengurangi akses unit untuk user
3. **Flexibility**: Satu user dapat memiliki akses ke multiple units
4. **Clear Hierarchy**: Superadmin memiliki akses penuh, unit user memiliki akses terbatas
5. **Audit Trail**: Semua assignment tercatat di database

## Future Enhancements

1. **Role-Based Permissions**: Tambahkan level permission (read, write, delete) per unit
2. **Department Hierarchy**: Implementasi hierarki departemen
3. **Temporary Access**: Akses sementara dengan expiration date
4. **Audit Logging**: Log semua akses dan perubahan data
5. **Bulk Assignment**: Tools untuk assignment user ke unit secara bulk

## Migration Guide

Untuk sistem yang sudah ada:

1. **Setup Unit Assignment**:
   ```sql
   -- Assign existing admins to superadmin unit
   INSERT INTO user_unit_penanggungjawab (user_id, unit_id) 
   SELECT id, 1 FROM auth.users WHERE email IN ('admin@example.com');
   
   -- Assign regular users to their respective units
   INSERT INTO user_unit_penanggungjawab (user_id, unit_id) 
   SELECT user_id, unit_id FROM existing_user_assignments;
   ```

2. **Update Frontend**: Deploy komponen yang sudah diupdate
3. **Test Access**: Verifikasi akses user sesuai dengan unit assignment
4. **Remove Old Logic**: Hapus logic admin lama yang tidak terpakai

## Troubleshooting

### User Tidak Bisa Melihat Data
1. Cek unit assignment di `user_unit_penanggungjawab`
2. Pastikan konsultasi memiliki unit assignment di `konsultasi_unit`
3. Verifikasi parameter `enforceUserUnits` di API call

### Superadmin Tidak Bisa Melihat Semua Data
1. Pastikan user memiliki akses ke unit ID = 1
2. Cek implementasi `isAdmin` logic di frontend
3. Verifikasi API tidak mengirim parameter `enforceUserUnits` untuk superadmin

### Performance Issues
1. Pastikan index pada foreign key di `user_unit_penanggungjawab`
2. Pertimbangkan caching untuk unit assignment
3. Optimize query dengan proper joins
