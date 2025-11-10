# Admin Access Control Documentation

## Overview
Middleware telah diperbarui untuk menambahkan kontrol akses yang lebih granular untuk route admin tertentu.

## Implementasi

### Pengecekan Admin Umum
Semua route yang dimulai dengan `/admin` akan mengecek apakah user memiliki role 'admin' di tabel `profiles`.

### Pengecekan Superadmin
Route khusus yang memerlukan akses superadmin:
- `/admin/users/*` - Manajemen user
- `/admin/context/*` - Manajemen context

### Logika Pengecekan
1. **Basic Admin Check**: User harus memiliki role 'admin' di tabel `profiles`
2. **Superadmin Check**: Untuk route terbatas, user harus memiliki `unit_id = 1` di tabel `user_unit_penanggungjawab`

### Flow Redirect
- User bukan admin → `/access-denied`
- Admin biasa mengakses route superadmin → `/admin/no-access`
- Superadmin → Akses penuh ke semua route admin

### Struktur Database
```sql
-- Tabel user_unit_penanggungjawab
-- unit_id = 1 menandakan superadmin
-- unit_id lainnya untuk admin unit tertentu
```

## Penggunaan
Middleware akan secara otomatis mengecek setiap request dan melakukan redirect sesuai dengan level akses user.

### Testing
Untuk mengetes implementasi:
1. Login sebagai admin biasa (tanpa unit_id = 1)
2. Coba akses `/admin/users` atau `/admin/context`
3. Harusnya diarahkan ke `/admin/no-access`

4. Login sebagai superadmin (dengan unit_id = 1)
5. Coba akses route yang sama
6. Harusnya bisa mengakses normal
