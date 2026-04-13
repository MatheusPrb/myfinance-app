import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { FormField } from '../components/FormField'
import { useCreateCategoryMutation } from '../hooks/api'
import { parseApiError } from '../utils/apiError'

export function AdminCategoriesPage() {
  const [name, setName] = useState('')
  const [formError, setFormError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState('')

  const mutation = useCreateCategoryMutation()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError('')
    setSuccess('')
    setFieldErrors({})
    const trimmed = name.trim()
    if (!trimmed) {
      setFieldErrors({ name: 'Informe o nome da categoria.' })
      return
    }
    try {
      await mutation.mutateAsync(trimmed)
      setName('')
      setSuccess('Categoria cadastrada.')
    } catch (err) {
      const { message, fieldErrors: fe } = parseApiError(err)
      setFormError(message)
      setFieldErrors(fe)
    }
  }

  return (
    <section className="page new-expense-page">
      <header className="page-header">
        <div>
          <Link to="/" className="link-back">
            ← Início
          </Link>
          <h1>Nova categoria</h1>
          <p className="page-subtitle muted">Apenas administradores. Nome único no sistema.</p>
          <p className="admin-page-crosslink muted">
            <Link to="/admin/subcategories">Ir para subcategorias</Link>
          </p>
        </div>
      </header>

      {success ? (
        <p className="success-banner" role="status">
          {success}
        </p>
      ) : null}

      <form className="auth-form expense-form" onSubmit={handleSubmit} noValidate>
        {formError ? (
          <p className="form-error" role="alert">
            {formError}
          </p>
        ) : null}
        <FormField
          id="name"
          label="Nome da categoria"
          value={name}
          onChange={setName}
          error={fieldErrors.name}
          disabled={mutation.isPending}
          autoComplete="off"
          placeholder="Ex.: Alimentação"
        />
        <button type="submit" className="button primary stretch" disabled={mutation.isPending}>
          {mutation.isPending ? 'Salvando…' : 'Cadastrar categoria'}
        </button>
      </form>
    </section>
  )
}
