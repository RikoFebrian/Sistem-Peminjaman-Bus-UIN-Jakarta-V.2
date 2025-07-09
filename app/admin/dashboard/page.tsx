"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bus, LogOut, FileText, Check, X, Clock } from "lucide-react"
import { SLACountdown } from "@/components/sla-countdown"
import { SLAAlert } from "@/components/sla-alert"

interface BusLoan {
  id: number
  user_id: number
  nim: string
  nama_mhs: string
  prodi: string
  fakultas: string
  kegunaan: string
  tanggal_pinjam: string
  tanggal_kembali: string
  status: string
  created_at: string
  updated_at: string
}

export default function AdminDashboardPage() {
  const [user, setUser] = useState<any | null>(null)
  const [busLoans, setBusLoans] = useState<BusLoan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in and is admin
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "admin") {
      router.push("/dashboard")
      return
    }

    setUser(parsedUser)
    fetchAllBusLoans()
  }, [router])

  const fetchAllBusLoans = async () => {
    try {
      const response = await fetch("/api/bus-loans")
      if (response.ok) {
        const data = await response.json()
        setBusLoans(data)
      }
    } catch (error) {
      console.error("Error fetching bus loans:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (loanId: number, newStatus: string) => {
    setProcessingId(loanId)
    try {
      const response = await fetch(`/api/bus-loans/${loanId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Refresh the data
        fetchAllBusLoans()
      }
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setProcessingId(null)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Menunggu", variant: "secondary" as const },
      approved: { label: "Disetujui", variant: "default" as const },
      rejected: { label: "Ditolak", variant: "destructive" as const },
      completed: { label: "Selesai", variant: "outline" as const },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getSLAStatus = (createdAt: string) => {
    const created = new Date(createdAt)
    const now = new Date()
    const diffHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60)

    if (diffHours > 12) {
      return <Badge variant="destructive">Melebihi SLA</Badge>
    } else if (diffHours > 8) {
      return <Badge variant="secondary">Mendekati SLA</Badge>
    }
    return <Badge variant="outline">Dalam SLA</Badge>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Bus className="h-12 w-12 text-green-600 mx-auto mb-4 animate-pulse" />
          <p>Memuat dashboard admin...</p>
        </div>
      </div>
    )
  }

  const pendingLoans = busLoans.filter((loan) => loan.status === "pending")
  const approvedLoans = busLoans.filter((loan) => loan.status === "approved")
  const completedLoans = busLoans.filter((loan) => loan.status === "completed")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Bus className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.nama_mhs}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Administrator</h2>
          <p className="text-gray-600">Kelola semua pengajuan peminjaman bus kampus di sini.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pengajuan</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{busLoans.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Menunggu Persetujuan</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingLoans.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
              <Check className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedLoans.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Selesai</CardTitle>
              <Bus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedLoans.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* SLA Alert */}
        <SLAAlert busLoans={pendingLoans} />

        {/* Pending Loans */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Pengajuan Menunggu Persetujuan</CardTitle>
            <CardDescription>Daftar pengajuan yang memerlukan tindakan segera</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingLoans.length === 0 ? (
              <div className="text-center py-8">
                <Check className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Tidak ada pengajuan yang menunggu persetujuan</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingLoans.map((loan) => (
                  <div key={loan.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{loan.nama_mhs}</h3>
                          <Badge variant="outline">{loan.nim}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Fakultas:</strong> {loan.fakultas} - {loan.prodi}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Kegunaan:</strong> {loan.kegunaan}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Periode:</strong> {new Date(loan.tanggal_pinjam).toLocaleDateString("id-ID")} -{" "}
                          {new Date(loan.tanggal_kembali).toLocaleDateString("id-ID")}
                        </p>
                        <p className="text-xs text-gray-500">
                          Diajukan:{" "}
                          {new Date(loan.created_at).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <SLACountdown createdAt={loan.created_at} status={loan.status} className="text-right" />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(loan.id, "approved")}
                            disabled={processingId === loan.id}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Setujui
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusUpdate(loan.id, "rejected")}
                            disabled={processingId === loan.id}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Tolak
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* All Loans */}
        <Card>
          <CardHeader>
            <CardTitle>Semua Pengajuan Peminjaman</CardTitle>
            <CardDescription>Riwayat lengkap semua pengajuan peminjaman bus</CardDescription>
          </CardHeader>
          <CardContent>
            {busLoans.length === 0 ? (
              <div className="text-center py-8">
                <Bus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Belum ada pengajuan peminjaman bus</p>
              </div>
            ) : (
              <div className="space-y-4">
                {busLoans.map((loan) => (
                  <div key={loan.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{loan.nama_mhs}</h3>
                          <Badge variant="outline">{loan.nim}</Badge>
                          {getStatusBadge(loan.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Fakultas:</strong> {loan.fakultas} - {loan.prodi}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Kegunaan:</strong> {loan.kegunaan}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Periode:</strong> {new Date(loan.tanggal_pinjam).toLocaleDateString("id-ID")} -{" "}
                          {new Date(loan.tanggal_kembali).toLocaleDateString("id-ID")}
                        </p>
                        <p className="text-xs text-gray-500">
                          Diajukan:{" "}
                          {new Date(loan.created_at).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <SLACountdown createdAt={loan.created_at} status={loan.status} className="text-right" />
                        {loan.status === "approved" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(loan.id, "completed")}
                            disabled={processingId === loan.id}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Selesai
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
