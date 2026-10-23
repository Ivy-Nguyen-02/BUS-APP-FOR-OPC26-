'use server'

import { redirect } from 'next/navigation'
import { clearDriverSession, createDriverSession, getDriverSession, verifyCredentials } from '@/lib/driver-auth'

export type LoginState = { error?: string; username?: string }

export async function loginDriver(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get('username') ?? '').slice(0, 64)
  const password = String(formData.get('password') ?? '').slice(0, 128)

  if (!username || !password) {
    return { error: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.', username }
  }
  if (!verifyCredentials(username, password)) {
    return { error: 'Tên đăng nhập hoặc mật khẩu không đúng.', username }
  }

  await createDriverSession()
  redirect('/tai-xe')
}

export async function logoutDriver() {
  await clearDriverSession()
  redirect('/tai-xe/dang-nhap')
}

export type ReportKind = 'traffic' | 'sos'

export async function sendDriverReport(kind: ReportKind, position: [number, number]) {
  const driver = await getDriverSession()
  if (!driver) return { ok: false as const, error: 'Phiên đăng nhập đã hết hạn.' }

  const [lat, lng] = position
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    return { ok: false as const, error: 'Tọa độ không hợp lệ.' }
  }

  const ticket = `${kind === 'sos' ? 'SOS' : 'SC'}-${Date.now().toString(36).toUpperCase()}`
  console.info('[dispatch] driver report', { ticket, kind, vehicle: driver.vehicle, lat, lng })
  return { ok: true as const, ticket, sentAt: new Date().toISOString() }
}
