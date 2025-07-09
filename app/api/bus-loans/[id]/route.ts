import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const loanId = Number.parseInt(params.id)
    const body = await request.json()
    const { status } = body

    // Update the loan status
    await executeQuery("UPDATE bus_loans SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [status, loanId])

    // Get updated record
    const updatedLoan = (await executeQuery("SELECT * FROM bus_loans WHERE id = ?", [loanId])) as any[]

    if (updatedLoan.length === 0) {
      return NextResponse.json({ message: "Pengajuan tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Status berhasil diperbarui",
      data: updatedLoan[0],
    })
  } catch (error) {
    console.error("Update loan status error:", error)
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 })
  }
}
