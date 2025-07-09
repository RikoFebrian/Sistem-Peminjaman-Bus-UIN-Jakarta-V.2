"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bus, Plus, LogOut, Calendar, FileText } from "lucide-react"
import Link from "next/link"
import { SLACountdown } from "@/components/sla-countdown"

interface BusLoan {
  id: number
  nim: string
  nama_mhs: string
  prodi: string
  fakultas: string
  kegunaan: string
  tanggal_pinjam: string
  tanggal_kembali: string
  status: string
  created_at: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<any | null>(null)
  const [busLoans, setBusLoans] = useState<BusLoan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // Fetch user's bus loans
    fetchBusLoans(parsedUser.id)
  }, [router])

  const fetchBusLoans = async (userId: number) => {
    try {
      const response = await fetch(`/api/bus-loans/user/${userId}`)
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Bus className="h-12 w-12 text-green-600 mx-auto mb-4 animate-pulse" />
          <p>Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Bus className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Mahasiswa</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.nama_mhs}</p>
                <p className="text-xs text-gray-500">{user?.nim}</p>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Selamat datang, {user?.nama_mhs}!</h2>
          <p className="text-gray-600">Kelola pengajuan peminjaman bus kampus Anda di sini.</p>
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
              <CardTitle className="text-sm font-medium">Menunggu</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{busLoans.filter((loan) => loan.status === "pending").length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
              <Bus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{busLoans.filter((loan) => loan.status === "approved").length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Selesai</CardTitle>
              <Bus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{busLoans.filter((loan) => loan.status === "completed").length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div className="mb-8">
          <Link href="/dashboard/new-loan">
            <Button size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Ajukan Peminjaman Bus
            </Button>
          </Link>
        </div>

        {/* Bus Loans List */}
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Pengajuan Peminjaman</CardTitle>
            <CardDescription>Daftar semua pengajuan peminjaman bus yang pernah Anda buat</CardDescription>
          </CardHeader>
          <CardContent>
            {busLoans.length === 0 ? (
              <div className="text-center py-8">
                <Bus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Belum ada pengajuan peminjaman bus</p>
                <Link href="/dashboard/new-loan">
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Buat Pengajuan Pertama
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {busLoans.map((loan) => (
                  <div key={loan.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold">{loan.kegunaan}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(loan.tanggal_pinjam).toLocaleDateString("id-ID")} -{" "}
                          {new Date(loan.tanggal_kembali).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(loan.status)}
                        <SLACountdown createdAt={loan.created_at} status={loan.status} className="text-right" />
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Diajukan pada:{" "}
                      {new Date(loan.created_at).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
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
