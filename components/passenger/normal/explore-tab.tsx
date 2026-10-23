'use client'

import { Briefcase, GraduationCap, House, MapPin, Search, Users } from 'lucide-react'
import { NEARBY_STOPS } from '@/lib/bus-data'
import { cn } from '@/lib/utils'
import { RouteBadge } from './route-badge'

const QUICK_PLACES = [
  { label: 'Nhà', icon: House, destination: 'Nhà – Bến xe Quận 8' },
  { label: 'Trường học', icon: GraduationCap, destination: 'ĐH Quốc gia' },
  { label: 'Công ty', icon: Briefcase, destination: 'Ngã tư Hàng Xanh' },
]

const CROWD_STYLE = {
  Vắng: 'bg-passenger-soft text-passenger',
  Vừa: 'bg-amber-50 text-amber-700',
  Đông: 'bg-red-50 text-red-700',
} as const

type Props = {
  onPlan: (destination: string) => void
  onSelectRoute: (route: string) => void
}

export function ExploreTab({ onPlan, onSelectRoute }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const value = new FormData(e.currentTarget).get('q')?.toString() ?? ''
          onPlan(value)
        }}
        className="flex items-center gap-2 rounded-2xl border bg-white p-1.5 pl-4 shadow-sm focus-within:border-passenger focus-within:ring-2 focus-within:ring-passenger/20"
      >
        <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <label htmlFor="explore-search" className="sr-only">
          Bạn muốn đi đâu?
        </label>
        <input
          id="explore-search"
          name="q"
          placeholder="Bạn muốn đi đâu?"
          className="h-10 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className="h-10 rounded-xl bg-passenger px-4 text-sm font-semibold text-passenger-foreground hover:bg-passenger/90"
        >
          Tìm
        </button>
      </form>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {QUICK_PLACES.map((place) => (
          <button
            key={place.label}
            type="button"
            onClick={() => onPlan(place.destination)}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-medium hover:border-passenger hover:text-passenger"
          >
            <place.icon className="size-4 text-passenger" aria-hidden="true" />
            {place.label}
          </button>
        ))}
      </div>

      <section aria-labelledby="nearby-heading">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="nearby-heading" className="text-lg font-bold">
            Trạm gần bạn
          </h2>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-passenger">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-passenger opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-passenger" />
            </span>
            Cập nhật trực tiếp
          </span>
        </div>
        <ul className="flex flex-col gap-3">
          {NEARBY_STOPS.map((stop) => (
            <li key={stop.id} className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-passenger-soft text-passenger">
                    <MapPin className="size-4" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-semibold">{stop.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {stop.street} · {stop.distance}
                    </p>
                  </div>
                </div>
                <span
                  className="inline-flex shrink-0 items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                  title="Số người đang chờ (Camera AI)"
                >
                  <Users className="size-3.5" aria-hidden="true" />
                  {stop.waiting} đang chờ
                </span>
              </div>
              <ul className="mt-3 flex flex-col divide-y rounded-xl bg-muted/60">
                {stop.arrivals.map((arrival) => (
                  <li key={arrival.route}>
                    <button
                      type="button"
                      onClick={() => onSelectRoute(arrival.route)}
                      className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-muted"
                    >
                      <span className="flex items-center gap-3">
                        <RouteBadge number={arrival.route} />
                        <span
                          className={cn(
                            'rounded-full px-2 py-0.5 text-xs font-medium',
                            CROWD_STYLE[arrival.crowd],
                          )}
                        >
                          {arrival.crowd}
                        </span>
                      </span>
                      <span className="text-right">
                        <span className="text-lg font-bold text-passenger tabular-nums">{arrival.minutes}</span>
                        <span className="ml-1 text-sm text-muted-foreground">phút</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
