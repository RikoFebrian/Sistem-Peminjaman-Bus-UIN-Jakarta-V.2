import { type NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = Number.parseInt(params.userId);

    // UBAH DI SINI: Mengganti '?' dengan '$1' untuk PostgreSQL
    const userLoans = await executeQuery(
      `SELECT * FROM bus_loans 
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    return NextResponse.json(userLoans);
  } catch (error) {
    console.error("Get user loans error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
