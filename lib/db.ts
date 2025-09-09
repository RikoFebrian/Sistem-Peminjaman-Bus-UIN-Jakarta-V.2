import { Pool } from "pg";

// Deklarasikan variabel pool di luar agar bisa diakses di seluruh file
let pool: Pool;

// Periksa apakah DATABASE_URL sudah diatur. Jika tidak, hentikan aplikasi.
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not defined");
}

// Buat koneksi pool menggunakan DATABASE_URL
// Library 'pg' secara otomatis akan mem-parsing semua detail (host, user, pass, dll) dari satu URL ini.
pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Konfigurasi SSL ini PENTING untuk koneksi ke database di Vercel/Supabase
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function executeQuery(query: string, params: any[] = []) {
  try {
    const results = await pool.query(query, params);
    // Di library 'pg', hasil query ada di dalam properti 'rows'
    return results.rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

export async function closePool() {
  await pool.end();
}

export default pool;
