import { useMutation } from '@tanstack/react-query'
import { queryKeys } from '../../query/queryKeys'
import { requestPasswordReset } from '../../services/authService'

type Input = { email: string }

export function useRequestPasswordResetMutation() {
  return useMutation({
    mutationKey: [...queryKeys.all, 'auth', 'password-forgot'],
    mutationFn: ({ email }: Input) => requestPasswordReset(email),
  })
}
