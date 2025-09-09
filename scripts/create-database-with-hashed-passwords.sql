-- Di PostgreSQL, tipe ENUM harus dibuat terlebih dahulu
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE loan_status AS ENUM ('pending', 'approved', 'rejected', 'completed');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    -- Gunakan SERIAL sebagai ganti AUTO_INCREMENT
    id SERIAL PRIMARY KEY,
    nim VARCHAR(20) UNIQUE NOT NULL,
    nama_mhs VARCHAR(100) NOT NULL,
    prodi VARCHAR(100) NOT NULL,
    fakultas VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    -- Gunakan tipe ENUM yang sudah kita buat
    role user_role DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create bus_loans table
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
    -- Kita akan menangani 'updated_at' menggunakan trigger di bawah
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Ini adalah cara PostgreSQL untuk otomatis memperbarui kolom 'updated_at'
-- 1. Buat sebuah fungsi trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. Terapkan trigger tersebut ke tabel bus_loans
CREATE TRIGGER update_bus_loans_updated_at
BEFORE UPDATE ON bus_loans
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: 'password' hashed with bcrypt)
-- Perintah INSERT ini sudah benar dan tidak perlu diubah
INSERT INTO users (nim, nama_mhs, prodi, fakultas, email, password, role)
VALUES ('ADMIN001', 'Administrator', 'Sistem Informasi', 'Sains dan Teknologi', 'admin@uin-jakarta.ac.id', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9u2', 'admin');