import { useMutation } from '@tanstack/react-query'
import { queryKeys } from '../../query/queryKeys'
import { resetPasswordWithCode } from '../../services/authService'

type Input = { email: string; code: string; password: string }

export function useResetPasswordWithCodeMutation() {
  return useMutation({
    mutationKey: [...queryKeys.all, 'auth', 'password-reset'],
    mutationFn: ({ email, code, password }: Input) =>
      resetPasswordWithCode(email, code, password),
  })
}
