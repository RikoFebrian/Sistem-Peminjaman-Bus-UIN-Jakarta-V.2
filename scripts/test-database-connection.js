const mysql = require("mysql2/promise")
require("dotenv").config({ path: ".env.local" })

async function testDatabaseConnection() {
  console.log("🔄 Testing database connection...")

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "bus_loan_system",
      port: Number.parseInt(process.env.DB_PORT) || 3306,
    })

    console.log("✅ Database connection successful!")

    // Test queries
    const [users] = await connection.execute("SELECT COUNT(*) as count FROM users")
    console.log("👤 Total users:", users[0].count)

    const [loans] = await connection.execute("SELECT COUNT(*) as count FROM bus_loans")
    console.log("🚌 Total bus loans:", loans[0].count)

    const [pendingLoans] = await connection.execute('SELECT COUNT(*) as count FROM bus_loans WHERE status = "pending"')
    console.log("⏳ Pending loans:", pendingLoans[0].count)

    await connection.end()
    console.log("✅ Database test completed successfully!")
  } catch (error) {
    console.error("❌ Database connection failed:")
    console.error("Error:", error.message)
    console.error("\n🔧 Troubleshooting tips:")
    console.error("1. Make sure MySQL server is running")
    console.error("2. Check your .env.local file configuration")
    console.error("3. Verify database and tables exist")
    console.error("4. Check username/password credentials")
  }
}

testDatabaseConnection()
