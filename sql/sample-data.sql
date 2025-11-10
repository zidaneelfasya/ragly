-- Sample data for testing chat functionality
-- Note: Replace the user_id values with actual user IDs from your auth.users table

-- Sample threads
INSERT INTO threads (id, title, user_id, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'How to implement SPBE in remote areas?', 'user-id-here', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 hour'),
('550e8400-e29b-41d4-a716-446655440001', 'Digital transformation best practices', 'user-id-here', NOW() - INTERVAL '1 day', NOW() - INTERVAL '30 minutes'),
('550e8400-e29b-41d4-a716-446655440002', 'Government digitalization challenges', 'user-id-here', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '10 minutes');

-- Sample messages for first thread
INSERT INTO messages (role, content, thread_id, created_at, updated_at) VALUES
('user', 'Dalam upaya memperluas penerapan SPBE di daerah terpencil atau tertinggal, faktor seperti infrastruktur internet yang terbatas, rendahnya literasi digital, dan anggaran yang minim sering menjadi kendala. Bagaimana strategi yang dapat diadopsi oleh pemerintah pusat dan daerah untuk mengatasi disparitas ini?', '550e8400-e29b-41d4-a716-446655440000', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('assistant', 'Untuk mengatasi tantangan SPBE di daerah terpencil, beberapa strategi yang dapat diterapkan:\n\n1. **Infrastruktur Bertahap**: Mulai dengan infrastruktur dasar seperti tower BTS dan akses internet satelit\n\n2. **Kolaborasi Publik-Swasta**: Bermitra dengan BUMN seperti Telkom untuk mempercepat pembangunan infrastruktur\n\n3. **Pelatihan Literasi Digital**: Program pelatihan berkelanjutan untuk aparatur dan masyarakat\n\n4. **Pendanaan Kreatif**: Manfaatkan dana desa, CSR perusahaan, dan hibah internasional\n\n5. **Solusi Mobile-First**: Prioritaskan aplikasi mobile yang lebih mudah diakses', '550e8400-e29b-41d4-a716-446655440000', NOW() - INTERVAL '2 days' + INTERVAL '5 minutes', NOW() - INTERVAL '2 days' + INTERVAL '5 minutes'),
('user', 'Bagaimana dengan model pendanaan yang sustainable? Apakah ada contoh yang sudah berhasil?', '550e8400-e29b-41d4-a716-446655440000', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour');

-- Sample messages for second thread  
INSERT INTO messages (role, content, thread_id, created_at, updated_at) VALUES
('user', 'Apa saja best practices dalam transformasi digital pemerintahan yang sudah terbukti berhasil di Indonesia?', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('assistant', 'Beberapa best practices transformasi digital pemerintahan di Indonesia:\n\n1. **OSS (Online Single Submission)**: Menyederhanakan perizinan usaha\n\n2. **Aplikasi PeduliLindungi**: Respons cepat terhadap pandemi\n\n3. **Program Satu Data Indonesia**: Integrasi data antar kementerian\n\n4. **e-Katalog**: Transparansi pengadaan barang/jasa\n\n5. **Dukcapil Online**: Layanan kependudukan digital', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '1 day' + INTERVAL '10 minutes', NOW() - INTERVAL '1 day' + INTERVAL '10 minutes');

-- Sample messages for third thread
INSERT INTO messages (role, content, thread_id, created_at, updated_at) VALUES
('user', 'Apa tantangan utama dalam digitalisasi pemerintahan di Indonesia?', '550e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours'),
('assistant', 'Tantangan utama digitalisasi pemerintahan:\n\n1. **Silo Mentality**: Ego sektoral antar instansi\n\n2. **Legacy Systems**: Sistem lama yang sulit diintegrasikan\n\n3. **Skill Gap**: Kurangnya talent digital di pemerintahan\n\n4. **Budget Constraints**: Keterbatasan anggaran untuk teknologi\n\n5. **Change Management**: Resistensi terhadap perubahan\n\n6. **Cybersecurity**: Keamanan data dan sistem yang rentan', '550e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '3 hours' + INTERVAL '2 minutes', NOW() - INTERVAL '3 hours' + INTERVAL '2 minutes'),
('user', 'Bagaimana cara mengatasi ego sektoral ini secara praktis?', '550e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '10 minutes', NOW() - INTERVAL '10 minutes');
