import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../../query/queryKeys'
import { createCategory } from '../../services/adminService'

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...queryKeys.all, 'admin', 'category', 'create'],
    mutationFn: (name: string) => createCategory(name),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.categories() })
    },
  })
}
