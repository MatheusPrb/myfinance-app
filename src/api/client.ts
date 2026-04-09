/**
 * Cliente HTTP único (axios) para o app. Serviços em `src/services/*` importam `api` daqui.
 */
import axios from 'axios'
import { readStoredToken } from '../hooks/useAuthToken'

function apiBaseURL(): string {
  if (import.meta.env.DEV) {
    return '/api/v1'
  }
  const origin = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/$/, '')
  return `${origin}/api/v1`
}

export const api = axios.create({
  baseURL: apiBaseURL(),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = readStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
