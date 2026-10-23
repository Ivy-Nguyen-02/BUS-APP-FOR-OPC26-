'use client'

import { useEffect, useState } from 'react'
import { BusFront, Camera, Clock3, LogOut, Satellite, UserRound } from 'lucide-react'
import { logoutDriver } from '@/app/tai-xe/actions'
import { SwitchRoleButton } from '@/components/switch-role-button'
import { cn } from '@/lib/utils'

function LiveClock() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const text = now
    ? now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    : '--:--:--'
  return (
    <span className="font-mono text-xl font-bold tabular-nums tracking-tight sm:text-2xl" suppressHydrationWarning>
      {text}
    </span>
  )
}

function ConnectionPill({ icon: Icon, label }: { icon: typeof Satellite; label: string }) {
  return (
    <span
      className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
      title={`${label}: kết nối ổn định`}
    >
      <span className="relative flex size-2.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
        <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
      </span>
      <Icon className="size-3.5" aria-hidden="true" />
      {label}
      <span className="sr-only">: kết nối ổn định</span>
    </span>
  )
}

export function ScheduleBadge({ deviationSeconds }: { deviationSeconds: number }) {
  const minutes = Math.round(Math.abs(deviationSeconds) / 60)
  const status = minutes === 0 ? 'on-time' : deviationSeconds > 0 ? 'late' : 'early'
  const label = status === 'on-time' ? 'Đúng giờ' : status === 'late' ? `Trễ ${minutes} phút` : `Sớm ${minutes} phút`
  return (
    <span
      className={cn(
        'flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm font-bold sm:px-3',
        status === 'on-time' && 'bg-emerald-600 text-white',
        status === 'late' && 'bg-red-600 text-white',
        status === 'early' && 'bg-amber-400 text-amber-950',
      )}
      aria-live="polite"
    >
      <Clock3 className="size-4" aria-hidden="true" />
      {label}
    </span>
  )
}

type Props = { route: string; vehicle: string; driverName: string; deviationSeconds: number }

export function StatusBar({ route, vehicle, driverName, deviationSeconds }: Props) {
  return (
    <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b bg-white px-3 py-2.5 sm:px-4">
      <div className="flex items-center gap-3">
        <span className="flex h-12 min-w-12 flex-col items-center justify-center rounded-xl bg-driver px-2 text-driver-foreground">
          <span className="text-[10px] font-semibold uppercase leading-none opacity-80">Tuyến</span>
          <span className="text-xl font-extrabold leading-tight">{route}</span>
        </span>
        <div className="leading-tight">
          <p className="flex items-center gap-1.5 text-base font-bold">
            <BusFront className="size-4 text-driver" aria-hidden="true" />
            Xe {vehicle}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <UserRound className="size-3.5" aria-hidden="true" />
            {driverName}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ConnectionPill icon={Satellite} label="GPS" />
        <ConnectionPill icon={Camera} label="Camera AI" />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <ScheduleBadge deviationSeconds={deviationSeconds} />
        <LiveClock />
        <SwitchRoleButton tone="driver" compact />
        <form action={logoutDriver}>
          <button
            type="submit"
            aria-label="Đăng xuất"
            title="Đăng xuất"
            className="flex size-10 shrink-0 items-center justify-center rounded-full border text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <LogOut className="size-4.5" aria-hidden="true" />
          </button>
        </form>
      </div>
    </header>
  )
}
