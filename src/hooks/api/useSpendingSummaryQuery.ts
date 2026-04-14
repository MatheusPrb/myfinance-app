import { useQuery } from '@tanstack/react-query'
import { fetchSpendingSummary } from '../../services/expenseService'
import { queryKeys } from '../../query/queryKeys'

const STALE_MS = 30_000

export type DateRangeFilter = { date_from: string; date_to: string }

export function useSpendingSummaryQuery(enabled: boolean, range: DateRangeFilter) {
  const { date_from, date_to } = range
  return useQuery({
    queryKey: queryKeys.expenses.summary(date_from, date_to),
    queryFn: () => fetchSpendingSummary({ date_from, date_to }),
    enabled,
    staleTime: STALE_MS,
  })
}
