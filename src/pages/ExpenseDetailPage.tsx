import { Link, useNavigate, useParams } from 'react-router-dom'
import { useExpenseQuery } from '../hooks/api'
import { formatBRL, formatDateTime } from '../utils/format'
import { parseApiError } from '../utils/apiError'
import { isExpenseIdParam } from '../utils/uuid'

export function ExpenseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const idValid = isExpenseIdParam(id)

  const expenseQuery = useExpenseQuery(id, idValid)
  const expense = expenseQuery.data

  function handleBack() {
    navigate(-1)
  }

  if (!id || !idValid) {
    return (
      <section className="page expense-detail-page">
        <p className="form-error" role="alert">
          Gasto não encontrado.
        </p>
        <Link to="/expenses" className="button secondary">
          Voltar à lista
        </Link>
      </section>
    )
  }

  if (expenseQuery.isPending) {
    return (
      <section className="page expense-detail-page">
        <p className="muted">Carregando…</p>
      </section>
    )
  }

  if (expenseQuery.isError || !expense) {
    const message = expenseQuery.isError ? parseApiError(expenseQuery.error).message : 'Não foi possível carregar este gasto.'
    return (
      <section className="page expense-detail-page">
        <p className="form-error" role="alert">
          {message}
        </p>
        <Link to="/expenses" className="button secondary">
          Voltar à lista
        </Link>
      </section>
    )
  }

  return (
    <section className="page expense-detail-page">
      <header className="page-header page-header-stack">
        <div>
          <button type="button" className="link-back" onClick={handleBack} aria-label="Voltar">
            ← Voltar
          </button>
          <h1>Detalhe do gasto</h1>
        </div>
        <Link to="/expenses" className="button secondary">
          Lista
        </Link>
      </header>

      <article className="detail-card">
        <p className="detail-value">{formatBRL(expense.value)}</p>
        <h2 className="detail-title">{expense.description || 'Sem descrição'}</h2>
        <dl className="detail-dl">
          <div>
            <dt>Categoria</dt>
            <dd>{expense.category_name || '—'}</dd>
          </div>
          <div>
            <dt>Subcategoria</dt>
            <dd>{expense.subcategory_name ?? '—'}</dd>
          </div>
          <div>
            <dt>Criado em</dt>
            <dd>{formatDateTime(expense.created_at)}</dd>
          </div>
          <div>
            <dt>Atualizado em</dt>
            <dd>{formatDateTime(expense.updated_at)}</dd>
          </div>
        </dl>
      </article>
    </section>
  )
}
