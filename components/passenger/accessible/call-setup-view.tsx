'use client'

import { useState } from 'react'
import { Check, Headset } from 'lucide-react'
import { useEmergencyContact } from '@/lib/persistent-store'
import { speak } from '@/lib/speech'
import { BackBar } from './back-bar'

const INTRO = 'Lưu số người thân. Nhập tên và số điện thoại, sau đó nhấn nút Lưu màu xanh lá ở cuối màn hình.'
const BUS_HOTLINE = '1022'

type Props = { onDone: () => void; onBack: () => void }

export function CallSetupView({ onDone, onBack }: Props) {
  const [contact, setContact] = useEmergencyContact()
  const [name, setName] = useState(contact?.name ?? '')
  const [phone, setPhone] = useState(contact?.phone ?? '')
  const [error, setError] = useState('')

  function save(e: React.FormEvent) {
    e.preventDefault()
    const digits = phone.replace(/[^\d+]/g, '')
    if (!/^\+?\d{9,12}$/.test(digits)) {
      setError('Số điện thoại chưa đúng')
      speak('Số điện thoại chưa đúng. Vui lòng nhập lại.')
      return
    }
    const savedName = name.trim() || 'Người thân'
    setContact({ name: savedName, phone: digits })
    speak(`Đã lưu số của ${savedName}. Nhấn nút đỏ Gọi người thân để gọi.`, { onEnd: onDone })
  }

  return (
    <div className="flex flex-1 flex-col">
      <BackBar title="Số người thân" onBack={onBack} onRepeat={() => speak(INTRO)} />

      <a
        href={`tel:${BUS_HOTLINE}`}
        onClick={() => speak('Đang gọi tổng đài xe buýt.', { remember: false })}
        aria-label={`Gọi tổng đài xe buýt, số ${BUS_HOTLINE.split('').join(' ')}`}
        className="mb-5 flex items-center gap-4 rounded-3xl bg-a11y-red p-4 text-white shadow-md focus-visible:outline-none focus-visible:ring-8 focus-visible:ring-a11y-red/40"
      >
        <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-white text-a11y-red">
          <Headset className="size-9" aria-hidden="true" />
        </span>
        <span className="flex flex-col">
          <span className="text-xl font-extrabold">Tổng đài xe buýt</span>
          <span className="text-3xl font-extrabold tabular-nums tracking-wider">{BUS_HOTLINE}</span>
        </span>
      </a>

      <form onSubmit={save} className="flex flex-1 flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-name" className="text-2xl font-extrabold">
            Tên
          </label>
          <input
            id="contact-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Con gái"
            autoComplete="off"
            className="h-16 rounded-2xl border-4 border-foreground px-4 text-2xl font-semibold outline-none focus:ring-8 focus:ring-a11y-red/30"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-phone" className="text-2xl font-extrabold">
            Số điện thoại
          </label>
          <input
            id="contact-phone"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
              setError('')
            }}
            type="tel"
            inputMode="tel"
            placeholder="09xx xxx xxx"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'contact-error' : undefined}
            className="h-16 rounded-2xl border-4 border-foreground px-4 text-2xl font-semibold tracking-wider outline-none focus:ring-8 focus:ring-a11y-red/30"
          />
          {error && (
            <p id="contact-error" role="alert" className="text-xl font-bold text-a11y-red">
              {error}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="mt-auto flex h-24 items-center justify-center gap-3 rounded-3xl bg-a11y-green text-3xl font-extrabold text-white shadow-md focus-visible:outline-none focus-visible:ring-8 focus-visible:ring-a11y-green/40"
        >
          <Check className="size-12" strokeWidth={3} aria-hidden="true" />
          Lưu
        </button>
      </form>
    </div>
  )
}
