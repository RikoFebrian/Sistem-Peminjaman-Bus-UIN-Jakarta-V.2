import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import bcrypt from "bcryptjs"

// Mock database - in real app, use actual database
const users: any[] = [
  {
    id: 1,
    nim: "ADMIN001",
    nama_mhs: "Administrator",
    prodi: "Sistem Informasi",
    fakultas: "Sains dan Teknologi",
    email: "admin@uin-jakarta.ac.id",
    password: "password", // In real app, this should be hashed
    role: "admin",
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nim, nama_mhs, prodi, fakultas, email, password } = body

    // Validate required fields
    if (!nim || !nama_mhs || !prodi || !fakultas || !email || !password) {
      return NextResponse.json({ message: "Semua field harus diisi" }, { status: 400 })
    }

    // Check if user already exists
    const existingUsers = (await executeQuery("SELECT id FROM users WHERE email = ? OR nim = ?", [email, nim])) as any[]

    if (existingUsers.length > 0) {
      return NextResponse.json({ message: "Email atau NIM sudah terdaftar" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Insert new user
    await executeQuery(
      `INSERT INTO users (nim, nama_mhs, prodi, fakultas, email, password, role) 
       VALUES (?, ?, ?, ?, ?, ?, 'user')`,
      [nim, nama_mhs, prodi, fakultas, email, hashedPassword],
    )

    return NextResponse.json({ message: "Registrasi berhasil" }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 })
  }
}
