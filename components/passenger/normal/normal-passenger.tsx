'use client'

import { useMemo, useState } from 'react'
import { BusFront, Compass, Route, Star, type LucideIcon } from 'lucide-react'
import { AccessibilityToggle } from '@/components/accessibility-toggle'
import { BusMap, type MapSegment, type MapStop } from '@/components/map'
import { SwitchRoleButton } from '@/components/switch-role-button'
import { MAP_COLORS, NEARBY_STOPS, ROUTE_08_SEGMENTS, ROUTE_08_STOPS, USER_LOCATION } from '@/lib/bus-data'
import { DEFAULT_HELP_MESSAGE } from '@/lib/speech'
import { cn } from '@/lib/utils'
import { ExploreTab } from './explore-tab'
import { PlannerTab } from './planner-tab'
import { RoutesTab } from './routes-tab'

type Tab = 'explore' | 'plan' | 'routes' | 'favorites'

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: 'explore', label: 'Khám phá', icon: Compass },
  { id: 'plan', label: 'Tìm đường', icon: Route },
  { id: 'routes', label: 'Tuyến xe', icon: BusFront },
  { id: 'favorites', label: 'Yêu thích', icon: Star },
]

const NEARBY_MARKERS: MapStop[] = NEARBY_STOPS.map((s) => ({
  id: s.id,
  name: `${s.name} · ${s.waiting} người đang chờ`,
  position: s.position,
}))

export function NormalPassenger() {
  const [tab, setTab] = useState<Tab>('explore')
  const [destination, setDestination] = useState('')
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)

  const { segments, stops } = useMemo(() => {
    if (selectedRoute !== '08') return { segments: [] as MapSegment[], stops: NEARBY_MARKERS }
    return {
      segments: [{ positions: ROUTE_08_SEGMENTS.flat(), color: MAP_COLORS.passenger, weight: 6 }],
      stops: ROUTE_08_STOPS.map((s) => ({ id: s.id, name: s.name, position: s.position })),
    }
  }, [selectedRoute])

  function plan(value: string) {
    setDestination(value)
    setTab('plan')
  }

  function selectRoute(route: string) {
    setSelectedRoute(route)
    setTab('routes')
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white lg:h-dvh">
      <header className="sticky top-0 z-[1100] border-b bg-white/95 backdrop-blur">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-passenger text-passenger-foreground">
              <BusFront className="size-5" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <p className="font-extrabold tracking-tight">SmartBus</p>
              <p className="text-xs text-muted-foreground">Xin chào, hành khách</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AccessibilityToggle onEnabledMessage={`Đã bật chế độ hỗ trợ khiếm thị. ${DEFAULT_HELP_MESSAGE}`} />
            <SwitchRoleButton tone="passenger" className="hidden sm:inline-flex" />
            <SwitchRoleButton tone="passenger" className="px-3 sm:hidden [&>span]:sr-only" />
          </div>
        </div>
        <nav aria-label="Mục chính" className="hidden border-t px-4 lg:block">
          <ul className="flex gap-1">
            {TABS.map((t) => (
              <li key={t.id}>
                <TabButton tab={t} active={tab === t.id} onClick={() => setTab(t.id)} layout="top" />
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div className="flex flex-1 flex-col lg:min-h-0 lg:flex-row-reverse">
        <div className="relative h-[38vh] shrink-0 lg:h-auto lg:flex-1">
          <BusMap center={USER_LOCATION} zoom={selectedRoute === '08' ? 12 : 16} segments={segments} stops={stops} user={USER_LOCATION} />
          {selectedRoute && (
            <div className="pointer-events-none absolute left-3 top-3 z-[1000] rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow-md">
              Đang xem tuyến <span className="text-passenger">{selectedRoute}</span>
              {selectedRoute !== '08' && ' · bản đồ tuyến đang cập nhật'}
            </div>
          )}
        </div>

        <main className="flex-1 overflow-y-auto bg-muted/40 px-4 pb-28 pt-5 lg:w-[440px] lg:flex-none lg:border-r lg:pb-8">
          {tab === 'explore' && <ExploreTab onPlan={plan} onSelectRoute={selectRoute} />}
          {tab === 'plan' && <PlannerTab key={destination} initialDestination={destination} />}
          {tab === 'routes' && <RoutesTab selectedRoute={selectedRoute} onSelectRoute={setSelectedRoute} />}
          {tab === 'favorites' && (
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold">Tuyến yêu thích</h2>
              <RoutesTab selectedRoute={selectedRoute} onSelectRoute={setSelectedRoute} onlyFavorites />
            </div>
          )}
        </main>
      </div>

      <nav
        aria-label="Mục chính"
        className="fixed inset-x-0 bottom-0 z-[1100] border-t bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <ul className="grid grid-cols-4">
          {TABS.map((t) => (
            <li key={t.id}>
              <TabButton tab={t} active={tab === t.id} onClick={() => setTab(t.id)} layout="bottom" />
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

function TabButton({
  tab,
  active,
  onClick,
  layout,
}: {
  tab: (typeof TABS)[number]
  active: boolean
  onClick: () => void
  layout: 'top' | 'bottom'
}) {
  const Icon = tab.icon
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center font-medium transition-colors',
        layout === 'bottom'
          ? 'w-full flex-col gap-1 py-2.5 text-xs'
          : 'gap-2 border-b-2 px-4 py-3 text-sm',
        active
          ? layout === 'top'
            ? 'border-passenger text-passenger'
            : 'text-passenger'
          : layout === 'top'
            ? 'border-transparent text-muted-foreground hover:text-foreground'
            : 'text-muted-foreground',
      )}
    >
      <Icon className={cn('size-5', active && tab.id === 'favorites' && 'fill-passenger')} aria-hidden="true" />
      {tab.label}
    </button>
  )
}
