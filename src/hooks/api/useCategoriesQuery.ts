import { useQuery } from '@tanstack/react-query'
import { fetchCategories } from '../../services/categoryService'
import { queryKeys } from '../../query/queryKeys'

const STALE_MS = 5 * 60_000

export function useCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.categories(),
    queryFn: fetchCategories,
    staleTime: STALE_MS,
  })
}
