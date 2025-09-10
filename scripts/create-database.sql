-- Langkah 1: Buat tipe data ENUM kustom terlebih dahulu.
-- Hapus tipe yang sudah ada jika ada untuk menghindari error saat menjalankan ulang.
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS loan_status CASCADE;

CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE loan_status AS ENUM ('pending', 'approved', 'rejected', 'completed');


-- Langkah 2: Buat tabel 'users' menggunakan tipe SERIAL dan ENUM yang sudah dibuat.
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nim VARCHAR(20) UNIQUE NOT NULL,
    nama_mhs VARCHAR(100) NOT NULL,
    prodi VARCHAR(100) NOT NULL,
    fakultas VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'user',
    -- Gunakan TIMESTAMPTZ untuk zona waktu
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);


-- Langkah 3: Buat tabel 'bus_loans'.
CREATE TABLE IF NOT EXISTS bus_loans (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    nim VARCHAR(20) NOT NULL,
    nama_mhs VARCHAR(100) NOT NULL,
    prodi VARCHAR(100) NOT NULL,
    fakultas VARCHAR(100) NOT NULL,
    kegunaan TEXT NOT NULL,
    tanggal_pinjam DATE NOT NULL,
    tanggal_kembali DATE NOT NULL,
    status loan_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    -- Kolom 'updated_at' akan diperbarui oleh trigger di bawah
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- Langkah 4: Buat fungsi trigger untuk memperbarui 'updated_at' secara otomatis.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   -- 'NEW' merujuk pada baris data yang akan diubah.
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';


-- Langkah 5: Terapkan trigger ke tabel 'bus_loans'.
-- Hapus trigger yang sudah ada jika ada untuk menghindari error.
DROP TRIGGER IF EXISTS update_bus_loans_updated_at ON bus_loans;

CREATE TRIGGER update_bus_loans_updated_at
BEFORE UPDATE ON bus_loans
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- Langkah 6: Masukkan data admin default.
-- Perintah INSERT ini sudah benar dan kompatibel.
INSERT INTO users (nim, nama_mhs, prodi, fakultas, email, password, role) 
VALUES ('ADMIN001', 'Administrator', 'Sistem Informasi', 'Sains dan Teknologi', 'admin@uin-jakarta.ac.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON CONFLICT (nim) DO NOTHING; -- Menghindari error jika admin sudah ada
