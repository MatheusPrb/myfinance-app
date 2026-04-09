import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { parseApiError } from '../utils/apiError'

function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (failureCount >= 2) return false
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 401 || status === 403 || status === 404 || status === 422) return false
    if (status !== undefined && status < 500) return false
  }
  return true
}

function logQueryError(error: unknown, queryKey: readonly unknown[]) {
  const { message } = parseApiError(error)
  console.error('[MyFinance Query]', queryKey.join(' › '), message, error)
}

function createAppQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 10 * 60_000,
        retry: shouldRetryQuery,
        refetchOnWindowFocus: true,
      },
      mutations: {
        retry: 0,
      },
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        logQueryError(error, query.queryKey)
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        const key = mutation.options.mutationKey ?? ['mutation']
        logQueryError(error, key as readonly unknown[])
      },
    }),
  })
}

/** Instância única (SPA) — compartilhada pelo provider e por código fora de componentes se necessário */
export const queryClient = createAppQueryClient()
