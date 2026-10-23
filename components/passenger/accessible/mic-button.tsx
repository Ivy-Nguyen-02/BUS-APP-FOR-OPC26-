'use client'

import { Mic } from 'lucide-react'
import { cn } from '@/lib/utils'
import { A11Y_COLORS, type A11yColor } from './big-button'

type Props = {
  listening: boolean
  onClick: () => void
  color?: A11yColor
  label?: string
}

export function MicButton({ listening, onClick, color = 'blue', label = 'Nhấn để nói' }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={listening ? 'Đang nghe, hãy nói' : label}
      aria-pressed={listening}
      className={cn(
        'relative mx-auto flex size-56 flex-col items-center justify-center gap-2 rounded-full shadow-xl focus-visible:outline-none focus-visible:ring-8 md:size-64',
        A11Y_COLORS[color],
      )}
    >
      {listening && (
        <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-20" aria-hidden="true" />
      )}
      <Mic className="size-24" strokeWidth={2.4} aria-hidden="true" />
      <span className="text-2xl font-extrabold">{listening ? 'Đang nghe…' : label}</span>
    </button>
  )
}
