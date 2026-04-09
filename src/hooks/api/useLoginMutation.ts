import { useMutation } from '@tanstack/react-query'
import { loginRequest } from '../../services/authService'
import { queryKeys } from '../../query/queryKeys'

type LoginInput = { email: string; password: string }

/** Invalidação pós-login fica no componente (após `storeAuthToken`) para o token já ir nas refetches. */
export function useLoginMutation() {
  return useMutation({
    mutationKey: [...queryKeys.all, 'auth', 'login'],
    mutationFn: ({ email, password }: LoginInput) => loginRequest(email, password),
  })
}
