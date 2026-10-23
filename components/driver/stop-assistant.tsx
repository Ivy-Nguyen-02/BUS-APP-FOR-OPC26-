'use client'

import { Camera, Eye, MapPin, UsersRound } from 'lucide-react'
import { cn } from '@/lib/utils'

export type DriverStop = {
  id: string
  name: string
  order: number
  passed: boolean
  meters: number
  etaMin: number
  waiting: number
  assisted: boolean
}

function formatDistance(m: number) {
  return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m / 10) * 10} m`
}

function crowdTone(n: number) {
  if (n >= 10) return 'bg-red-600 text-white'
  if (n >= 5) return 'bg-amber-400 text-amber-950'
  return 'bg-emerald-600 text-white'
}

export function StopAssistant({ nextStop, stops }: { nextStop: DriverStop; stops: DriverStop[] }) {
  const upcoming = stops.filter((s) => !s.passed && s.id !== nextStop.id).slice(0, 4)

  return (
    <section aria-labelledby="stop-assistant-title" className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-2xl border-2 border-driver bg-white shadow-sm">
        <div className="flex items-center justify-between bg-driver px-4 py-2 text-driver-foreground">
          <h2 id="stop-assistant-title" className="text-sm font-bold uppercase tracking-wide">
            Trạm kế tiếp
          </h2>
          <span className="flex items-center gap-1.5 text-xs font-semibold">
            <Camera className="size-3.5" aria-hidden="true" />
            AI Stop Assistant
          </span>
        </div>
        <div className="p-4">
          <p className="flex items-start gap-2 text-2xl font-extrabold leading-tight text-balance">
            <MapPin className="mt-1 size-6 shrink-0 text-driver" aria-hidden="true" />
            {nextStop.name}
          </p>
          <p className="mt-1 pl-8 text-sm text-muted-foreground">
            Còn {formatDistance(nextStop.meters)} · khoảng {nextStop.etaMin} phút
          </p>

          <div className={cn('mt-4 flex items-center gap-4 rounded-xl p-4', crowdTone(nextStop.waiting))} aria-live="polite">
            <UsersRound className="size-12 shrink-0" strokeWidth={2.2} aria-hidden="true" />
            <div className="leading-tight">
              <p className="text-5xl font-extrabold tabular-nums">{nextStop.waiting}</p>
              <p className="text-sm font-semibold">người đang chờ tại trạm</p>
            </div>
          </div>
          {nextStop.assisted && (
            <p
              role="status"
              className="mt-3 flex items-center gap-2 rounded-xl bg-orange-100 px-4 py-3 text-sm font-bold text-orange-900"
            >
              <Eye className="size-5 shrink-0" aria-hidden="true" />
              Có hành khách khiếm thị cần hỗ trợ lên xe
            </p>
          )}
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" />
            Camera AI đếm người · cập nhật trực tiếp
          </p>
        </div>
      </div>

      <div className="rounded-2xl border bg-white">
        <h3 className="border-b px-4 py-2.5 text-sm font-bold">Các trạm tiếp theo</h3>
        <ul className="divide-y">
          {upcoming.map((stop) => (
            <li key={stop.id} className="flex items-center gap-3 px-4 py-2.5">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-driver/10 text-xs font-bold text-driver">
                {stop.order + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{stop.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistance(stop.meters)} · {stop.etaMin} phút
                </p>
              </div>
              {stop.assisted && (
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-900">
                  <Eye className="size-4" aria-hidden="true" />
                  <span className="sr-only">Có hành khách khiếm thị cần hỗ trợ</span>
                </span>
              )}
              <span
                className={cn('flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-bold tabular-nums', crowdTone(stop.waiting))}
                aria-label={`${stop.waiting} người đang chờ`}
              >
                <UsersRound className="size-4" aria-hidden="true" />
                {stop.waiting}
              </span>
            </li>
          ))}
          {upcoming.length === 0 && <li className="px-4 py-3 text-sm text-muted-foreground">Đây là trạm cuối.</li>}
        </ul>
      </div>
    </section>
  )
}
