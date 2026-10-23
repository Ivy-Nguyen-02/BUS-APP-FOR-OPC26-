import { cn } from '@/lib/utils'

export function RouteBadge({ number, className }: { number: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-7 min-w-10 items-center justify-center rounded-lg bg-passenger px-2 text-sm font-bold text-passenger-foreground tabular-nums',
        className,
      )}
    >
      {number}
    </span>
  )
}
