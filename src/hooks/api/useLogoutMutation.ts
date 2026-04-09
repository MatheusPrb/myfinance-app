import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logoutRequest } from '../../services/authService'
import { clearAuthToken } from '../useAuthToken'
import { queryKeys } from '../../query/queryKeys'

export function useLogoutMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...queryKeys.all, 'auth', 'logout'],
    mutationFn: logoutRequest,
    onSettled: () => {
      clearAuthToken()
      queryClient.clear()
    },
  })
}
