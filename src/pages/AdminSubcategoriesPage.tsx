import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { FormField } from '../components/FormField'
import { SelectField } from '../components/SelectField'
import { useCategoriesQuery, useCreateSubcategoryMutation } from '../hooks/api'
import { parseApiError } from '../utils/apiError'

function toOptions(items: { id: string; name: string }[]) {
  return items.map((c) => ({ value: c.id, label: c.name }))
}

export function AdminSubcategoriesPage() {
  const [categoryId, setCategoryId] = useState('')
  const [name, setName] = useState('')
  const [formError, setFormError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState('')

  const categoriesQuery = useCategoriesQuery()
  const mutation = useCreateSubcategoryMutation()

  const categories = categoriesQuery.data ?? []

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError('')
    setSuccess('')
    setFieldErrors({})
    const next: Record<string, string> = {}
    if (!categoryId) next.category_id = 'Selecione a categoria.'
    const trimmed = name.trim()
    if (!trimmed) next.name = 'Informe o nome da subcategoria.'
    if (Object.keys(next).length > 0) {
      setFieldErrors(next)
      return
    }
    try {
      await mutation.mutateAsync({ categoryId, name: trimmed })
      setName('')
      setSuccess('Subcategoria cadastrada.')
    } catch (err) {
      const { message, fieldErrors: fe } = parseApiError(err)
      setFormError(message)
      setFieldErrors(fe)
    }
  }

  const categoriesError = categoriesQuery.isError ? parseApiError(categoriesQuery.error).message : ''

  return (
    <section className="page new-expense-page">
      <header className="page-header">
        <div>
          <Link to="/" className="link-back">
            ← Início
          </Link>
          <h1>Nova subcategoria</h1>
          <p className="page-subtitle muted">Escolha a categoria pai e o nome da subcategoria.</p>
          <p className="admin-page-crosslink muted">
            <Link to="/admin/categories">Ir para categorias</Link>
          </p>
        </div>
      </header>

      {categoriesError ? (
        <p className="form-error" role="alert">
          {categoriesError}
        </p>
      ) : null}

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
        <SelectField
          id="category_id"
          label="Categoria"
          value={categoryId}
          onChange={setCategoryId}
          options={toOptions(categories)}
          disabled={mutation.isPending || categoriesQuery.isPending || categories.length === 0}
          error={fieldErrors.category_id}
          emptyOption={{
            value: '',
            label: categoriesQuery.isPending ? 'Carregando categorias…' : 'Selecione uma categoria',
          }}
        />
        <FormField
          id="name"
          label="Nome da subcategoria"
          value={name}
          onChange={setName}
          error={fieldErrors.name}
          disabled={mutation.isPending}
          autoComplete="off"
          placeholder="Ex.: Supermercado"
        />
        <button
          type="submit"
          className="button primary stretch"
          disabled={mutation.isPending || !!categoriesError || categories.length === 0}
        >
          {mutation.isPending ? 'Salvando…' : 'Cadastrar subcategoria'}
        </button>
      </form>
    </section>
  )
}
