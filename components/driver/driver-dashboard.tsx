'use client'

import { useMemo } from 'react'
import { Gauge } from 'lucide-react'
import { BusMap, type MapStop } from '@/components/map'
import type { DriverProfile } from '@/lib/driver-auth'
import { useTripSimulation, type TrafficLevel } from '@/lib/use-trip-simulation'
import { cn } from '@/lib/utils'
import { QuickActions } from './quick-actions'
import { StatusBar } from './status-bar'
import { StopAssistant } from './stop-assistant'

const TRAFFIC_LABEL: Record<TrafficLevel, string> = { free: 'Thông thoáng', busy: 'Đông xe', jam: 'Ùn tắc' }
const TRAFFIC_DOT: Record<TrafficLevel, string> = { free: 'bg-traffic-free', busy: 'bg-traffic-busy', jam: 'bg-traffic-jam' }

export function DriverDashboard({ driver }: { driver: DriverProfile }) {
  const sim = useTripSimulation()

  const mapStops: MapStop[] = useMemo(
    () =>
      sim.stops.map((s) => ({
        id: s.id,
        name: s.passed ? s.name : `${s.name} · ${s.waiting} người chờ`,
        position: s.position,
        badge: s.passed ? undefined : String(s.waiting),
        tone: s.passed ? 'muted' : 'driver',
        highlight: s.id === sim.nextStop.id,
      })),
    // Recompute only when the visible stop data changes, not on every movement tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sim.nextStop.id, sim.stops.map((s) => `${s.id}${s.waiting}${s.passed}`).join()],
  )

  return (
    <div className="flex min-h-dvh flex-col bg-muted/40 lg:h-dvh">
      <StatusBar
        route={driver.route}
        vehicle={driver.vehicle}
        driverName={driver.displayName}
        deviationSeconds={sim.deviationSeconds}
      />

      <main className="flex flex-1 flex-col gap-3 p-3 lg:min-h-0 lg:flex-row">
        <section aria-label="Bản đồ lộ trình thông minh" className="flex flex-col gap-3 lg:min-h-0 lg:flex-1">
          <div className="relative h-[55dvh] overflow-hidden rounded-2xl border bg-white lg:h-auto lg:flex-1">
            <BusMap
              center={sim.position}
              zoom={15}
              segments={sim.segments}
              stops={mapStops}
              bus={{ position: sim.position, label: driver.route }}
              radiusMeters={1500}
              follow={sim.position}
            />

            <div className="pointer-events-none absolute right-3 top-3 z-[400] flex flex-col items-end gap-2">
              <div className="pointer-events-auto rounded-xl bg-white/95 p-3 shadow-md backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Giao thông phía trước</p>
                <p className="mt-1 flex items-center gap-2 text-lg font-extrabold">
                  <span className={cn('size-3 rounded-full', TRAFFIC_DOT[sim.levelAtBus])} aria-hidden="true" />
                  {TRAFFIC_LABEL[sim.levelAtBus]}
                </p>
                <div className="mt-2 flex gap-1" aria-hidden="true">
                  {sim.trafficAhead.map((level, i) => (
                    <span key={i} className={cn('h-1.5 w-8 rounded-full', TRAFFIC_DOT[level])} />
                  ))}
                </div>
              </div>
              <div className="pointer-events-auto flex items-center gap-2 self-start rounded-xl bg-white/95 px-3 py-2 shadow-md backdrop-blur">
                <Gauge className="size-5 text-driver" aria-hidden="true" />
                <span className="text-lg font-extrabold tabular-nums">{sim.speedKmh}</span>
                <span className="text-xs text-muted-foreground">km/h</span>
              </div>
            </div>

            <ul className="absolute bottom-3 left-3 z-[400] flex flex-wrap gap-x-3 gap-y-1 rounded-xl bg-white/95 px-3 py-2 text-xs font-semibold shadow-md backdrop-blur">
              {(['free', 'busy', 'jam'] as const).map((level) => (
                <li key={level} className="flex items-center gap-1.5">
                  <span className={cn('h-1.5 w-5 rounded-full', TRAFFIC_DOT[level])} aria-hidden="true" />
                  {TRAFFIC_LABEL[level]}
                </li>
              ))}
              <li className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-3 rounded-full border-2 border-dashed border-driver" aria-hidden="true" />
                Bán kính 1,5 km
              </li>
            </ul>
          </div>

          <QuickActions position={sim.position} />
        </section>

        <aside className="lg:w-[380px] lg:overflow-y-auto">
          <StopAssistant nextStop={sim.nextStop} stops={sim.stops} />
        </aside>
      </main>
    </div>
  )
}
