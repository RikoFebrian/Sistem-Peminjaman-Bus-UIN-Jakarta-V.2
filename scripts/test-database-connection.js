// Menggunakan library 'pg' yang sudah Anda install
const { Pool } = require("pg");
require("dotenv").config({ path: ".env.local" });

async function testDatabaseConnection() {
  console.log("🔄 Testing PostgreSQL database connection...");

  // Periksa apakah DATABASE_URL sudah diatur
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL environment variable is not set!");
    console.error("   Please check your .env.local file.");
    return;
  }

  // Buat koneksi pool menggunakan DATABASE_URL
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  let client;
  try {
    // Ambil satu koneksi dari pool
    client = await pool.connect();
    console.log("✅ Database connection successful!");

    // Test queries
    const usersResult = await client.query("SELECT COUNT(*) as count FROM users");
    console.log("👤 Total users:", usersResult.rows[0].count);

    const loansResult = await client.query("SELECT COUNT(*) as count FROM bus_loans");
    console.log("🚌 Total bus loans:", loansResult.rows[0].count);

    // Gunakan kutip satu (') untuk string, ini adalah standar SQL
    const pendingLoansResult = await client.query("SELECT COUNT(*) as count FROM bus_loans WHERE status = 'pending'");
    console.log("⏳ Pending loans:", pendingLoansResult.rows[0].count);

    console.log("\n✅ Database test completed successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error("Error:", error.message);
    console.error("\n🔧 Troubleshooting tips:");
    console.error("1. Check your internet connection.");
    console.error("2. Verify the DATABASE_URL in your .env.local file is correct (use the 'Transaction Pooler' URL).");
    console.error("3. Make sure your Supabase project is active and not paused.");
    console.error("4. Check if the 'users' and 'bus_loans' tables exist in Supabase.");
  } finally {
    // Pastikan koneksi ditutup, baik berhasil maupun gagal
    if (client) {
      client.release(); // Kembalikan koneksi ke pool
    }
    await pool.end(); // Tutup semua koneksi di pool
    console.log("- Connection closed.");
  }
}

testDatabaseConnection();
