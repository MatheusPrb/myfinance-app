import { useQuery } from '@tanstack/react-query'
import { fetchSpendingSummary } from '../../services/expenseService'
import { queryKeys } from '../../query/queryKeys'

const STALE_MS = 30_000

export function useSpendingSummaryQuery(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.expenses.summary(),
    queryFn: fetchSpendingSummary,
    enabled,
    staleTime: STALE_MS,
  })
}
