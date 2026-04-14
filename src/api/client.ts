/**
 * Clientes axios: `api` → `/api/v1/*`; `apiSession` → `/api/*` (ex.: `GET /user`).
 * Em produção: `VITE_API_URL` no build; se vazio, usa o mesmo origin do navegador (paths relativos /api).
 */
import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { clearAuthToken, readStoredToken } from '../hooks/useAuthToken'
import { queryClient } from '../query/queryClient'

function apiOriginForProd(): string {
  const raw = import.meta.env.VITE_API_URL
  if (raw != null && String(raw).trim() !== '') {
    return String(raw).replace(/\/$/, '')
  }
  if (typeof globalThis !== 'undefined' && 'location' in globalThis && globalThis.location?.origin) {
    return globalThis.location.origin
  }
  return ''
}

function apiV1BaseURL(): string {
  if (import.meta.env.DEV) {
    return '/api/v1'
  }
  const origin = apiOriginForProd()
  return origin ? `${origin}/api/v1` : '/api/v1'
}

function apiRootBaseURL(): string {
  if (import.meta.env.DEV) {
    return '/api'
  }
  const origin = apiOriginForProd()
  return origin ? `${origin}/api` : '/api'
}

function attachBearerAuth(instance: AxiosInstance) {
  instance.interceptors.request.use((config) => {
    const token = readStoredToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })
}

function isCredentialMismatch401Request(url: string | undefined): boolean {
  const path = (url ?? '').split('?')[0].replace(/^\/+/, '')
  const first = path.split('/')[0] ?? ''
  return first === 'login' || first === 'register'
}

const GUEST_APP_PATHS = ['/login', '/register', '/forgot-password', '/reset-password']

function isGuestAppPath(pathname: string): boolean {
  return GUEST_APP_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

function attachSessionInvalidationOn401(instance: AxiosInstance) {
  instance.interceptors.response.use(
    (res) => res,
    (error) => {
      if (!axios.isAxiosError(error)) return Promise.reject(error)
      const status = error.response?.status
      const cfg = error.config as InternalAxiosRequestConfig | undefined
      if (status !== 401 || !cfg || isCredentialMismatch401Request(cfg.url)) {
        return Promise.reject(error)
      }

      clearAuthToken()
      queryClient.clear()

      if (typeof globalThis.location !== 'undefined') {
        const path = globalThis.location.pathname
        if (!isGuestAppPath(path)) {
          globalThis.location.replace('/login?session=expired')
        }
      }

      return Promise.reject(error)
    },
  )
}

export const api = axios.create({
  baseURL: apiV1BaseURL(),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export const apiSession = axios.create({
  baseURL: apiRootBaseURL(),
  headers: {
    Accept: 'application/json',
  },
})

attachBearerAuth(api)
attachBearerAuth(apiSession)
attachSessionInvalidationOn401(api)
attachSessionInvalidationOn401(apiSession)
