const KEY = 'myfinance_token'

export function readStoredToken(): string | null {
  return localStorage.getItem(KEY)
}

export function storeAuthToken(token: string): void {
  localStorage.setItem(KEY, token)
}

export function clearAuthToken(): void {
  localStorage.removeItem(KEY)
}
