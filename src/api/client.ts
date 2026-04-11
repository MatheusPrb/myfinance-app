/**
 * Clientes axios: `api` → `/api/v1/*`; `apiSession` → `/api/*` (ex.: `GET /user`).
 * Em produção: `VITE_API_URL` no build; se vazio, usa o mesmo origin do navegador (paths relativos /api).
 */
import axios, { type AxiosInstance } from 'axios'
import { readStoredToken } from '../hooks/useAuthToken'

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
