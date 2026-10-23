'use client'

import dynamic from 'next/dynamic'

export const BusMap = dynamic(() => import('./bus-map'), {
  ssr: false,
  loading: () => (
    <div className="flex size-full items-center justify-center bg-muted text-sm text-muted-foreground">
      Đang tải bản đồ…
    </div>
  ),
})

export type { MapSegment, MapStop } from './bus-map'
