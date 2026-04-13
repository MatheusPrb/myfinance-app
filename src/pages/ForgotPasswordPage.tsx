import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FormField } from '../components/FormField'
import { validateForgotPasswordForm } from '../utils/validation'

export function ForgotPasswordPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = email.trim()
    const clientErrors = validateForgotPasswordForm(trimmed)
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors)
      return
    }
    setFieldErrors({})
    navigate('/reset-password', {
      state: { email: trimmed, sendCodeOnArrive: true },
    })
  }

  return (
    <section className="page auth-page">
      <h1>Esqueci a senha</h1>
      <p className="muted">
        Lembrou a senha? <Link to="/login">Entrar</Link>
      </p>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <FormField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          error={fieldErrors.email}
          autoComplete="email"
        />
        <p className="field-hint">Enviaremos um código para este email.</p>
        <button type="submit" className="button primary stretch">
          Enviar código
        </button>
      </form>
      <p className="muted auth-post-form">
        <Link to="/reset-password">Já tenho o código</Link>
      </p>
    </section>
  )
}
