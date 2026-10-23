'use client'

import { useRef } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export const A11Y_COLORS = {
  yellow: 'bg-a11y-yellow text-foreground focus-visible:ring-a11y-yellow/50',
  green: 'bg-a11y-green text-white focus-visible:ring-a11y-green/50',
  blue: 'bg-a11y-blue text-white focus-visible:ring-a11y-blue/50',
  orange: 'bg-a11y-orange text-white focus-visible:ring-a11y-orange/50',
  purple: 'bg-a11y-purple text-white focus-visible:ring-a11y-purple/50',
  red: 'bg-a11y-red text-white focus-visible:ring-a11y-red/50',
  dark: 'bg-foreground text-white focus-visible:ring-foreground/40',
} as const

export type A11yColor = keyof typeof A11Y_COLORS

type Props = {
  color: A11yColor
  icon: LucideIcon
  label: string
  hint?: string
  onClick: () => void
  onLongPress?: () => void
  className?: string
}

const LONG_PRESS_MS = 2000

export function BigButton({ color, icon: Icon, label, hint, onClick, onLongPress, className }: Props) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const longPressed = useRef(false)

  function startPress() {
    if (!onLongPress) return
    longPressed.current = false
    timer.current = setTimeout(() => {
      longPressed.current = true
      onLongPress()
    }, LONG_PRESS_MS)
  }

  function cancelPress() {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
  }

  return (
    <button
      type="button"
      role="listitem"
      aria-label={hint ? `${label}. ${hint}` : label}
      onPointerDown={startPress}
      onPointerUp={cancelPress}
      onPointerLeave={cancelPress}
      onContextMenu={(e) => onLongPress && e.preventDefault()}
      onClick={() => {
        if (longPressed.current) {
          longPressed.current = false
          return
        }
        onClick()
      }}
      className={cn(
        'flex min-h-36 select-none flex-col items-center justify-center gap-3 rounded-3xl p-4 text-center shadow-md transition-transform active:scale-[0.97] focus-visible:outline-none focus-visible:ring-8',
        A11Y_COLORS[color],
        className,
      )}
    >
      <Icon className="size-16 md:size-20" strokeWidth={2.4} aria-hidden="true" />
      <span className="text-2xl font-extrabold leading-tight md:text-3xl">{label}</span>
    </button>
  )
}
