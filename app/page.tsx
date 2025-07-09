import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bus, Users, Calendar, FileText } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Bus className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">Sistem Peminjaman Bus UIN Jakarta</h1>
            </div>
            <div className="flex space-x-4">
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Daftar</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Layanan Peminjaman Bus Kampus</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sistem tiket layanan peminjaman bus kampus UIN Syarif Hidayatullah Jakarta dengan SLA 12 jam untuk
            memudahkan mahasiswa dalam mengajukan peminjaman bus.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center">
              <Bus className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <CardTitle>Peminjaman Bus</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">Ajukan peminjaman bus kampus dengan mudah dan cepat</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <CardTitle>Data Mahasiswa</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">Catat data lengkap: NIM, Nama, Prodi, Fakultas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Calendar className="h-12 w-12 text-purple-600 mx-auto mb-2" />
              <CardTitle>SLA 12 Jam</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">Waktu layanan maksimal 12 jam setelah pengajuan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <FileText className="h-12 w-12 text-orange-600 mx-auto mb-2" />
              <CardTitle>Dokumentasi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">Dokumentasi lengkap untuk setiap peminjaman</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Mulai Ajukan Peminjaman</CardTitle>
              <CardDescription>Daftar atau login untuk mengajukan peminjaman bus kampus</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Daftar Sekarang
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 UIN Syarif Hidayatullah Jakarta. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
