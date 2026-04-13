import { useState } from 'react'
import type { FormEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { FormField } from '../components/FormField'
import { storeAuthToken } from '../hooks/useAuthToken'
import { useLoginMutation, useRegisterMutation } from '../hooks/api'
import { queryKeys } from '../query/queryKeys'
import { parseApiError } from '../utils/apiError'
import { validateRegisterForm } from '../utils/validation'

export function RegisterPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const registerMutation = useRegisterMutation()
  const loginMutation = useLoginMutation()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')

  const loading = registerMutation.isPending || loginMutation.isPending

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError('')
    const trimmedEmail = email.trim()
    const clientErrors = validateRegisterForm(name, trimmedEmail, password)
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors)
      return
    }
    setFieldErrors({})
    try {
      await registerMutation.mutateAsync({
        name: name.trim(),
        email: trimmedEmail,
        password,
      })
    } catch (err) {
      const { message, fieldErrors: serverFields } = parseApiError(err)
      setFormError(message)
      setFieldErrors(serverFields)
      return
    }
    try {
      const token = await loginMutation.mutateAsync({
        email: trimmedEmail,
        password,
      })
      storeAuthToken(token)
      await queryClient.invalidateQueries({ queryKey: queryKeys.all })
      navigate('/', { replace: true })
    } catch {
      navigate('/login', { state: { registered: true } })
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
          {registerMutation.isPending
            ? 'Cadastrando…'
            : loginMutation.isPending
              ? 'Entrando…'
              : 'Cadastrar'}
        </button>
      </form>
    </section>
  )
}
