'use client'

import { ArrowLeftRight, BusFront, Footprints, MapPinCheck, type LucideIcon } from 'lucide-react'
import { tripToSpeech, type GuideStep, type Trip } from '@/lib/bus-data'
import { speak } from '@/lib/speech'
import { cn } from '@/lib/utils'
import { BackBar } from './back-bar'
import { A11Y_COLORS, type A11yColor } from './big-button'

const STEP_STYLE: Record<GuideStep['kind'], { icon: LucideIcon; color: A11yColor }> = {
  walk: { icon: Footprints, color: 'green' },
  bus: { icon: BusFront, color: 'blue' },
  transfer: { icon: ArrowLeftRight, color: 'orange' },
  arrive: { icon: MapPinCheck, color: 'red' },
}

export function TripView({ trip, onBack }: { trip: Trip; onBack: () => void }) {
  return (
    <div className="flex flex-1 flex-col">
      <BackBar title={trip.name} onBack={onBack} onRepeat={() => speak(tripToSpeech(trip))} />

      <div className="mb-4 flex items-center gap-4 rounded-3xl bg-a11y-blue p-4 text-white">
        <span className="flex h-20 min-w-20 items-center justify-center rounded-2xl bg-white px-3 text-5xl font-extrabold text-a11y-blue">
          {trip.route}
        </span>
        <div>
          <p className="text-xl font-bold">Xe buýt số {trip.route}</p>
          <p className="text-3xl font-extrabold">{trip.duration}</p>
        </div>
      </div>

      <ol className="flex flex-col gap-3">
        {trip.steps.map((step, i) => {
          const style = STEP_STYLE[step.kind]
          const Icon = style.icon
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => speak(`Bước ${i + 1}: ${step.text}`)}
                className="flex w-full items-center gap-4 rounded-3xl border-4 border-foreground bg-white p-3 text-left focus-visible:outline-none focus-visible:ring-8 focus-visible:ring-foreground/30"
              >
                <span
                  className={cn('flex size-20 shrink-0 items-center justify-center rounded-2xl', A11Y_COLORS[style.color])}
                  aria-hidden="true"
                >
                  <Icon className="size-12" strokeWidth={2.4} />
                </span>
                <span className="text-xl font-bold leading-snug">{step.text}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
