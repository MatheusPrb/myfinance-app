import { useQuery } from '@tanstack/react-query'
import { fetchExpense } from '../../services/expenseService'
import { queryKeys } from '../../query/queryKeys'

const STALE_MS = 60_000

export function useExpenseQuery(expenseId: string | undefined, idValid: boolean) {
  const hasId = Boolean(expenseId)

  return useQuery({
    queryKey: hasId ? queryKeys.expenses.detail(expenseId!) : queryKeys.expenses.detailNone(),
    queryFn: () => fetchExpense(expenseId!),
    enabled: hasId && idValid,
    staleTime: STALE_MS,
  })
}
