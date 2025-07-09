import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    const busLoans = await executeQuery(
      `SELECT * FROM bus_loans 
       ORDER BY created_at DESC`,
    )

    return NextResponse.json(busLoans)
  } catch (error) {
    console.error("Get bus loans error:", error)
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, nim, nama_mhs, prodi, fakultas, kegunaan, tanggal_pinjam, tanggal_kembali } = body

    // Validate required fields
    if (!user_id || !nim || !nama_mhs || !prodi || !fakultas || !kegunaan || !tanggal_pinjam || !tanggal_kembali) {
      return NextResponse.json({ message: "Semua field harus diisi" }, { status: 400 })
    }

    // Insert new bus loan
    const result = (await executeQuery(
      `INSERT INTO bus_loans (user_id, nim, nama_mhs, prodi, fakultas, kegunaan, tanggal_pinjam, tanggal_kembali, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [user_id, nim, nama_mhs, prodi, fakultas, kegunaan, tanggal_pinjam, tanggal_kembali],
    )) as any

    // Get the inserted record
    const newLoan = (await executeQuery("SELECT * FROM bus_loans WHERE id = ?", [result.insertId])) as any[]

    return NextResponse.json(
      {
        message: "Pengajuan peminjaman berhasil dibuat",
        data: newLoan[0],
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create bus loan error:", error)
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 })
  }
}
