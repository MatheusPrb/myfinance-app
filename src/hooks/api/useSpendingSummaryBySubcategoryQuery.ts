import { useQuery } from '@tanstack/react-query'
import { fetchSpendingSummaryBySubcategory } from '../../services/expenseService'
import { queryKeys } from '../../query/queryKeys'
import type { DateRangeFilter } from './useSpendingSummaryQuery'

const STALE_MS = 30_000

export function useSpendingSummaryBySubcategoryQuery(enabled: boolean, range: DateRangeFilter) {
  const { date_from, date_to } = range
  return useQuery({
    queryKey: queryKeys.expenses.summaryBySubcategory(date_from, date_to),
    queryFn: () => fetchSpendingSummaryBySubcategory({ date_from, date_to }),
    enabled,
    staleTime: STALE_MS,
  })
}
