'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BusFront, ChevronRight, UserRound, Volume2 } from 'lucide-react'
import { AccessibilityToggle } from '@/components/accessibility-toggle'
import { useAccessibilityMode } from '@/lib/persistent-store'
import { speak } from '@/lib/speech'
import { cn } from '@/lib/utils'

const ROLE_INTRO =
  'Bạn là ai? Màn hình có hai nút lớn. Nút màu xanh lá phía trên dành cho hành khách. Nút màu xanh dương phía dưới dành cho tài xế.'

const ROLES = [
  {
    id: 'passenger',
    href: '/hanh-khach',
    title: 'Hành khách',
    description: 'Tra cứu tuyến, tìm đường, xem xe sắp đến trạm',
    spoken: 'Bạn đã chọn Hành khách.',
    icon: UserRound,
    card: 'border-passenger/25 hover:border-passenger focus-visible:ring-passenger/40',
    iconBox: 'bg-passenger text-passenger-foreground',
    accent: 'text-passenger',
    soft: 'bg-passenger-soft',
  },
  {
    id: 'driver',
    href: '/tai-xe/dang-nhap',
    title: 'Tài xế',
    description: 'Đăng nhập để xem lộ trình, Camera AI và báo sự cố',
    spoken: 'Bạn đã chọn Tài xế. Vui lòng đăng nhập.',
    icon: BusFront,
    card: 'border-driver/25 hover:border-driver focus-visible:ring-driver/40',
    iconBox: 'bg-driver text-driver-foreground',
    accent: 'text-driver',
    soft: 'bg-driver-soft',
  },
] as const

export function RoleSelect() {
  const router = useRouter()
  const [a11y] = useAccessibilityMode()

  function choose(event: React.MouseEvent, role: (typeof ROLES)[number]) {
    if (!a11y) return
    event.preventDefault()
    speak(role.spoken, { onEnd: () => router.push(role.href) })
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-passenger text-passenger-foreground">
            <BusFront className="size-5" aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <p className="text-lg font-extrabold tracking-tight">SmartBus</p>
            <p className="text-xs text-muted-foreground">Xe buýt thông minh</p>
          </div>
        </div>
        <AccessibilityToggle onEnabledMessage={`Đã bật chế độ hỗ trợ khiếm thị. ${ROLE_INTRO}`} />
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-5 pb-12 pt-4">
        <div className="mb-8 text-center">
          <h1 className={cn('font-extrabold tracking-tight text-balance', a11y ? 'text-5xl' : 'text-4xl md:text-5xl')}>
            Bạn là ai?
          </h1>
          {!a11y && (
            <p className="mt-3 text-pretty text-muted-foreground">
              Chọn vai trò để bắt đầu. Bạn có thể đổi lại bất cứ lúc nào bằng nút{' '}
              <span className="font-semibold text-foreground">{'"Bạn là ai?"'}</span>.
            </p>
          )}
          {a11y && (
            <button
              type="button"
              onClick={() => speak(ROLE_INTRO)}
              className="mx-auto mt-5 flex items-center gap-3 rounded-2xl border-4 border-a11y-purple bg-a11y-purple px-6 py-4 text-xl font-bold text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-a11y-purple/40"
            >
              <Volume2 className="size-8" aria-hidden="true" />
              Nghe hướng dẫn
            </button>
          )}
        </div>

        <div className={cn('grid gap-5', a11y ? 'grid-cols-1' : 'md:grid-cols-2')}>
          {ROLES.map((role) => {
            const Icon = role.icon
            if (a11y) {
              return (
                <Link
                  key={role.id}
                  href={role.href}
                  onClick={(e) => choose(e, role)}
                  aria-label={role.title}
                  className={cn(
                    'flex min-h-40 items-center justify-center gap-6 rounded-3xl p-6 text-4xl font-extrabold shadow-lg focus-visible:outline-none focus-visible:ring-8',
                    role.iconBox,
                    role.card,
                  )}
                >
                  <Icon className="size-20" aria-hidden="true" strokeWidth={2.2} />
                  {role.title}
                </Link>
              )
            }
            return (
              <Link
                key={role.id}
                href={role.href}
                className={cn(
                  'group flex flex-col gap-6 rounded-3xl border-2 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 md:p-8',
                  role.card,
                )}
              >
                <div className="flex items-start justify-between">
                  <span className={cn('flex size-16 items-center justify-center rounded-2xl', role.iconBox)}>
                    <Icon className="size-8" aria-hidden="true" />
                  </span>
                  <span
                    className={cn(
                      'flex size-10 items-center justify-center rounded-full transition-transform group-hover:translate-x-1',
                      role.soft,
                      role.accent,
                    )}
                  >
                    <ChevronRight className="size-5" aria-hidden="true" />
                  </span>
                </div>
                <div>
                  <h2 className={cn('text-2xl font-bold', role.accent)}>{role.title}</h2>
                  <p className="mt-1.5 text-pretty text-muted-foreground">{role.description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </main>

      <footer className="pb-6 text-center text-xs text-muted-foreground">
        Dự án cải tiến công nghệ xe buýt · OISP 2026
      </footer>
    </div>
  )
}
