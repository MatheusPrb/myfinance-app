import { useQuery } from '@tanstack/react-query'
import { fetchSubcategoriesByCategory } from '../../services/categoryService'
import { queryKeys } from '../../query/queryKeys'

const STALE_MS = 5 * 60_000

export function useSubcategoriesQuery(categoryId: string) {
  return useQuery({
    queryKey: queryKeys.subcategories(categoryId),
    queryFn: () => fetchSubcategoriesByCategory(categoryId),
    enabled: Boolean(categoryId),
    staleTime: STALE_MS,
  })
}
