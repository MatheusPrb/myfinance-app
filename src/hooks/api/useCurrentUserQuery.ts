import { useQuery } from '@tanstack/react-query'
import { fetchCurrentUser } from '../../services/userService'
import { queryKeys } from '../../query/queryKeys'

const STALE_MS = 60_000

export function useCurrentUserQuery(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.user.me(),
    queryFn: fetchCurrentUser,
    enabled,
    staleTime: STALE_MS,
  })
}
