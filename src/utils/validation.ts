const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string): string | undefined {
  const t = email.trim()
  if (!t) return 'O email é obrigatório'
  if (!EMAIL_RE.test(t)) return 'O email deve ser válido'
  return undefined
}

export function validateLoginForm(
  email: string,
  password: string,
): Record<string, string> {
  const errors: Record<string, string> = {}
  const emailErr = validateEmail(email)
  if (emailErr) errors.email = emailErr
  if (!password) errors.password = 'A senha é obrigatória'
  return errors
}

export function validateRegisterForm(
  name: string,
  email: string,
  password: string,
): Record<string, string> {
  const errors: Record<string, string> = {}
  const n = name.trim()
  if (!n) errors.name = 'O nome é obrigatório'
  else if (n.length > 255) errors.name = 'O nome deve ter no máximo 255 caracteres'

  const emailErr = validateEmail(email)
  if (emailErr) errors.email = emailErr

  if (!password) errors.password = 'A senha é obrigatória'
  else {
    if (password.length < 8) errors.password = 'A senha deve ter no mínimo 8 caracteres'
    else if (!/[a-zA-Z]/.test(password))
      errors.password = 'A senha deve conter pelo menos uma letra'
    else if (!/\d/.test(password))
      errors.password = 'A senha deve conter pelo menos um número'
  }

  return errors
}
