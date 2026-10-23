'use client'

import { Accessibility } from 'lucide-react'
import { useAccessibilityMode } from '@/lib/persistent-store'
import { speak, stopSpeaking } from '@/lib/speech'
import { cn } from '@/lib/utils'

type Props = {
  onEnabledMessage?: string
  className?: string
  compact?: boolean
}

export function AccessibilityToggle({ onEnabledMessage, className, compact }: Props) {
  const [enabled, setEnabled] = useAccessibilityMode()

  function toggle() {
    const next = !enabled
    setEnabled(next)
    if (next) {
      speak(onEnabledMessage ?? 'Đã bật chế độ hỗ trợ người khiếm thị.')
    } else {
      stopSpeaking()
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label="Chế độ hỗ trợ người khiếm thị"
      onClick={toggle}
      className={cn(
        'inline-flex items-center gap-3 rounded-full border-2 py-1.5 pl-2 pr-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-a11y-blue/40',
        enabled
          ? 'border-a11y-blue bg-a11y-blue text-white'
          : 'border-border bg-white text-foreground hover:border-a11y-blue/50',
        className,
      )}
    >
      <span
        className={cn(
          'flex size-7 items-center justify-center rounded-full',
          enabled ? 'bg-white text-a11y-blue' : 'bg-a11y-blue text-white',
        )}
      >
        <Accessibility className="size-4" aria-hidden="true" />
      </span>
      {!compact && <span className="hidden sm:inline">Hỗ trợ khiếm thị</span>}
      <span
        aria-hidden="true"
        className={cn(
          'relative h-6 w-11 rounded-full transition-colors',
          enabled ? 'bg-white/30' : 'bg-muted-foreground/30',
        )}
      >
        <span
          className={cn(
            'absolute left-0 top-0.5 size-5 rounded-full bg-white shadow transition-transform',
            enabled ? 'translate-x-5.5' : 'translate-x-0.5',
          )}
        />
      </span>
    </button>
  )
}
