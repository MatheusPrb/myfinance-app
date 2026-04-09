import { useSyncExternalStore } from 'react'

const KEY = 'myfinance_token'

const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function emit() {
  listeners.forEach((l) => l())
}

/** Leitura direta (axios, etc.) — sempre o valor atual no storage. */
export function readStoredToken(): string | null {
  return localStorage.getItem(KEY)
}

function getTokenSnapshot(): string | null {
  return localStorage.getItem(KEY)
}

export function storeAuthToken(token: string): void {
  localStorage.setItem(KEY, token)
  emit()
}

export function clearAuthToken(): void {
  localStorage.removeItem(KEY)
  emit()
}

/**
 * Token para componentes React: re-renderiza ao login/logout mesmo na mesma URL (ex.: Sair na home).
 */
export function useAuthToken(): string | null {
  return useSyncExternalStore(subscribe, getTokenSnapshot, () => null)
}
