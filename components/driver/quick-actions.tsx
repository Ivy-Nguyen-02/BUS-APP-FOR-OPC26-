'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { CheckCircle2, Loader2, Siren, TrafficCone, X } from 'lucide-react'
import { sendDriverReport, type ReportKind } from '@/app/tai-xe/actions'
import type { LatLng } from '@/lib/bus-data'
import { cn } from '@/lib/utils'

const HOLD_MS = 2000

type Feedback = { kind: ReportKind; ok: boolean; message: string; detail?: string }

export function QuickActions({ position }: { position: LatLng }) {
  const [pending, startTransition] = useTransition()
  const [pendingKind, setPendingKind] = useState<ReportKind | null>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [holdProgress, setHoldProgress] = useState(0)
  const holdStart = useRef<number | null>(null)
  const frame = useRef<number | null>(null)
  const positionRef = useRef(position)

  useEffect(() => {
    positionRef.current = position
  }, [position])

  useEffect(() => {
    if (!feedback || feedback.kind === 'sos') return
    const id = setTimeout(() => setFeedback(null), 6000)
    return () => clearTimeout(id)
  }, [feedback])

  useEffect(() => () => {
    if (frame.current) cancelAnimationFrame(frame.current)
  }, [])

  function send(kind: ReportKind) {
    const coords = positionRef.current
    setPendingKind(kind)
    startTransition(async () => {
      const res = await sendDriverReport(kind, coords)
      setPendingKind(null)
      if (!res.ok) {
        setFeedback({ kind, ok: false, message: res.error })
        return
      }
      setFeedback({
        kind,
        ok: true,
        message: kind === 'sos' ? 'Đã phát tín hiệu SOS về trung tâm' : 'Đã gửi báo cáo kẹt xe / sự cố',
        detail: `Mã ${res.ticket} · Tọa độ ${coords[0].toFixed(5)}, ${coords[1].toFixed(5)}`,
      })
      if (kind === 'sos' && 'vibrate' in navigator) navigator.vibrate([200, 100, 200])
    })
  }

  function tick() {
    if (holdStart.current === null) return
    const progress = Math.min(1, (performance.now() - holdStart.current) / HOLD_MS)
    setHoldProgress(progress)
    if (progress >= 1) {
      holdStart.current = null
      setHoldProgress(0)
      send('sos')
      return
    }
    frame.current = requestAnimationFrame(tick)
  }

  function startHold() {
    if (pending) return
    holdStart.current = performance.now()
    frame.current = requestAnimationFrame(tick)
  }

  function cancelHold() {
    holdStart.current = null
    if (frame.current) cancelAnimationFrame(frame.current)
    setHoldProgress(0)
  }

  const holdSecondsLeft = Math.ceil((1 - holdProgress) * (HOLD_MS / 1000))

  return (
    <div className="relative">
      {feedback && (
        <div
          role={feedback.kind === 'sos' ? 'alert' : 'status'}
          className={cn(
            'absolute inset-x-0 bottom-full z-[1000] mb-3 flex items-start gap-3 rounded-2xl p-4 shadow-xl',
            !feedback.ok && 'bg-foreground text-background',
            feedback.ok && feedback.kind === 'sos' && 'bg-red-600 text-white',
            feedback.ok && feedback.kind === 'traffic' && 'bg-amber-400 text-amber-950',
          )}
        >
          <CheckCircle2 className="mt-0.5 size-6 shrink-0" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="font-bold">{feedback.message}</p>
            {feedback.detail && <p className="mt-0.5 text-sm opacity-90">{feedback.detail}</p>}
            {feedback.kind === 'sos' && feedback.ok && (
              <p className="mt-0.5 text-sm opacity-90">Trung tâm điều hành đang liên hệ lại. Giữ bình tĩnh.</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            aria-label="Đóng thông báo"
            className="flex size-8 shrink-0 items-center justify-center rounded-full hover:bg-black/10"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => send('traffic')}
          disabled={pending}
          className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl bg-amber-400 px-3 py-3 text-amber-950 sm:flex-row sm:gap-3 sm:px-4 shadow-md transition active:scale-[0.98] disabled:opacity-70 sm:h-28"
        >
          {pendingKind === 'traffic' ? (
            <Loader2 className="size-10 animate-spin" aria-hidden="true" />
          ) : (
            <TrafficCone className="size-10 shrink-0" strokeWidth={2.2} aria-hidden="true" />
          )}
          <span className="text-center leading-tight sm:text-left">
            <span className="block text-base font-extrabold text-balance sm:text-xl">Báo kẹt xe / Sự cố</span>
            <span className="text-xs font-semibold opacity-80 sm:text-sm">Chạm 1 lần để gửi tọa độ</span>
          </span>
        </button>

        <button
          type="button"
          onPointerDown={startHold}
          onPointerUp={cancelHold}
          onPointerLeave={cancelHold}
          onPointerCancel={cancelHold}
          onKeyDown={(e) => {
            if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) startHold()
          }}
          onKeyUp={cancelHold}
          onContextMenu={(e) => e.preventDefault()}
          disabled={pending}
          aria-label="Gửi tín hiệu khẩn cấp SOS. Nhấn giữ 2 giây"
          className="relative flex min-h-28 touch-none select-none flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl bg-red-600 px-3 py-3 text-white sm:flex-row sm:gap-3 sm:px-4 shadow-md disabled:opacity-70 sm:h-28"
        >
          <span
            className="absolute inset-y-0 left-0 bg-red-900/60"
            style={{ width: `${holdProgress * 100}%` }}
            aria-hidden="true"
          />
          {pendingKind === 'sos' ? (
            <Loader2 className="relative size-10 animate-spin" aria-hidden="true" />
          ) : (
            <Siren className={cn('relative size-10 shrink-0', holdProgress > 0 && 'animate-pulse')} strokeWidth={2.2} aria-hidden="true" />
          )}
          <span className="relative text-center leading-tight sm:text-left">
            <span className="block text-base font-extrabold text-balance sm:text-xl">SOS khẩn cấp</span>
            <span className="text-xs font-semibold opacity-90 sm:text-sm">
              {holdProgress > 0 ? `Tiếp tục giữ… ${holdSecondsLeft}s` : 'Nhấn giữ 2 giây'}
            </span>
          </span>
        </button>
      </div>
    </div>
  )
}
