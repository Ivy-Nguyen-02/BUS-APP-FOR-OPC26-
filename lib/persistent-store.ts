'use client'

import { useCallback, useSyncExternalStore } from 'react'

type Listener = () => void

/**
 * Device-level preferences (accessibility mode, emergency contact) are kept on
 * the device so they work instantly and offline for visually impaired riders.
 */
export function createPersistentStore<T>(key: string, fallback: T) {
  const listeners = new Set<Listener>()
  let cachedRaw: string | null | undefined
  let cachedValue: T = fallback

  function read(): T {
    const raw = window.localStorage.getItem(key)
    if (raw === cachedRaw) return cachedValue
    cachedRaw = raw
    if (raw === null) {
      cachedValue = fallback
    } else {
      try {
        cachedValue = JSON.parse(raw) as T
      } catch {
        cachedValue = fallback
      }
    }
    return cachedValue
  }

  function subscribe(listener: Listener) {
    listeners.add(listener)
    const onStorage = (event: StorageEvent) => {
      if (event.key === key) listener()
    }
    window.addEventListener('storage', onStorage)
    return () => {
      listeners.delete(listener)
      window.removeEventListener('storage', onStorage)
    }
  }

  function write(next: T) {
    window.localStorage.setItem(key, JSON.stringify(next))
    listeners.forEach((listener) => listener())
  }

  return function usePersistentValue() {
    const value = useSyncExternalStore(subscribe, read, () => fallback)
    const setValue = useCallback((next: T) => write(next), [])
    return [value, setValue] as const
  }
}

export type EmergencyContact = { name: string; phone: string }

export const useAccessibilityMode = createPersistentStore<boolean>('smartbus:a11y-mode', false)
export const useEmergencyContact = createPersistentStore<EmergencyContact | null>(
  'smartbus:emergency-contact',
  null,
)
const DEFAULT_FAVORITE_ROUTES: string[] = ['08', '19']
export const useFavoriteRoutes = createPersistentStore<string[]>(
  'smartbus:favorite-routes',
  DEFAULT_FAVORITE_ROUTES,
)
