'use client'

import { useState } from 'react'
import { BusFront, Heart, House, Navigation, Phone, Volume2 } from 'lucide-react'
import { AccessibilityToggle } from '@/components/accessibility-toggle'
import { SwitchRoleButton } from '@/components/switch-role-button'
import { HOME_TRIP, NEARBY_STOPS, tripToSpeech, type Trip } from '@/lib/bus-data'
import { useEmergencyContact } from '@/lib/persistent-store'
import { DEFAULT_HELP_MESSAGE, repeatLastMessage, speak } from '@/lib/speech'
import { BigButton } from './big-button'
import { CallSetupView } from './call-setup-view'
import { FavoritesView } from './favorites-view'
import { NavigateView } from './navigate-view'
import { TripView } from './trip-view'

type View =
  | { name: 'home' }
  | { name: 'favorites' }
  | { name: 'navigate' }
  | { name: 'call-setup' }
  | { name: 'trip'; trip: Trip }

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

export function AccessiblePassenger() {
  const [view, setView] = useState<View>({ name: 'home' })
  const [contact] = useEmergencyContact()

  function goHome() {
    setView({ name: 'home' })
    speak('Màn hình chính. ' + DEFAULT_HELP_MESSAGE)
  }

  function openTrip(trip: Trip) {
    setView({ name: 'trip', trip })
    speak(tripToSpeech(trip))
  }

  function announceArrivals() {
    const stop = NEARBY_STOPS[0]
    const list = stop.arrivals.map((a) => `Xe số ${a.route} đến sau ${a.minutes} phút`).join('. ')
    speak(`Trạm gần nhất là ${stop.name}, cách ${stop.distance}. ${list}.`)
  }

  function callContact() {
    if (!contact) {
      setView({ name: 'call-setup' })
      speak('Bạn chưa lưu số người thân. Hãy nhờ người bên cạnh nhập tên và số điện thoại, sau đó nhấn nút Lưu màu xanh lá.')
      return
    }
    speak(`Đang gọi ${contact.name}.`, {
      onEnd: () => {
        window.location.href = telHref(contact.phone)
      },
    })
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <header className="flex items-center justify-between gap-3 border-b-4 border-foreground px-4 py-3">
        <AccessibilityToggle className="py-2 text-base" />
        <SwitchRoleButton tone="passenger" className="h-12 border-2 px-5 text-base" />
      </header>

      <main className="flex flex-1 flex-col p-4">
        {view.name === 'home' && (
          <>
            <h1 className="sr-only">Chế độ hỗ trợ người khiếm thị</h1>
            <div className="grid flex-1 grid-cols-2 gap-4" role="list">
              <BigButton
                color="yellow"
                icon={Heart}
                label="Yêu thích"
                hint="Lộ trình yêu thích. Chọn bằng giọng nói theo số."
                onClick={() => setView({ name: 'favorites' })}
              />
              <BigButton
                color="green"
                icon={House}
                label="Về nhà"
                hint="Tìm đường về nhà."
                onClick={() => openTrip(HOME_TRIP)}
              />
              <BigButton
                color="blue"
                icon={Navigation}
                label="Dẫn đường"
                hint="Dẫn đường đến địa điểm mới bằng giọng nói."
                onClick={() => {
                  setView({ name: 'navigate' })
                  speak('Dẫn đường. Nhấn nút micro lớn ở giữa màn hình, sau đó nói tên nơi bạn muốn đến.')
                }}
              />
              <BigButton
                color="orange"
                icon={BusFront}
                label="Xe sắp đến"
                hint="Nghe các xe buýt sắp đến trạm gần nhất."
                onClick={announceArrivals}
              />
              <BigButton
                color="purple"
                icon={Volume2}
                label="Trợ giúp"
                hint="Nghe lại hướng dẫn vừa phát."
                onClick={repeatLastMessage}
              />
              <BigButton
                color="red"
                icon={Phone}
                label="Gọi người thân"
                hint={contact ? `Gọi cho ${contact.name}.` : 'Chưa lưu số người thân.'}
                onClick={callContact}
                onLongPress={() => {
                  setView({ name: 'call-setup' })
                  speak('Đổi số người thân. Hãy nhờ người bên cạnh nhập số mới.')
                }}
              />
            </div>
            <p className="mt-4 text-center text-sm font-medium text-muted-foreground">
              Giữ nút đỏ 2 giây để đổi số người thân
            </p>
          </>
        )}

        {view.name === 'favorites' && <FavoritesView onSelect={openTrip} onBack={goHome} />}
        {view.name === 'navigate' && <NavigateView onFound={openTrip} onBack={goHome} />}
        {view.name === 'trip' && <TripView trip={view.trip} onBack={goHome} />}
        {view.name === 'call-setup' && <CallSetupView onDone={goHome} onBack={goHome} />}
      </main>
    </div>
  )
}
