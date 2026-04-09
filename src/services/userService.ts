import { apiSession } from '../api/client'
import type { CurrentUserDto } from '../api/userTypes'

export async function fetchCurrentUser(): Promise<CurrentUserDto> {
  const { data } = await apiSession.get<CurrentUserDto>('/user')
  return data
}
