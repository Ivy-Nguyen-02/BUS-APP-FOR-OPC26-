'use client'

import { useState } from 'react'
import { ArrowUpDown, ChevronRight, Clock, Footprints, LocateFixed, MapPin, Ticket } from 'lucide-react'
import { RouteBadge } from './route-badge'

type Option = {
  id: string
  duration: number
  walk: number
  fare: string
  legs: string[]
  arriveNote: string
}

function buildOptions(destination: string): Option[] {
  const seed = destination.length
  return [
    { id: 'a', duration: 32 + (seed % 10), walk: 6, fare: '7.000đ', legs: ['08'], arriveNote: 'Ít đi bộ nhất' },
    { id: 'b', duration: 38 + (seed % 7), walk: 9, fare: '14.000đ', legs: ['10', '19'], arriveNote: '1 lần chuyển tuyến' },
    { id: 'c', duration: 45 + (seed % 5), walk: 4, fare: '7.000đ', legs: ['56'], arriveNote: 'Xe vắng khách' },
  ]
}

export function PlannerTab({ initialDestination }: { initialDestination: string }) {
  const [from, setFrom] = useState('Vị trí của bạn')
  const [to, setTo] = useState(initialDestination)
  const [submitted, setSubmitted] = useState(initialDestination)

  const options = submitted ? buildOptions(submitted) : []

  return (
    <div className="flex flex-col gap-5">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setSubmitted(to.trim())
        }}
        className="rounded-2xl border bg-white p-4 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-1 py-2" aria-hidden="true">
            <LocateFixed className="size-4 text-sky-600" />
            <span className="h-6 w-px border-l-2 border-dotted border-muted-foreground/40" />
            <MapPin className="size-4 text-passenger" />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <label className="sr-only" htmlFor="plan-from">
              Điểm đi
            </label>
            <input
              id="plan-from"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="h-11 rounded-xl bg-muted px-3 text-sm outline-none focus:ring-2 focus:ring-passenger/30"
            />
            <label className="sr-only" htmlFor="plan-to">
              Điểm đến
            </label>
            <input
              id="plan-to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Chọn điểm đến"
              className="h-11 rounded-xl bg-muted px-3 text-sm outline-none focus:ring-2 focus:ring-passenger/30"
            />
          </div>
          <button
            type="button"
            aria-label="Đổi điểm đi và điểm đến"
            onClick={() => {
              setFrom(to)
              setTo(from)
            }}
            className="flex size-10 items-center justify-center rounded-full border hover:border-passenger hover:text-passenger"
          >
            <ArrowUpDown className="size-4" aria-hidden="true" />
          </button>
        </div>
        <button
          type="submit"
          className="mt-4 h-11 w-full rounded-xl bg-passenger font-semibold text-passenger-foreground hover:bg-passenger/90"
        >
          Tìm đường
        </button>
      </form>

      {options.length > 0 ? (
        <section aria-labelledby="options-heading">
          <h2 id="options-heading" className="mb-3 text-lg font-bold">
            Gợi ý lộ trình đến <span className="text-passenger">{submitted}</span>
          </h2>
          <ul className="flex flex-col gap-3">
            {options.map((option, index) => (
              <li key={option.id}>
                <article className="rounded-2xl border bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Footprints className="size-4 text-muted-foreground" aria-label="Đi bộ" />
                      {option.legs.map((leg) => (
                        <span key={leg} className="flex items-center gap-1.5">
                          <ChevronRight className="size-3.5 text-muted-foreground" aria-hidden="true" />
                          <RouteBadge number={leg} />
                        </span>
                      ))}
                      <ChevronRight className="size-3.5 text-muted-foreground" aria-hidden="true" />
                      <Footprints className="size-4 text-muted-foreground" aria-label="Đi bộ" />
                    </div>
                    <p className="shrink-0 text-xl font-bold tabular-nums">
                      {option.duration}
                      <span className="ml-1 text-sm font-medium text-muted-foreground">phút</span>
                    </p>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Footprints className="size-3.5" aria-hidden="true" />
                      {option.walk} phút đi bộ
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Ticket className="size-3.5" aria-hidden="true" />
                      {option.fare}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="size-3.5" aria-hidden="true" />
                      {option.arriveNote}
                    </span>
                    {index === 0 && (
                      <span className="rounded-full bg-passenger-soft px-2 py-0.5 text-xs font-semibold text-passenger">
                        Đề xuất
                      </span>
                    )}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
          Nhập điểm đến để xem các lộ trình xe buýt phù hợp.
        </p>
      )}
    </div>
  )
}
