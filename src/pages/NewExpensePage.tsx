import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FormField } from '../components/FormField'
import { SelectField } from '../components/SelectField'
import { useCategoriesQuery, useCreateExpenseMutation, useSubcategoriesQuery } from '../hooks/api'
import { parseApiError } from '../utils/apiError'

function parseMoneyInput(raw: string): number | null {
  const t = raw.trim().replace(/\s/g, '').replace(',', '.')
  if (t === '') return null
  const n = Number.parseFloat(t)
  if (!Number.isFinite(n) || n <= 0) return null
  return Math.round(n * 100) / 100
}

function toOptions(items: { id: string; name: string }[]) {
  return items.map((c) => ({ value: c.id, label: c.name }))
}

export function NewExpensePage() {
  const navigate = useNavigate()
  const [categoryId, setCategoryId] = useState('')
  const [subcategoryId, setSubcategoryId] = useState('')
  const [description, setDescription] = useState('')
  const [valueStr, setValueStr] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')

  const categoriesQuery = useCategoriesQuery()
  const subcategoriesQuery = useSubcategoriesQuery(categoryId)
  const createMutation = useCreateExpenseMutation()

  const categories = categoriesQuery.data ?? []
  const subcategories = subcategoriesQuery.data ?? []

  function handleCategoryChange(value: string) {
    setCategoryId(value)
    setSubcategoryId('')
    setFormError('')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError('')
    const next: Record<string, string> = {}
    if (!categoryId) next.category_id = 'Escolha uma categoria.'
    const value = parseMoneyInput(valueStr)
    if (value === null) next.value = 'Informe um valor maior que zero (use ponto ou vírgula para centavos).'
    if (description.trim().length < 1) next.description = 'Descreva o gasto.'

    if (Object.keys(next).length > 0) {
      setFieldErrors(next)
      return
    }
    setFieldErrors({})
    try {
      const created = await createMutation.mutateAsync({
        category_id: categoryId,
        subcategory_id: subcategoryId || null,
        description: description.trim(),
        value: value!,
      })
      navigate(`/expenses/${created.id}`, { replace: true })
    } catch (err) {
      const { message, fieldErrors: serverFields } = parseApiError(err)
      setFormError(message)
      setFieldErrors(serverFields)
    }
  }

  const categoriesError = categoriesQuery.isError ? parseApiError(categoriesQuery.error).message : ''
  const subError = subcategoriesQuery.isError ? parseApiError(subcategoriesQuery.error).message : ''

  const loadingCategories = categoriesQuery.isPending
  const loadingSubcategories = Boolean(categoryId) && subcategoriesQuery.isPending
  const saving = createMutation.isPending

  const categoryDisabled = saving || loadingCategories || categories.length === 0
  const subDisabled = saving || !categoryId || loadingSubcategories || categoriesError !== ''

  return (
    <section className="page new-expense-page">
      <header className="page-header page-header-stack">
        <div>
          <Link to="/expenses" className="link-back">
            ← Lista de gastos
          </Link>
          <h1>Novo gasto</h1>
          <p className="page-subtitle muted">Escolha categoria e subcategoria, descreva o gasto e informe o valor.</p>
        </div>
      </header>

      {categoriesError ? (
        <p className="form-error" role="alert">
          {categoriesError}
        </p>
      ) : null}
      {subError && categoryId ? (
        <p className="form-error" role="alert">
          {subError}
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
          onChange={handleCategoryChange}
          options={toOptions(categories)}
          disabled={categoryDisabled}
          error={fieldErrors.category_id}
          emptyOption={{
            value: '',
            label: loadingCategories ? 'Carregando categorias…' : 'Selecione uma categoria',
          }}
        />
        <SelectField
          id="subcategory_id"
          label="Subcategoria"
          value={subcategoryId}
          onChange={setSubcategoryId}
          options={toOptions(subcategories)}
          disabled={subDisabled}
          error={fieldErrors.subcategory_id}
          emptyOption={{
            value: '',
            label: !categoryId
              ? 'Primeiro escolha uma categoria'
              : loadingSubcategories
                ? 'Carregando…'
                : 'Nenhuma (opcional)',
          }}
          hint="Opcional. Só aparecem subcategorias da categoria selecionada."
        />
        <FormField
          id="description"
          label="Descrição"
          value={description}
          onChange={setDescription}
          error={fieldErrors.description}
          disabled={saving}
          autoComplete="off"
          placeholder="Ex.: Corrida até o trabalho"
        />
        <FormField
          id="value"
          label="Valor (R$)"
          type="text"
          inputMode="decimal"
          value={valueStr}
          onChange={setValueStr}
          error={fieldErrors.value}
          disabled={saving}
          placeholder="24,50"
        />
        <button type="submit" className="button primary stretch" disabled={saving || !!categoriesError}>
          {saving ? 'Salvando…' : 'Salvar gasto'}
        </button>
      </form>
    </section>
  )
}
