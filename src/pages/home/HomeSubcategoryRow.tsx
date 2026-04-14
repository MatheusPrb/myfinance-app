import { Link } from 'react-router-dom'
import type { SubcategorySummaryRow } from '../../api/expenseTypes'
import { useSubcategoryExpensesQuery } from '../../hooks/api'
import { formatBRL } from '../../utils/format'
import { parseApiError } from '../../utils/apiError'
import type { DateRangeFilter } from '../../hooks/api'

type Props = {
  row: SubcategorySummaryRow
  range: DateRangeFilter
  open: boolean
  onToggle: () => void
}

export function HomeSubcategoryRow({ row, range, open, onToggle }: Props) {
  const listQuery = useSubcategoryExpensesQuery(row, range, open)
  const items = listQuery.data?.items ?? []
  const err = listQuery.isError ? parseApiError(listQuery.error).message : ''

  return (
    <li className={`category-block home-category-block${open ? ' category-block--open' : ''}`}>
      <button
        type="button"
        className="category-chip category-chip-toggle home-category-header"
        aria-expanded={open}
        aria-label={`${row.subcategory_name}, categoria ${row.category_name}`}
        onClick={onToggle}
      >
        <span className="category-chip-name home-category-header-label">{row.subcategory_name}</span>
        <span className="category-chip-total home-category-header-total">{formatBRL(row.total)}</span>
        <span className="category-chip-chevron home-category-chevron" aria-hidden>
          {open ? '▾' : '▸'}
        </span>
      </button>
      {open ? (
        <div className="category-panel home-category-panel">
          <p className="muted home-subcategory-panel-category">
            Categoria: <strong className="home-subcategory-panel-category-name">{row.category_name}</strong>
          </p>
          {listQuery.isPending ? (
            <p className="muted category-panel-status">Carregando gastos…</p>
          ) : err ? (
            <p className="form-error category-panel-status" role="alert">
              {err}
            </p>
          ) : items.length === 0 ? (
            <p className="muted category-panel-status">Nenhum gasto neste período.</p>
          ) : (
            <>
              <ul className="category-expense-list">
                {items.map((e) => (
                  <li key={e.id}>
                    <Link
                      to={`/expenses/${e.id}`}
                      className="category-expense-row home-category-expense-row home-subcategory-expense-row"
                    >
                      <span className="category-expense-desc home-category-expense-desc">
                        {e.description?.trim() || 'Sem descrição'}
                      </span>
                      <span className="category-expense-value home-category-expense-value">{formatBRL(e.value)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              {(listQuery.data?.meta.total ?? 0) > items.length ? (
                <p className="muted category-panel-foot">
                  Mostrando os {items.length} mais recentes de {listQuery.data?.meta.total}.{' '}
                  <Link
                    to={`/expenses?date_from=${encodeURIComponent(range.date_from)}&date_to=${encodeURIComponent(range.date_to)}`}
                  >
                    Ver lista completa
                  </Link>
                </p>
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </li>
  )
}
