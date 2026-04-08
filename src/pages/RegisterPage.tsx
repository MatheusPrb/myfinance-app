import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FormField } from '../components/FormField'
import { registerRequest } from '../services/authService'
import { parseApiError } from '../utils/apiError'
import { validateRegisterForm } from '../utils/validation'

export function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError('')
    const clientErrors = validateRegisterForm(name, email, password)
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors)
      return
    }
    setFieldErrors({})
    setLoading(true)
    try {
      await registerRequest(name.trim(), email.trim(), password)
      navigate('/login', { state: { registered: true } })
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
      <h1>Criar conta</h1>
      <p className="muted">
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {formError ? (
          <p className="form-error" role="alert">
            {formError}
          </p>
        ) : null}
        <FormField
          id="name"
          label="Nome"
          value={name}
          onChange={setName}
          error={fieldErrors.name}
          autoComplete="name"
          disabled={loading}
        />
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
          autoComplete="new-password"
          disabled={loading}
        />
        <p className="field-hint">Mínimo 8 caracteres, com letras e números.</p>
        <button type="submit" className="button primary stretch" disabled={loading}>
          {loading ? 'Enviando…' : 'Cadastrar'}
        </button>
      </form>
    </section>
  )
}
