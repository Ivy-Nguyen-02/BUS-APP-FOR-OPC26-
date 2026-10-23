'use client'

import { useState } from 'react'
import { Clock, Search, Star, Ticket, Timer } from 'lucide-react'
import { BUS_ROUTES, type BusRoute } from '@/lib/bus-data'
import { useFavoriteRoutes } from '@/lib/persistent-store'
import { cn } from '@/lib/utils'
import { RouteBadge } from './route-badge'

type Props = {
  selectedRoute: string | null
  onSelectRoute: (route: string) => void
  onlyFavorites?: boolean
}

export function RoutesTab({ selectedRoute, onSelectRoute, onlyFavorites }: Props) {
  const [query, setQuery] = useState('')
  const [favorites, setFavorites] = useFavoriteRoutes()

  const normalized = query.trim().toLowerCase()
  const routes = BUS_ROUTES.filter((route) => {
    if (onlyFavorites && !favorites.includes(route.number)) return false
    if (!normalized) return true
    return route.number.includes(normalized) || route.name.toLowerCase().includes(normalized)
  })

  function toggleFavorite(route: BusRoute) {
    setFavorites(
      favorites.includes(route.number)
        ? favorites.filter((n) => n !== route.number)
        : [...favorites, route.number],
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {!onlyFavorites && (
        <div className="flex items-center gap-2 rounded-2xl border bg-white px-4 shadow-sm focus-within:border-passenger focus-within:ring-2 focus-within:ring-passenger/20">
          <Search className="size-5 text-muted-foreground" aria-hidden="true" />
          <label htmlFor="route-search" className="sr-only">
            Tìm tuyến xe
          </label>
          <input
            id="route-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm số tuyến hoặc tên tuyến"
            className="h-12 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      )}

      {routes.length === 0 ? (
        <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
          {onlyFavorites
            ? 'Bạn chưa có tuyến yêu thích. Nhấn biểu tượng ngôi sao ở mục Tuyến xe để lưu.'
            : 'Không tìm thấy tuyến phù hợp.'}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {routes.map((route) => {
            const isFavorite = favorites.includes(route.number)
            const isSelected = selectedRoute === route.number
            return (
              <li
                key={route.number}
                className={cn(
                  'flex items-stretch gap-2 rounded-2xl border bg-white shadow-sm transition-colors',
                  isSelected && 'border-passenger ring-2 ring-passenger/20',
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelectRoute(route.number)}
                  aria-pressed={isSelected}
                  className="flex flex-1 items-start gap-3 p-4 text-left"
                >
                  <RouteBadge number={route.number} className="h-9 min-w-12 text-base" />
                  <span className="flex flex-col gap-1.5">
                    <span className="font-semibold leading-snug">{route.name}</span>
                    <span className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3.5" aria-hidden="true" />
                        {route.hours}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Timer className="size-3.5" aria-hidden="true" />
                        {route.frequency}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Ticket className="size-3.5" aria-hidden="true" />
                        {route.fare}
                      </span>
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleFavorite(route)}
                  aria-pressed={isFavorite}
                  aria-label={isFavorite ? `Bỏ yêu thích tuyến ${route.number}` : `Yêu thích tuyến ${route.number}`}
                  className="flex w-12 items-center justify-center rounded-r-2xl hover:bg-muted"
                >
                  <Star
                    className={cn('size-5', isFavorite ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground')}
                    aria-hidden="true"
                  />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
