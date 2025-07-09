-- Create database for bus loan system
CREATE DATABASE IF NOT EXISTS bus_loan_system;
USE bus_loan_system;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nim VARCHAR(20) UNIQUE NOT NULL,
    nama_mhs VARCHAR(100) NOT NULL,
    prodi VARCHAR(100) NOT NULL,
    fakultas VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bus_loans table
CREATE TABLE IF NOT EXISTS bus_loans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    nim VARCHAR(20) NOT NULL,
    nama_mhs VARCHAR(100) NOT NULL,
    prodi VARCHAR(100) NOT NULL,
    fakultas VARCHAR(100) NOT NULL,
    kegunaan TEXT NOT NULL,
    tanggal_pinjam DATE NOT NULL,
    tanggal_kembali DATE NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default admin user (password: 'password' hashed with bcrypt)
INSERT INTO users (nim, nama_mhs, prodi, fakultas, email, password, role) 
VALUES ('ADMIN001', 'Administrator', 'Sistem Informasi', 'Sains dan Teknologi', 'admin@uin-jakarta.ac.id', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9u2', 'admin');
