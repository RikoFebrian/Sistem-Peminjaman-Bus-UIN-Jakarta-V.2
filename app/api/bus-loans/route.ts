import { type NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function GET() {
  try {
    // Query ini tidak memiliki parameter, jadi sudah benar.
    const busLoans = await executeQuery(
      `SELECT * FROM bus_loans 
       ORDER BY created_at DESC`
    );

    return NextResponse.json(busLoans);
  } catch (error) {
    console.error("Get bus loans error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      user_id,
      nim,
      nama_mhs,
      prodi,
      fakultas,
      kegunaan,
      tanggal_pinjam,
      tanggal_kembali,
    } = body;

    // Validate required fields
    if (
      !user_id ||
      !nim ||
      !nama_mhs ||
      !prodi ||
      !fakultas ||
      !kegunaan ||
      !tanggal_pinjam ||
      !tanggal_kembali
    ) {
      return NextResponse.json(
        { message: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    // Insert new bus loan and get the newly inserted row back in one query
    // UBAH DI SINI:
    // 1. Mengganti '?' dengan '$1', '$2', dst.
    // 2. Menggunakan 'RETURNING *' untuk mendapatkan data baru secara efisien.
    const newLoanResult = (await executeQuery(
      `INSERT INTO bus_loans (user_id, nim, nama_mhs, prodi, fakultas, kegunaan, tanggal_pinjam, tanggal_kembali, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
       RETURNING *`,
      [
        user_id,
        nim,
        nama_mhs,
        prodi,
        fakultas,
        kegunaan,
        tanggal_pinjam,
        tanggal_kembali,
      ]
    )) as any[];

    // Karena kita menggunakan 'RETURNING *', kita tidak perlu query kedua.
    const newLoan = newLoanResult[0];

    return NextResponse.json(
      {
        message: "Pengajuan peminjaman berhasil dibuat",
        data: newLoan,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create bus loan error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
