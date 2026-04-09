import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../../query/queryKeys'
import { createSubcategory } from '../../services/adminService'

export function useCreateSubcategoryMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...queryKeys.all, 'admin', 'subcategory', 'create'],
    mutationFn: ({ categoryId, name }: { categoryId: string; name: string }) =>
      createSubcategory(categoryId, name),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.categories() })
      await queryClient.invalidateQueries({ queryKey: queryKeys.subcategories(variables.categoryId) })
    },
  })
}
