"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bus, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface User {
  id: number
  nim: string
  nama_mhs: string
  prodi: string
  fakultas: string
  email: string
  role: string
}

export default function NewLoanPage() {
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    kegunaan: "",
    tanggal_pinjam: "",
    tanggal_kembali: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
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
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (!user) {
      setError("User tidak ditemukan")
      setIsLoading(false)
      return
    }

    // Validate dates
    const pinjamDate = new Date(formData.tanggal_pinjam)
    const kembaliDate = new Date(formData.tanggal_kembali)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (pinjamDate < today) {
      setError("Tanggal peminjaman tidak boleh kurang dari hari ini")
      setIsLoading(false)
      return
    }

    if (kembaliDate <= pinjamDate) {
      setError("Tanggal pengembalian harus setelah tanggal peminjaman")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/bus-loans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          nim: user.nim,
          nama_mhs: user.nama_mhs,
          prodi: user.prodi,
          fakultas: user.fakultas,
          kegunaan: formData.kegunaan,
          tanggal_pinjam: formData.tanggal_pinjam,
          tanggal_kembali: formData.tanggal_kembali,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Pengajuan peminjaman bus berhasil dibuat!")
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else {
        setError(data.message || "Gagal membuat pengajuan")
      }
    } catch (error) {
      setError("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Bus className="h-12 w-12 text-green-600 mx-auto mb-4 animate-pulse" />
          <p>Memuat...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Pengajuan Peminjaman Bus</h1>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Form Pengajuan Peminjaman Bus</CardTitle>
            <CardDescription>Isi form berikut untuk mengajukan peminjaman bus kampus</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* User Info (Read-only) */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>NIM</Label>
                  <Input value={user.nim} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Nama Mahasiswa</Label>
                  <Input value={user.nama_mhs} disabled />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Program Studi</Label>
                  <Input value={user.prodi} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Fakultas</Label>
                  <Input value={user.fakultas} disabled />
                </div>
              </div>

              {/* Loan Details */}
              <div className="space-y-2">
                <Label htmlFor="kegunaan">Kegunaan/Tujuan Peminjaman *</Label>
                <Textarea
                  id="kegunaan"
                  name="kegunaan"
                  placeholder="Jelaskan tujuan dan kegunaan peminjaman bus (contoh: Kunjungan lapangan mata kuliah Sistem Informasi ke PT. ABC)"
                  value={formData.kegunaan}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tanggal_pinjam">Tanggal Peminjaman *</Label>
                  <Input
                    id="tanggal_pinjam"
                    name="tanggal_pinjam"
                    type="date"
                    value={formData.tanggal_pinjam}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tanggal_kembali">Tanggal Pengembalian *</Label>
                  <Input
                    id="tanggal_kembali"
                    name="tanggal_kembali"
                    type="date"
                    value={formData.tanggal_kembali}
                    onChange={handleChange}
                    min={formData.tanggal_pinjam || new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
              </div>

              {/* SLA Information */}
              <Alert>
                <AlertDescription>
                  <strong>Informasi SLA:</strong> Pengajuan akan diproses maksimal dalam 12 jam kerja. Anda akan
                  mendapat notifikasi melalui email setelah pengajuan disetujui atau ditolak.
                </AlertDescription>
              </Alert>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Memproses..." : "Ajukan Peminjaman"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
