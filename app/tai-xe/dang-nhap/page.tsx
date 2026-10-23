import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { BusFront as SteeringWheel, ShieldCheck } from 'lucide-react'
import { DriverLoginForm } from '@/components/driver/driver-login-form'
import { SwitchRoleButton } from '@/components/switch-role-button'
import { getDriverSession } from '@/lib/driver-auth'

export const metadata: Metadata = {
  title: 'Đăng nhập tài xế – SmartBus',
  description: 'Đăng nhập tài khoản tài xế để vào bảng điều khiển chuyến xe.',
}

export default async function DriverLoginPage() {
  if (await getDriverSession()) redirect('/tai-xe')

  return (
    <main className="flex min-h-dvh flex-col bg-white">
      <div className="flex justify-end p-4">
        <SwitchRoleButton tone="driver" />
      </div>
      <div className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center">
            <span className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-driver text-driver-foreground shadow-lg shadow-driver/20">
              <SteeringWheel className="size-9" aria-hidden="true" />
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-balance">Đăng nhập tài xế</h1>
            <p className="mt-1.5 text-sm text-muted-foreground text-pretty">
              Xác thực danh tính để bắt đầu ca làm việc và nhận dữ liệu tuyến.
            </p>
          </div>
          <DriverLoginForm />
          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-driver" aria-hidden="true" />
            Phiên đăng nhập được mã hóa và lưu trên máy chủ
          </p>
        </div>
      </div>
    </main>
  )
}
