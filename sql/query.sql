CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- ALTER statements to add new fields to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS nip TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS jabatan TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS satuan_kerja TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS instansi TEXT;

create table threads (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    user_id uuid references auth.users(id) on delete cascade,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Tabel messages
create table messages (
    id uuid primary key default gen_random_uuid(),
    role text check (role in ('user', 'assistant')) not null,
    content text not null,
    thread_id uuid references threads(id) on delete cascade,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- untuk admin klinik pemdi
-- Buat ENUM untuk kategori
CREATE TYPE kategori_enum AS ENUM ('tata kelola', 'infrastruktur', 'aplikasi', 'keamanan informasi', 'SDM');

-- Buat ENUM untuk status
CREATE TYPE status_enum AS ENUM ('new', 'on process', 'ready to send', 'konsultasi zoom', 'done', 'FU pertanyaan', 'cancel');

-- Buat tabel untuk PIC (Person In Charge)
CREATE TABLE pic_list (
    id SERIAL PRIMARY KEY,
    nama_pic TEXT UNIQUE NOT NULL
);

-- Insert data PIC
INSERT INTO pic_list (nama_pic) VALUES
('Safira'),
('Morris'),
('Allysa'),
('Babas'),
('Ana'),
('Rossi'),
('Hamid');

-- Buat tabel utama untuk menyimpan respons konsultasi
CREATE TABLE konsultasi_spbe (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP,
    nama_lengkap TEXT,
    nomor_telepon TEXT,
    instansi_organisasi TEXT,
    asal_kota_kabupaten TEXT,
    asal_provinsi TEXT,
    uraian_kebutuhan_konsultasi TEXT,
    skor_indeks_spbe NUMERIC,
    kondisi_implementasi_spbe TEXT,
    fokus_tujuan TEXT,
    mekanisme_konsultasi TEXT,
    surat_permohonan TEXT,
    butuh_konsultasi_lanjut BOOLEAN,
    status status_enum,
    pic_id INTEGER REFERENCES pic_list(id),
    solusi TEXT,
    kategori kategori_enum,
    ticket TEXT, -- Field ticket yang ditambahkan
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Buat tabel untuk unit penanggung jawab
CREATE TABLE unit_penanggungjawab (
    id SERIAL PRIMARY KEY,
    nama_unit TEXT UNIQUE NOT NULL,
    nama_pic TEXT
);

-- Insert data unit penanggung jawab
INSERT INTO unit_penanggungjawab (nama_unit, nama_pic) VALUES
('Tim Akselerasi Pemerintah Daerah','Safira'),
('Tim Smart City','Dina'),
('Tim Desa dan Konkuren','Rian'),
('Direktorat Aplikasi Pemerintah','Sofi'),
('Direktorat Infrastruktur Pemerintah','Nayaka'),
('Direktorat Strajak', 'Yuki'),
('BAKTI', NULL),
('Ditjen Infrastruktur Digital','Hilman'),
('BSSN','Ivan Bashofi'),
('KemenPANRB','Iksan');

-- Buat tabel untuk menghubungkan konsultasi dengan unit
CREATE TABLE konsultasi_unit (
    konsultasi_id INTEGER REFERENCES konsultasi_spbe(id) ON DELETE CASCADE,
    unit_id INTEGER REFERENCES unit_penanggungjawab(id) ON DELETE CASCADE,
    PRIMARY KEY (konsultasi_id, unit_id)
);

-- Buat tabel untuk topik konsultasi
CREATE TABLE topik_konsultasi (
    id SERIAL PRIMARY KEY,
    nama_topik TEXT UNIQUE NOT NULL
);

-- Insert data topik konsultasi
INSERT INTO topik_konsultasi (nama_topik) VALUES
('Arsitektur, Tata Kelola, Regulasi, dan Kebijakan'),
('Aplikasi SPBE/Pemerintah Digital'),
('Infrastruktur SPBE/Pemerintah Digital'),
('Akses Internet'),
('Manajemen Data dan Informasi'),
('Keamanan Data'),
('Layanan Digital Pemerintah'),
('Pengelolaan Sumber Daya Manusia SPBE/Pemerintah Digital'),
('Pengukuran dan Evaluasi SPBE/Pemerintah Digital');

-- Buat tabel untuk menghubungkan konsultasi dengan topik
CREATE TABLE konsultasi_topik (
    konsultasi_id INTEGER REFERENCES konsultasi_spbe(id) ON DELETE CASCADE,
    topik_id INTEGER REFERENCES topik_konsultasi(id) ON DELETE CASCADE,
    PRIMARY KEY (konsultasi_id, topik_id)
);

CREATE TABLE public.user_unit_penanggungjawab (
  id SERIAL PRIMARY KEY,
  user_id uuid NOT NULL,
  unit_id integer NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT user_unit_penanggungjawab_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT user_unit_penanggungjawab_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.unit_penanggungjawab(id),
  CONSTRAINT user_unit_penanggungjawab_unique UNIQUE (user_id, unit_id)
);

-- CREATE TABLE roles (
--     id SERIAL PRIMARY KEY,
--     role TEXT UNIQUE NOT NULL
-- );

-- CREATE TABLE user_role (
--     user_id uuid NOT NULL,
--     role_id integer NOT NULL,
--     CONSTRAINT user_role_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
--     CONSTRAINT user_role_unit_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id),
--     CONSTRAINT user_role_unique UNIQUE (user_id, role_id)
-- );

-- Trigger untuk update timestamp otomatis
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_konsultasi_updated_at
    BEFORE UPDATE ON konsultasi_spbe
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
