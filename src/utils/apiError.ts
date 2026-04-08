import axios from 'axios'
import type { ApiErrorBody } from '../api/types'

export type ParsedApiError = {
  message: string
  fieldErrors: Record<string, string>
}

export function parseApiError(err: unknown): ParsedApiError {
  if (!axios.isAxiosError(err)) {
    return {
      message: 'Não foi possível completar esta ação. Tente novamente.',
      fieldErrors: {},
    }
  }

  const data = err.response?.data
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const body = data as Partial<ApiErrorBody>
    const fieldErrors: Record<string, string> = {}
    if (body.errors && typeof body.errors === 'object') {
      for (const [key, messages] of Object.entries(body.errors)) {
        if (Array.isArray(messages) && messages[0]) fieldErrors[key] = messages[0]
      }
    }
    return {
      message: typeof body.message === 'string' ? body.message : 'Não foi possível concluir a solicitação.',
      fieldErrors,
    }
  }

  if (err.response) {
    return {
      message: 'Não foi possível completar esta ação. Tente novamente.',
      fieldErrors: {},
    }
  }

  return {
    message: 'Não foi possível completar esta ação. Tente novamente.',
    fieldErrors: {},
  }
}
