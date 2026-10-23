'use client'

import { useAccessibilityMode } from '@/lib/persistent-store'
import { AccessiblePassenger } from './accessible/accessible-passenger'
import { NormalPassenger } from './normal/normal-passenger'

export function PassengerApp() {
  const [a11y] = useAccessibilityMode()
  return a11y ? <AccessiblePassenger /> : <NormalPassenger />
}
