import { useQuery } from '@tanstack/react-query'
import type { SubcategorySummaryRow } from '../../api/expenseTypes'
import { fetchExpenses } from '../../services/expenseService'
import { queryKeys } from '../../query/queryKeys'
import type { DateRangeFilter } from './useSpendingSummaryQuery'

const STALE_MS = 30_000
const PER_PAGE = 100

export function useSubcategoryExpensesQuery(
  row: SubcategorySummaryRow,
  range: DateRangeFilter,
  open: boolean,
) {
  const { date_from, date_to } = range

  return useQuery({
    queryKey: queryKeys.expenses.list(1, PER_PAGE, {
      date_from,
      date_to,
      category_id: '',
      subcategory_id: row.subcategory_id,
    }),
    queryFn: () =>
      fetchExpenses(1, PER_PAGE, {
        subcategory_id: row.subcategory_id,
        date_from,
        date_to,
      }),
    enabled: open,
    staleTime: STALE_MS,
  })
}
