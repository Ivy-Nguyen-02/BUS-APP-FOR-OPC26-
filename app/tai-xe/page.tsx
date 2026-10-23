import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { DriverDashboard } from '@/components/driver/driver-dashboard'
import { getDriverSession } from '@/lib/driver-auth'

export const metadata: Metadata = {
  title: 'Bảng điều khiển tài xế – SmartBus',
  description: 'Lộ trình thông minh, giao thông thời gian thực, Camera AI đếm khách và báo động khẩn cấp.',
}

export default async function DriverPage() {
  const driver = await getDriverSession()
  if (!driver) redirect('/tai-xe/dang-nhap')
  return <DriverDashboard driver={driver} />
}
