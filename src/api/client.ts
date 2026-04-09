/**
 * Clientes axios: `api` → `/api/v1/*`; `apiSession` → `/api/*` (ex.: `GET /user`).
 */
import axios, { type AxiosInstance } from 'axios'
import { readStoredToken } from '../hooks/useAuthToken'

function apiV1BaseURL(): string {
  if (import.meta.env.DEV) {
    return '/api/v1'
  }
  const origin = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/$/, '')
  return `${origin}/api/v1`
}

function apiRootBaseURL(): string {
  if (import.meta.env.DEV) {
    return '/api'
  }
  const origin = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/$/, '')
  return `${origin}/api`
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
