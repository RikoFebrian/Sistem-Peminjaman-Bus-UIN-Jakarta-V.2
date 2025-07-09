"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertTriangle } from "lucide-react"

interface SLACountdownProps {
  createdAt: string
  status: string
  className?: string
}

interface TimeRemaining {
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
  totalMinutes: number
}

export function SLACountdown({ createdAt, status, className = "" }: SLACountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
    totalMinutes: 0,
  })

  const calculateTimeRemaining = (): TimeRemaining => {
    const created = new Date(createdAt)
    const now = new Date()
    const slaDeadline = new Date(created.getTime() + 12 * 60 * 60 * 1000) // 12 hours in milliseconds
    const timeDiff = slaDeadline.getTime() - now.getTime()

    if (timeDiff <= 0) {
      return {
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
        totalMinutes: 0,
      }
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60))
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)
    const totalMinutes = Math.floor(timeDiff / (1000 * 60))

    return {
      hours,
      minutes,
      seconds,
      isExpired: false,
      totalMinutes,
    }
  }

  useEffect(() => {
    // Only show countdown for pending status
    if (status !== "pending") {
      return
    }

    const updateTimer = () => {
      setTimeRemaining(calculateTimeRemaining())
    }

    // Update immediately
    updateTimer()

    // Update every second
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [createdAt, status])

  // Don't show countdown if not pending
  if (status !== "pending") {
    return null
  }

  const getBadgeVariant = () => {
    if (timeRemaining.isExpired) {
      return "destructive"
    } else if (timeRemaining.totalMinutes <= 120) {
      // Less than 2 hours remaining
      return "destructive"
    } else if (timeRemaining.totalMinutes <= 240) {
      // Less than 4 hours remaining
      return "secondary"
    }
    return "outline"
  }

  const getBadgeText = () => {
    if (timeRemaining.isExpired) {
      return "SLA Terlewati"
    }
    return "SLA Berakhir"
  }

  const getIcon = () => {
    if (timeRemaining.isExpired || timeRemaining.totalMinutes <= 120) {
      return <AlertTriangle className="h-3 w-3" />
    }
    return <Clock className="h-3 w-3" />
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <Badge variant={getBadgeVariant()} className="flex items-center gap-1 w-fit">
        {getIcon()}
        {getBadgeText()}
      </Badge>
      <div className="text-sm font-mono">
        {timeRemaining.isExpired ? (
          <span className="text-red-600 font-semibold">Melebihi SLA</span>
        ) : (
          <span className={timeRemaining.totalMinutes <= 120 ? "text-red-600 font-semibold" : "text-gray-600"}>
            {String(timeRemaining.hours).padStart(2, "0")}:{String(timeRemaining.minutes).padStart(2, "0")}:
            {String(timeRemaining.seconds).padStart(2, "0")}
          </span>
        )}
      </div>
      {!timeRemaining.isExpired && (
        <div className="text-xs text-gray-500">
          {timeRemaining.totalMinutes > 60
            ? `${Math.floor(timeRemaining.totalMinutes / 60)} jam ${timeRemaining.totalMinutes % 60} menit tersisa`
            : `${timeRemaining.totalMinutes} menit tersisa`}
        </div>
      )}
    </div>
  )
}
