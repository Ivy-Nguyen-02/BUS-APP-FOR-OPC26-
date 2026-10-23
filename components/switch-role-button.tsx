import Link from 'next/link'
import { ArrowLeftRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  tone?: 'passenger' | 'driver' | 'onDark'
  /** Show only the icon on small screens to save header space. */
  compact?: boolean
  className?: string
}

export function SwitchRoleButton({ tone = 'passenger', compact = false, className }: Props) {
  return (
    <Link
      href="/"
      aria-label="Đổi vai trò – quay lại màn hình Bạn là ai?"
      className={cn(
        'inline-flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        compact && 'w-10 justify-center px-0 sm:w-auto sm:px-4',
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
      <span className={cn(compact && 'hidden sm:inline')}>Bạn là ai?</span>
    </Link>
  )
}
