import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FormField } from '../components/FormField'
import { useRequestPasswordResetMutation, useResetPasswordWithCodeMutation } from '../hooks/api'
import { parseApiError } from '../utils/apiError'
import { validateResetPasswordForm } from '../utils/validation'

function emailFromLocationState(state: unknown): string {
  if (state && typeof state === 'object' && 'email' in state) {
    const v = (state as { email: unknown }).email
    if (typeof v === 'string') return v.trim()
  }
  return ''
}

function shouldSendCodeOnArrive(state: unknown): boolean {
  if (!state || typeof state !== 'object') return false
  return Boolean((state as { sendCodeOnArrive?: unknown }).sendCodeOnArrive)
}

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const resetMutation = useResetPasswordWithCodeMutation()
  const requestCodeMutation = useRequestPasswordResetMutation()
  const autoSendStarted = useRef(false)

  const [cameFromForgotSend] = useState(() => shouldSendCodeOnArrive(location.state))

  const [email, setEmail] = useState(() => emailFromLocationState(location.state))
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')

  const loading = resetMutation.isPending
  const sendingCode = requestCodeMutation.isPending

  useEffect(() => {
    const s = location.state as { email?: string; sendCodeOnArrive?: boolean } | null
    const trimmed = typeof s?.email === 'string' ? s.email.trim() : ''
    if (!s?.sendCodeOnArrive || !trimmed) return
    if (autoSendStarted.current) return
    autoSendStarted.current = true

    navigate(location.pathname, {
      replace: true,
      state: { email: trimmed },
    })

    requestCodeMutation
      .mutateAsync({ email: trimmed })
      .catch((err) => {
        const { message } = parseApiError(err)
        setFormError(message)
        autoSendStarted.current = false
      })
  }, [location.state, location.pathname, navigate, requestCodeMutation])

  function setCodeDigits(value: string) {
    setCode(value.replace(/\D/g, '').slice(0, 6))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError('')
    const trimmedEmail = email.trim()
    const clientErrors = validateResetPasswordForm(trimmedEmail, code, password)
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors)
      return
    }
    setFieldErrors({})
    try {
      await resetMutation.mutateAsync({
        email: trimmedEmail,
        code: code.trim(),
        password,
      })
      navigate('/login', {
        state: { passwordReset: true, email: trimmedEmail },
        replace: true,
      })
    } catch (err) {
      const { message, fieldErrors: serverFields } = parseApiError(err)
      setFormError(message)
      setFieldErrors(serverFields)
    }
  }

  return (
    <section className="page auth-page">
      <h1>{cameFromForgotSend ? 'Digite o código' : 'Nova senha'}</h1>
      <p className="muted">
        Digite o código do email e escolha uma nova senha. <Link to="/forgot-password">Pedir novo código</Link>
      </p>
      {cameFromForgotSend && sendingCode ? (
        <p className="success-banner" role="status">
          Enviando solicitação…
        </p>
      ) : null}
      {cameFromForgotSend && requestCodeMutation.isSuccess && !sendingCode ? (
        <p className="success-banner" role="status">
          Se existir uma conta com este email, você receberá um código em breve. Confira a caixa de entrada e o spam.
        </p>
      ) : null}
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {formError ? (
          <p className="form-error" role="alert">
            {formError}
          </p>
        ) : null}
        <FormField
          id="reset-email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          error={fieldErrors.email}
          autoComplete="email"
          disabled={loading}
        />
        <FormField
          id="code"
          label="Código"
          type="text"
          value={code}
          onChange={setCodeDigits}
          error={fieldErrors.code}
          autoComplete="one-time-code"
          disabled={loading}
          inputMode="numeric"
          placeholder="000000"
        />
        <FormField
          id="new-password"
          label="Nova senha"
          type="password"
          value={password}
          onChange={setPassword}
          error={fieldErrors.password}
          autoComplete="new-password"
          disabled={loading}
        />
        <p className="field-hint">Mínimo 8 caracteres, com letras e números.</p>
        <button type="submit" className="button primary stretch" disabled={loading}>
          {loading ? 'Salvando…' : 'Redefinir senha'}
        </button>
      </form>
      <p className="muted auth-post-form">
        <Link to="/login">Voltar ao login</Link>
      </p>
    </section>
  )
}
