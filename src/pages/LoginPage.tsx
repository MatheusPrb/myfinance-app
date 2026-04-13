import { useState } from 'react'
import type { FormEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FormField } from '../components/FormField'
import { storeAuthToken } from '../hooks/useAuthToken'
import { useLoginMutation } from '../hooks/api'
import { queryKeys } from '../query/queryKeys'
import { parseApiError } from '../utils/apiError'
import { validateLoginForm } from '../utils/validation'

function emailAfterPasswordReset(state: unknown): string {
  if (!state || typeof state !== 'object') return ''
  const o = state as Record<string, unknown>
  if (!('passwordReset' in o)) return ''
  const e = o.email
  return typeof e === 'string' ? e.trim() : ''
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const loginMutation = useLoginMutation()

  const justRegistered = Boolean(
    location.state && typeof location.state === 'object' && 'registered' in location.state,
  )
  const passwordJustReset = Boolean(
    location.state && typeof location.state === 'object' && 'passwordReset' in location.state,
  )
  const [email, setEmail] = useState(() => emailAfterPasswordReset(location.state))
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')

  const loading = loginMutation.isPending

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError('')
    const clientErrors = validateLoginForm(email, password)
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors)
      return
    }
    setFieldErrors({})
    try {
      const token = await loginMutation.mutateAsync({
        email: email.trim(),
        password,
      })
      storeAuthToken(token)
      await queryClient.invalidateQueries({ queryKey: queryKeys.all })
      const from = (location.state as { from?: string } | null)?.from
      const target = from && from.startsWith('/') && !from.startsWith('//') ? from : '/'
      navigate(target, { replace: true })
    } catch (err) {
      const { message, fieldErrors: serverFields } = parseApiError(err)
      setFormError(message)
      setFieldErrors(serverFields)
    }
  }

  return (
    <section className="page auth-page">
      <header className="auth-head">
        <h1>Entrar</h1>
        <div className="auth-sub">
          <p className="muted auth-sub-lead">Ainda não tem conta?</p>
          <nav className="auth-sub-links" aria-label="Conta e recuperação de senha">
            <Link to="/register">Cadastre-se</Link>
            <span className="auth-sub-sep" aria-hidden="true">
              ·
            </span>
            <Link to="/forgot-password">Esqueci a senha</Link>
          </nav>
        </div>
      </header>
      {justRegistered ? (
        <p className="success-banner" role="status">
          Cadastro concluído. Entre com seu email e senha.
        </p>
      ) : null}
      {passwordJustReset ? (
        <p className="success-banner" role="status">
          Senha alterada. Entre com sua nova senha.
        </p>
      ) : null}
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {formError ? (
          <p className="form-error" role="alert">
            {formError}
          </p>
        ) : null}
        <FormField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          error={fieldErrors.email}
          autoComplete="email"
          disabled={loading}
        />
        <FormField
          id="password"
          label="Senha"
          type="password"
          value={password}
          onChange={setPassword}
          error={fieldErrors.password}
          autoComplete="current-password"
          disabled={loading}
        />
        <button type="submit" className="button primary stretch" disabled={loading}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </section>
  )
}
