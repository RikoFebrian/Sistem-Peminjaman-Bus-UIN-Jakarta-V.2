-- Insert sample users
INSERT INTO users (nim, nama_mhs, prodi, fakultas, email, password, role) VALUES
('11190910000001', 'Ahmad Fauzi', 'Sistem Informasi', 'Sains dan Teknologi', 'ahmad.fauzi@mhs.uin-jakarta.ac.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('11190910000002', 'Siti Nurhaliza', 'Teknik Informatika', 'Sains dan Teknologi', 'siti.nurhaliza@mhs.uin-jakarta.ac.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('11190910000003', 'Muhammad Rizki', 'Manajemen', 'Ekonomi dan Bisnis', 'muhammad.rizki@mhs.uin-jakarta.ac.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('11190910000004', 'Fatimah Zahra', 'Pendidikan Bahasa Inggris', 'Tarbiyah dan Keguruan', 'fatimah.zahra@mhs.uin-jakarta.ac.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('11190910000005', 'Abdul Rahman', 'Hukum Keluarga Islam', 'Syariah dan Hukum', 'abdul.rahman@mhs.uin-jakarta.ac.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user');

-- Insert sample bus loan requests
INSERT INTO bus_loans (user_id, nim, nama_mhs, prodi, fakultas, kegunaan, tanggal_pinjam, tanggal_kembali, status) VALUES
(2, '11190910000001', 'Ahmad Fauzi', 'Sistem Informasi', 'Sains dan Teknologi', 'Kunjungan lapangan mata kuliah Sistem Basis Data ke PT. Telkom Indonesia', '2024-07-15', '2024-07-15', 'approved'),
(3, '11190910000002', 'Siti Nurhaliza', 'Teknik Informatika', 'Sains dan Teknologi', 'Seminar nasional teknologi informasi di Jakarta Convention Center', '2024-07-20', '2024-07-20', 'pending'),
(4, '11190910000003', 'Muhammad Rizki', 'Manajemen', 'Ekonomi dan Bisnis', 'Study tour ke Bank Indonesia untuk mata kuliah Manajemen Keuangan', '2024-07-25', '2024-07-25', 'pending'),
(5, '11190910000004', 'Fatimah Zahra', 'Pendidikan Bahasa Inggris', 'Tarbiyah dan Keguruan', 'Workshop pengembangan kurikulum pendidikan di Kemendikbud', '2024-07-18', '2024-07-18', 'completed'),
(6, '11190910000005', 'Abdul Rahman', 'Hukum Keluarga Islam', 'Syariah dan Hukum', 'Kunjungan ke Pengadilan Agama Jakarta Selatan untuk observasi sidang', '2024-07-22', '2024-07-22', 'approved');
