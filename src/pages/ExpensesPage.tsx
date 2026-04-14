import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useExpensesQuery } from '../hooks/api'
import type { DateRangeFilter } from '../hooks/api'
import { formatBRL, formatDateTime } from '../utils/format'
import { parseApiError } from '../utils/apiError'
import { currentMonthRange, normalizeDateRange } from '../utils/dateRange'

const PER_PAGE = 15

export function ExpensesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(1)

  const range = useMemo((): DateRangeFilter => {
    const from = searchParams.get('date_from')?.trim() ?? ''
    const to = searchParams.get('date_to')?.trim() ?? ''
    if (from && to) return normalizeDateRange(from, to)
    return currentMonthRange()
  }, [searchParams])

  useEffect(() => {
    const from = searchParams.get('date_from')?.trim() ?? ''
    const to = searchParams.get('date_to')?.trim() ?? ''
    if (from && to) return
    const d = currentMonthRange()
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set('date_from', d.date_from)
        next.set('date_to', d.date_to)
        return next
      },
      { replace: true },
    )
  }, [searchParams, setSearchParams])

  useEffect(() => {
    setPage(1)
  }, [range.date_from, range.date_to])

  const listQuery = useExpensesQuery(page, PER_PAGE, range)

  const data = listQuery.data
  const items = data?.items ?? []
  const lastPage = data ? Math.max(1, data.meta.last_page) : 1
  const total = data?.meta.total ?? 0
  const errorMessage = listQuery.isError ? parseApiError(listQuery.error).message : ''

  function goTo(p: number) {
    if (p < 1 || p > lastPage || p === page) return
    setPage(p)
  }

  const loading = listQuery.isPending

  return (
    <section className="page expenses-page">
      <header className="page-header">
        <div>
          <h1>Gastos</h1>
          <p className="page-subtitle muted">
            {total === 0 && !loading
              ? 'Nenhum registro neste período.'
              : `${total} registro${total === 1 ? '' : 's'} · ${range.date_from} — ${range.date_to}`}
          </p>
        </div>
        <Link to="/expenses/new" className="button primary">
          Novo gasto
        </Link>
      </header>

      {errorMessage ? (
        <p className="form-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {loading ? (
        <p className="muted list-placeholder">Carregando…</p>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-title">Sem gastos por aqui</p>
          <p className="muted">Cadastre o primeiro para ver o resumo na página inicial.</p>
          <Link to="/expenses/new" className="button primary">
            Registrar gasto
          </Link>
        </div>
      ) : (
        <>
          <ul className="expense-list">
            {items.map((e) => (
              <li key={e.id}>
                <Link to={`/expenses/${e.id}`} className="expense-card">
                  <div className="expense-card-main">
                    <span className="expense-desc">{e.description || 'Sem descrição'}</span>
                    {e.category_name ? <span className="expense-cat">{e.category_name}</span> : null}
                    <span className="expense-meta">{formatDateTime(e.created_at)}</span>
                  </div>
                  <span className="expense-value">{formatBRL(e.value)}</span>
                </Link>
              </li>
            ))}
          </ul>
          {lastPage > 1 ? (
            <nav className="pagination" aria-label="Paginação">
              <button type="button" className="button secondary" disabled={page <= 1} onClick={() => goTo(page - 1)}>
                Anterior
              </button>
              <span className="pagination-status">
                Página {page} de {lastPage}
              </span>
              <button
                type="button"
                className="button secondary"
                disabled={page >= lastPage}
                onClick={() => goTo(page + 1)}
              >
                Próxima
              </button>
            </nav>
          ) : null}
        </>
      )}
    </section>
  )
}
