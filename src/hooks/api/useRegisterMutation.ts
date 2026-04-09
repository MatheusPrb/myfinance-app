import { useMutation } from '@tanstack/react-query'
import { registerRequest } from '../../services/authService'
import { queryKeys } from '../../query/queryKeys'

type RegisterInput = { name: string; email: string; password: string }

export function useRegisterMutation() {
  return useMutation({
    mutationKey: [...queryKeys.all, 'auth', 'register'],
    mutationFn: ({ name, email, password }: RegisterInput) =>
      registerRequest(name, email, password),
  })
}
