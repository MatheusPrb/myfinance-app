import { useQuery } from '@tanstack/react-query'
import { fetchAdminLogs } from '../../services/adminService'
import { queryKeys } from '../../query/queryKeys'

const STALE_MS = 15_000
const POLL_MS = 12_000

export function useAdminLogsQuery(page: number, perPage: number) {
  return useQuery({
    queryKey: queryKeys.admin.logs(page, perPage),
    queryFn: () => fetchAdminLogs(page, perPage),
    staleTime: STALE_MS,
    refetchInterval: POLL_MS,
    refetchIntervalInBackground: false,
  })
}
