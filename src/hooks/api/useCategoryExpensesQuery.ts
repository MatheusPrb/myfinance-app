import { useQuery } from '@tanstack/react-query'
import { fetchExpenses } from '../../services/expenseService'
import { queryKeys } from '../../query/queryKeys'
import type { DateRangeFilter } from './useSpendingSummaryQuery'

const STALE_MS = 30_000
const PER_PAGE = 100

export function useCategoryExpensesQuery(
  categoryId: string | null,
  range: DateRangeFilter,
  open: boolean,
) {
  const { date_from, date_to } = range
  return useQuery({
    queryKey: queryKeys.expenses.list(1, PER_PAGE, {
      date_from,
      date_to,
      category_id: categoryId ?? '',
    }),
    queryFn: () =>
      fetchExpenses(1, PER_PAGE, {
        category_id: categoryId!,
        date_from,
        date_to,
      }),
    enabled: open && categoryId !== null,
    staleTime: STALE_MS,
  })
}
