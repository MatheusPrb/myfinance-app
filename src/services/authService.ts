import { api } from '../api/client'
import type { ApiSuccess } from '../api/types'

export async function loginRequest(email: string, password: string): Promise<string> {
  const { data } = await api.post<ApiSuccess<string>>('/login', { email, password })
  return data.data
}

export async function registerRequest(
  name: string,
  email: string,
  password: string,
): Promise<void> {
  await api.post<ApiSuccess<null>>('/register', { name, email, password })
}

/** Revoga o token atual no servidor (Sanctum). */
export async function logoutRequest(): Promise<void> {
  await api.post<ApiSuccess<null>>('/logout')
}

export async function requestPasswordReset(email: string): Promise<string> {
  const { data } = await api.post<ApiSuccess<{ message: string }>>('/password/forgot', { email })
  return data.data.message
}

export async function resetPasswordWithCode(
  email: string,
  code: string,
  password: string,
): Promise<void> {
  await api.post<ApiSuccess<null>>('/password/reset', { email, code, password })
}
