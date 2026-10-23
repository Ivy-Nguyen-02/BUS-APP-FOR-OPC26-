import 'server-only'

import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

// Prototype account requested for the pilot phase; replace with a real user store later.
const DRIVER_ACCOUNT = {
  username: 'busapp',
  password: 'oisp2026',
  displayName: 'Tài xế OPCD',
  route: '08',
  vehicle: '51B-12345',
}

export type DriverProfile = Omit<typeof DRIVER_ACCOUNT, 'password'>

const COOKIE_NAME = 'smartbus_driver'
const SESSION_SECONDS = 60 * 60 * 12
const SECRET = process.env.DRIVER_SESSION_SECRET ?? 'smartbus-oisp-2026-prototype-secret'

function sign(payload: string) {
  return createHmac('sha256', SECRET).update(payload).digest('base64url')
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  return ab.length === bb.length && timingSafeEqual(ab, bb)
}

export function verifyCredentials(username: string, password: string) {
  return safeEqual(username.trim(), DRIVER_ACCOUNT.username) && safeEqual(password, DRIVER_ACCOUNT.password)
}

export async function createDriverSession() {
  const expires = Date.now() + SESSION_SECONDS * 1000
  const payload = `${DRIVER_ACCOUNT.username}.${expires}`
  const store = await cookies()
  store.set(COOKIE_NAME, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: SESSION_SECONDS,
  })
}

export async function clearDriverSession() {
  const store = await cookies()
  store.set(COOKIE_NAME, '', { httpOnly: true, secure: true, sameSite: 'none', path: '/', maxAge: 0 })
}

export async function getDriverSession(): Promise<DriverProfile | null> {
  const store = await cookies()
  const raw = store.get(COOKIE_NAME)?.value
  if (!raw) return null
  const lastDot = raw.lastIndexOf('.')
  const payload = raw.slice(0, lastDot)
  const signature = raw.slice(lastDot + 1)
  if (!safeEqual(signature, sign(payload))) return null
  const [username, expires] = payload.split('.')
  if (username !== DRIVER_ACCOUNT.username || Number(expires) < Date.now()) return null
  const { password: _password, ...profile } = DRIVER_ACCOUNT
  return profile
}
