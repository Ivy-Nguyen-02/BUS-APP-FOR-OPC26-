'use client'

import { ArrowLeft, Volume2 } from 'lucide-react'

type Props = {
  title: string
  onBack: () => void
  onRepeat: () => void
}

export function BackBar({ title, onBack, onRepeat }: Props) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <button
        type="button"
        onClick={onBack}
        aria-label="Quay lại màn hình chính"
        className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-foreground text-white focus-visible:outline-none focus-visible:ring-8 focus-visible:ring-foreground/30"
      >
        <ArrowLeft className="size-9" strokeWidth={2.6} aria-hidden="true" />
      </button>
      <h1 className="flex-1 text-3xl font-extrabold leading-tight">{title}</h1>
      <button
        type="button"
        onClick={onRepeat}
        aria-label="Nghe lại"
        className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-a11y-purple text-white focus-visible:outline-none focus-visible:ring-8 focus-visible:ring-a11y-purple/40"
      >
        <Volume2 className="size-9" strokeWidth={2.4} aria-hidden="true" />
      </button>
    </div>
  )
}
