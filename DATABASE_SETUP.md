# Panduan Setup Database phpMyAdmin

## 1. Persiapan Environment

### Install Dependencies
\`\`\`bash
npm install mysql2 bcryptjs
npm install --save-dev @types/bcryptjs
\`\`\`

### Setup Environment Variables
Buat file `.env.local` di root project dengan konfigurasi berikut:

\`\`\`env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=bus_loan_system
DB_PORT=3306

# Next.js Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
\`\`\`

## 2. Setup Database di phpMyAdmin

### Langkah 1: Buka phpMyAdmin
- Buka browser dan akses `http://localhost/phpmyadmin`
- Login dengan username `root` dan password MySQL Anda

### Langkah 2: Buat Database
1. Klik tab "Databases"
2. Masukkan nama database: `bus_loan_system`
3. Klik "Create"

### Langkah 3: Import SQL Schema
1. Pilih database `bus_loan_system`
2. Klik tab "SQL"
3. Copy-paste script SQL dari file `scripts/create-database-with-hashed-passwords.sql`
4. Klik "Go" untuk menjalankan

### Langkah 4: Verifikasi Tabel
Pastikan tabel berikut sudah terbuat:
- `users` (dengan admin default)
- `bus_loans`

## 3. Konfigurasi Aplikasi

### Update package.json
Pastikan dependencies berikut ada:
\`\`\`json
{
  "dependencies": {
    "mysql2": "^3.6.0",
    "bcryptjs": "^2.4.3"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.2"
  }
}
\`\`\`

### Test Koneksi Database
Buat file test untuk memastikan koneksi berhasil:

\`\`\`javascript
// test-db-connection.js
const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'your_password',
      database: 'bus_loan_system'
    });
    
    console.log('✅ Database connection successful!');
    
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM users');
    console.log('👤 Users in database:', rows[0].count);
    
    await connection.end();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

testConnection();
\`\`\`

## 4. Login Credentials

### Admin Login
- Email: `admin@uin-jakarta.ac.id`
- Password: `password`

### Test User (setelah registrasi)
- Daftar melalui halaman `/register`
- Login melalui halaman `/login`

## 5. Troubleshooting

### Error: "Access denied for user"
- Pastikan username dan password MySQL benar
- Cek apakah MySQL service berjalan

### Error: "Database does not exist"
- Pastikan database `bus_loan_system` sudah dibuat
- Jalankan script SQL untuk membuat tabel

### Error: "Connection refused"
- Pastikan MySQL server berjalan
- Cek port MySQL (default: 3306)

### Error: "Table doesn't exist"
- Jalankan script SQL untuk membuat tabel
- Pastikan berada di database yang benar

## 6. Monitoring Database

### Melihat Data di phpMyAdmin
1. Pilih database `bus_loan_system`
2. Klik tabel yang ingin dilihat (`users` atau `bus_loans`)
3. Klik tab "Browse" untuk melihat data

### Query Berguna
\`\`\`sql
-- Lihat semua users
SELECT * FROM users;

-- Lihat semua pengajuan bus
SELECT * FROM bus_loans ORDER BY created_at DESC;

-- Lihat pengajuan pending
SELECT * FROM bus_loans WHERE status = 'pending';

-- Reset password admin (jika lupa)
UPDATE users SET password = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9u2' WHERE email = 'admin@uin-jakarta.ac.id';
