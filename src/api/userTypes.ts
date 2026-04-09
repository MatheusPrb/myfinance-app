/** Resposta de `GET /api/user` (Laravel — modelo User em JSON). */
export type CurrentUserDto = {
  id: string
  name: string
  email: string
  is_admin?: boolean
}
