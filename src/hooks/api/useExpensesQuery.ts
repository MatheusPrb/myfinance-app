import { useQuery } from '@tanstack/react-query'
import { fetchExpenses } from '../../services/expenseService'
import { queryKeys } from '../../query/queryKeys'
import type { DateRangeFilter } from './useSpendingSummaryQuery'

const STALE_MS = 30_000

export function useExpensesQuery(page: number, perPage: number, range: DateRangeFilter) {
  const { date_from, date_to } = range
  return useQuery({
    queryKey: queryKeys.expenses.list(page, perPage, { date_from, date_to }),
    queryFn: () => fetchExpenses(page, perPage, { date_from, date_to }),
    staleTime: STALE_MS,
  })
}
