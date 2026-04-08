import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FormField } from '../components/FormField'
import { storeAuthToken } from '../hooks/useAuthToken'
import { loginRequest } from '../services/authService'
import { parseApiError } from '../utils/apiError'
import { validateLoginForm } from '../utils/validation'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const justRegistered = Boolean(
    location.state && typeof location.state === 'object' && 'registered' in location.state,
  )
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError('')
    const clientErrors = validateLoginForm(email, password)
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors)
      return
    }
    setFieldErrors({})
    setLoading(true)
    try {
      const token = await loginRequest(email.trim(), password)
      storeAuthToken(token)
      navigate('/')
    } catch (err) {
      const { message, fieldErrors: serverFields } = parseApiError(err)
      setFormError(message)
      setFieldErrors(serverFields)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page auth-page">
      <h1>Entrar</h1>
      <p className="muted">
        Ainda não tem conta? <Link to="/register">Cadastre-se</Link>
      </p>
      {justRegistered ? (
        <p className="success-banner" role="status">
          Cadastro concluído. Entre com seu email e senha.
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
