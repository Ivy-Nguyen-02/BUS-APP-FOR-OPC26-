'use client'

import { useEffect, useRef } from 'react'
import { FAVORITE_TRIPS, type Trip } from '@/lib/bus-data'
import { parseSpokenNumber, speak, useSpeechRecognition } from '@/lib/speech'
import { cn } from '@/lib/utils'
import { BackBar } from './back-bar'
import { A11Y_COLORS, type A11yColor } from './big-button'
import { MicButton } from './mic-button'

const TILE_COLORS: A11yColor[] = ['yellow', 'green', 'blue', 'orange', 'purple']

function listSpeech() {
  const list = FAVORITE_TRIPS.map((t, i) => `Số ${i + 1}: ${t.name}`).join('. ')
  return `Lộ trình yêu thích. ${list}. Hãy nói số lộ trình bạn muốn đi.`
}

type Props = { onSelect: (trip: Trip) => void; onBack: () => void }

export function FavoritesView({ onSelect, onBack }: Props) {
  const { supported, listening, transcript, start } = useSpeechRecognition()
  const startRef = useRef(start)
  const onSelectRef = useRef(onSelect)

  useEffect(() => {
    startRef.current = start
    onSelectRef.current = onSelect
  })

  function listen() {
    const ok = startRef.current((text) => {
      const n = parseSpokenNumber(text)
      const trip = n ? FAVORITE_TRIPS[n - 1] : undefined
      if (trip) {
        onSelectRef.current(trip)
      } else {
        speak(`Không nhận ra số. Bạn có ${FAVORITE_TRIPS.length} lộ trình, hãy nhấn micro và nói lại.`)
      }
    })
    if (!ok) speak('Trình duyệt này chưa hỗ trợ nhận giọng nói. Hãy chạm vào số lộ trình trên màn hình.')
  }

  useEffect(() => {
    speak(listSpeech(), {
      onEnd: () => {
        if (supported) listen()
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-1 flex-col">
      <BackBar title="Lộ trình yêu thích" onBack={onBack} onRepeat={() => speak(listSpeech())} />

      <ol className="flex flex-col gap-3">
        {FAVORITE_TRIPS.map((trip, i) => (
          <li key={trip.id}>
            <button
              type="button"
              onClick={() => onSelect(trip)}
              aria-label={`Số ${i + 1}: ${trip.name}`}
              className="flex w-full items-center gap-4 rounded-3xl border-4 border-foreground bg-white p-3 text-left focus-visible:outline-none focus-visible:ring-8 focus-visible:ring-foreground/30"
            >
              <span
                className={cn(
                  'flex size-20 shrink-0 items-center justify-center rounded-2xl text-5xl font-extrabold',
                  A11Y_COLORS[TILE_COLORS[i % TILE_COLORS.length]],
                )}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <span className="text-2xl font-extrabold leading-tight">{trip.name}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-1 flex-col items-center justify-center gap-3">
        <MicButton listening={listening} onClick={listen} color="yellow" label="Nói số" />
        {transcript && (
          <p className="text-xl font-bold" aria-live="polite">
            {'Bạn nói: "'}
            {transcript}
            {'"'}
          </p>
        )}
      </div>
    </div>
  )
}
