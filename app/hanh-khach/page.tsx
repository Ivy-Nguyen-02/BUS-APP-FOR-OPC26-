import type { Metadata } from 'next'
import { PassengerApp } from '@/components/passenger/passenger-app'

export const metadata: Metadata = {
  title: 'Hành khách – SmartBus',
  description: 'Tra cứu tuyến, tìm đường, xem xe sắp đến và chế độ hỗ trợ người khiếm thị.',
}

export default function PassengerPage() {
  return <PassengerApp />
}
