import Link from 'next/link'
import { ArrowLeftRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  tone?: 'passenger' | 'driver' | 'onDark'
  className?: string
}

export function SwitchRoleButton({ tone = 'passenger', className }: Props) {
  return (
    <Link
      href="/"
      aria-label="Đổi vai trò – quay lại màn hình Bạn là ai?"
      className={cn(
        'inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        tone === 'passenger' &&
          'border-passenger/30 bg-white text-passenger hover:bg-passenger-soft focus-visible:ring-passenger',
        tone === 'driver' &&
          'border-driver/30 bg-white text-driver hover:bg-driver-soft focus-visible:ring-driver',
        tone === 'onDark' &&
          'border-white/40 bg-white/10 text-white hover:bg-white/20 focus-visible:ring-white',
        className,
      )}
    >
      <ArrowLeftRight className="size-4" aria-hidden="true" />
      <span>Bạn là ai?</span>
    </Link>
  )
}
