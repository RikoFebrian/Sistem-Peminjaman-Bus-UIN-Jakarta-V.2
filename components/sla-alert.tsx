"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface BusLoan {
  id: number
  created_at: string
  status: string
  nama_mhs: string
}

interface SLAAlertProps {
  busLoans: BusLoan[]
}

export function SLAAlert({ busLoans }: SLAAlertProps) {
  const [criticalLoans, setCriticalLoans] = useState<BusLoan[]>([])

  useEffect(() => {
    const checkCriticalLoans = () => {
      const now = new Date()
      const critical = busLoans.filter((loan) => {
        if (loan.status !== "pending") return false

        const created = new Date(loan.created_at)
        const slaDeadline = new Date(created.getTime() + 12 * 60 * 60 * 1000)
        const timeRemaining = slaDeadline.getTime() - now.getTime()

        // Critical if less than 2 hours remaining or already expired
        return timeRemaining <= 2 * 60 * 60 * 1000
      })

      setCriticalLoans(critical)
    }

    checkCriticalLoans()
    const interval = setInterval(checkCriticalLoans, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [busLoans])

  if (criticalLoans.length === 0) {
    return null
  }

  const expiredLoans = criticalLoans.filter((loan) => {
    const created = new Date(loan.created_at)
    const slaDeadline = new Date(created.getTime() + 12 * 60 * 60 * 1000)
    return new Date() > slaDeadline
  })

  const urgentLoans = criticalLoans.filter((loan) => {
    const created = new Date(loan.created_at)
    const slaDeadline = new Date(created.getTime() + 12 * 60 * 60 * 1000)
    const now = new Date()
    return now <= slaDeadline
  })

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-1">
          {expiredLoans.length > 0 && (
            <p>
              <strong>🚨 {expiredLoans.length} pengajuan telah melebihi SLA 12 jam!</strong>
            </p>
          )}
          {urgentLoans.length > 0 && (
            <p>
              <strong>⚠️ {urgentLoans.length} pengajuan akan segera melebihi SLA (kurang dari 2 jam)!</strong>
            </p>
          )}
          <p className="text-sm mt-2">Pengajuan yang kritis: {criticalLoans.map((loan) => loan.nama_mhs).join(", ")}</p>
        </div>
      </AlertDescription>
    </Alert>
  )
}
