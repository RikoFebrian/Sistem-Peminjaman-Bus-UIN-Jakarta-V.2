import { type NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nim, nama_mhs, prodi, fakultas, email, password } = body;

    // Validate required fields
    if (!nim || !nama_mhs || !prodi || !fakultas || !email || !password) {
      return NextResponse.json(
        { message: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    // Check if user already exists
    // UBAH DI SINI: Mengganti '?' dengan '$1' dan '$2' untuk PostgreSQL
    const existingUsers = (await executeQuery(
      'SELECT id FROM users WHERE email = $1 OR nim = $2',
      [email, nim]
    )) as any[];

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { message: "Email atau NIM sudah terdaftar" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert new user
    // UBAH DI SINI: Mengganti '?' dengan placeholder '$1', '$2', dst.
    await executeQuery(
      `INSERT INTO users (nim, nama_mhs, prodi, fakultas, email, password, role) 
       VALUES ($1, $2, $3, $4, $5, $6, 'user')`,
      [nim, nama_mhs, prodi, fakultas, email, hashedPassword]
    );

    return NextResponse.json(
      { message: "Registrasi berhasil" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
