'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { findTripForPlace, type Trip } from '@/lib/bus-data'
import { speak, useSpeechRecognition } from '@/lib/speech'
import { BackBar } from './back-bar'
import { MicButton } from './mic-button'

const INTRO = 'Dẫn đường. Nhấn nút micro lớn ở giữa màn hình, sau đó nói tên nơi bạn muốn đến.'

type Props = { onFound: (trip: Trip) => void; onBack: () => void }

export function NavigateView({ onFound, onBack }: Props) {
  const { supported, listening, transcript, start } = useSpeechRecognition()
  const [typed, setTyped] = useState('')

  function listen() {
    const ok = start((text) => {
      if (text.trim()) onFound(findTripForPlace(text))
      else speak('Không nghe rõ. Hãy nhấn micro và nói lại.')
    })
    if (!ok) speak('Trình duyệt này chưa hỗ trợ nhận giọng nói. Hãy nhờ người bên cạnh nhập địa điểm.')
  }

  return (
    <div className="flex flex-1 flex-col">
      <BackBar title="Dẫn đường" onBack={onBack} onRepeat={() => speak(INTRO)} />

      <div className="flex flex-1 flex-col items-center justify-center gap-5">
        <MicButton listening={listening} onClick={listen} color="blue" label="Nói nơi đến" />
        {transcript && (
          <p className="text-xl font-bold" aria-live="polite">
            {'Bạn nói: "'}
            {transcript}
            {'"'}
          </p>
        )}
      </div>

      {!supported && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (typed.trim()) onFound(findTripForPlace(typed))
          }}
          className="mt-6 flex gap-3"
        >
          <label htmlFor="a11y-destination" className="sr-only">
            Nhập nơi muốn đến
          </label>
          <input
            id="a11y-destination"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Nhập nơi muốn đến"
            className="h-16 min-w-0 flex-1 rounded-2xl border-4 border-foreground px-4 text-xl font-semibold outline-none focus:ring-8 focus:ring-a11y-blue/30"
          />
          <button
            type="submit"
            aria-label="Tìm đường"
            className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-a11y-blue text-white focus-visible:outline-none focus-visible:ring-8 focus-visible:ring-a11y-blue/40"
          >
            <Search className="size-9" strokeWidth={2.6} aria-hidden="true" />
          </button>
        </form>
      )}
    </div>
  )
}
