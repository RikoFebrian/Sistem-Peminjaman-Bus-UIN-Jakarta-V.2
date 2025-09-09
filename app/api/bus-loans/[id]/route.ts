import { type NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const loanId = Number.parseInt(params.id);
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { message: "Status harus diisi" },
        { status: 400 }
      );
    }

    // Update status dan langsung kembalikan data yang diubah dalam satu query
    const updatedLoanResult = (await executeQuery(
      "UPDATE bus_loans SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [status, loanId]
    )) as any[];

    if (updatedLoanResult.length === 0) {
      return NextResponse.json(
        { message: "Pengajuan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Status berhasil diperbarui",
      data: updatedLoanResult[0],
    });
  } catch (error) {
    console.error("Update loan status error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}