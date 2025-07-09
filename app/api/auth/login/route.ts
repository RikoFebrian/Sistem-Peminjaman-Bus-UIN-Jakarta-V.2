import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ message: "Email dan password harus diisi" }, { status: 400 })
    }

    // Find user
    const users = (await executeQuery("SELECT * FROM users WHERE email = ?", [email])) as any[]

    if (users.length === 0) {
      return NextResponse.json({ message: "Email atau password salah" }, { status: 401 })
    }

    const user = users[0]

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Email atau password salah" }, { status: 401 })
    }

    // Return user data (exclude password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: "Login berhasil",
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 })
  }
}
