import { useQuery } from '@tanstack/react-query'
import { fetchExpenses } from '../../services/expenseService'
import { queryKeys } from '../../query/queryKeys'

const STALE_MS = 30_000

export function useExpensesQuery(page: number, perPage: number) {
  return useQuery({
    queryKey: queryKeys.expenses.list(page, perPage),
    queryFn: () => fetchExpenses(page, perPage),
    staleTime: STALE_MS,
  })
}
