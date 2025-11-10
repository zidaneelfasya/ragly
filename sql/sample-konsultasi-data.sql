-- Sample data for testing konsultasi SPBE functionality

-- Insert sample konsultasi data
INSERT INTO konsultasi_spbe (
    timestamp,
    nama_lengkap,
    nomor_telepon,
    instansi_organisasi,
    asal_kota_kabupaten,
    asal_provinsi,
    uraian_kebutuhan_konsultasi,
    skor_indeks_spbe,
    kondisi_implementasi_spbe,
    fokus_tujuan,
    mekanisme_konsultasi,
    surat_permohonan,
    butuh_konsultasi_lanjut,
    status,
    pic_id,
    solusi,
    kategori,
    ticket
) VALUES
-- Konsultasi 1
(
    NOW() - INTERVAL '3 days',
    'Budi Santoso',
    '081234567890',
    'Dinas Komunikasi dan Informatika Kota Bandung',
    'Bandung',
    'Jawa Barat',
    'Membutuhkan konsultasi untuk implementasi sistem informasi manajemen kepegawaian berbasis web. Saat ini masih menggunakan sistem manual dan ingin beralih ke digital.',
    2.5,
    'Masih menggunakan sistem manual untuk sebagian besar proses',
    'Implementasi SIMPEG terintegrasi',
    'konsultasi zoom',
    'Sudah ada surat permohonan resmi',
    true,
    'new',
    1, -- PIC: Safira
    NULL,
    'aplikasi',
    'SPBE-2024-001'
),
-- Konsultasi 2
(
    NOW() - INTERVAL '2 days',
    'Sari Dewi',
    '081987654321',
    'Bappeda Kabupaten Cianjur',
    'Cianjur',
    'Jawa Barat',
    'Perlu bantuan untuk meningkatkan skor indeks SPBE dari 2.1 menjadi minimal 3.0. Fokus pada aspek tata kelola dan arsitektur SPBE.',
    2.1,
    'Sudah ada beberapa aplikasi digital namun belum terintegrasi',
    'Peningkatan indeks SPBE dan integrasi sistem',
    'konsultasi zoom',
    'Surat sudah diajukan',
    true,
    'on process',
    2, -- PIC: Morris
    'Perlu melakukan assessment mendalam terhadap arsitektur existing',
    'tata kelola',
    'SPBE-2024-002'
),
-- Konsultasi 3
(
    NOW() - INTERVAL '1 day',
    'Ahmad Rahman',
    '082345678901',
    'Dinas Pendidikan Kota Bogor',
    'Bogor',
    'Jawa Barat',
    'Membutuhkan konsultasi untuk implementasi sistem informasi pendidikan yang dapat mengintegrasikan data siswa, guru, dan sarana prasarana.',
    1.8,
    'Belum ada sistem informasi terintegrasi',
    'Pembangunan sistem informasi pendidikan terintegrasi',
    'konsultasi zoom',
    'Surat permohonan dalam proses',
    false,
    'ready to send',
    NULL, -- Belum ada PIC
    NULL,
    'aplikasi',
    'SPBE-2024-003'
),
-- Konsultasi 4
(
    NOW() - INTERVAL '5 hours',
    'Rina Kusuma',
    '083456789012',
    'Dinas Kesehatan Kabupaten Sukabumi',
    'Sukabumi',
    'Jawa Barat',
    'Konsultasi mengenai keamanan sistem informasi kesehatan. Sudah ada sistem tapi perlu penguatan dari sisi keamanan informasi.',
    3.2,
    'Sistem sudah berjalan namun keamanan perlu diperkuat',
    'Penguatan keamanan sistem informasi kesehatan',
    'konsultasi zoom',
    'Surat resmi sudah ada',
    true,
    'konsultasi zoom',
    3, -- PIC: Allysa
    'Implementasi security framework dan penetration testing',
    'keamanan informasi',
    'SPBE-2024-004'
),
-- Konsultasi 5
(
    NOW() - INTERVAL '2 hours',
    'Dedi Firmansyah',
    '084567890123',
    'Badan Kepegawaian Daerah Kota Depok',
    'Depok',
    'Jawa Barat',
    'Membutuhkan pelatihan SDM untuk mengelola sistem SPBE. Tim IT masih terbatas kemampuannya dalam mengelola infrastruktur digital.',
    2.8,
    'Infrastruktur sudah ada namun SDM belum optimal',
    'Peningkatan kapasitas SDM dalam pengelolaan SPBE',
    'konsultasi zoom',
    'Sudah ada surat resmi',
    true,
    'done',
    4, -- PIC: Babas
    'Program pelatihan intensif untuk tim IT dan admin sistem sudah diselesaikan',
    'SDM',
    'SPBE-2024-005'
);

-- Insert sample konsultasi_unit relationships
INSERT INTO konsultasi_unit (konsultasi_id, unit_id) VALUES
(1, 1), -- Konsultasi 1 dengan Tim Akselerasi Pemerintah Daerah
(1, 4), -- Konsultasi 1 dengan Direktorat Aplikasi Pemerintah
(2, 1), -- Konsultasi 2 dengan Tim Akselerasi Pemerintah Daerah
(3, 4), -- Konsultasi 3 dengan Direktorat Aplikasi Pemerintah
(4, 9), -- Konsultasi 4 dengan BSSN
(5, 1); -- Konsultasi 5 dengan Tim Akselerasi Pemerintah Daerah

-- Insert sample konsultasi_topik relationships
INSERT INTO konsultasi_topik (konsultasi_id, topik_id) VALUES
(1, 2), -- Konsultasi 1 dengan Aplikasi SPBE/Pemerintah Digital
(1, 8), -- Konsultasi 1 dengan Pengelolaan SDM SPBE
(2, 1), -- Konsultasi 2 dengan Arsitektur, Tata Kelola, Regulasi
(2, 9), -- Konsultasi 2 dengan Pengukuran dan Evaluasi SPBE
(3, 2), -- Konsultasi 3 dengan Aplikasi SPBE/Pemerintah Digital
(3, 5), -- Konsultasi 3 dengan Manajemen Data dan Informasi
(4, 6), -- Konsultasi 4 dengan Keamanan Data
(4, 3), -- Konsultasi 4 dengan Infrastruktur SPBE
(5, 8), -- Konsultasi 5 dengan Pengelolaan SDM SPBE
(5, 1); -- Konsultasi 5 dengan Arsitektur, Tata Kelola, Regulasi
