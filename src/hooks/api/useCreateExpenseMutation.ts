import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateExpensePayload } from '../../api/expenseTypes'
import { queryKeys } from '../../query/queryKeys'
import { createExpense } from '../../services/expenseService'

export function useCreateExpenseMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...queryKeys.expenses.root(), 'create'],
    mutationFn: (payload: CreateExpensePayload) => createExpense(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.expenses.root() })
    },
  })
}
