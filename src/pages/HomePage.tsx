import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthToken } from '../hooks/useAuthToken'
import { useSpendingSummaryBySubcategoryQuery, useSpendingSummaryQuery } from '../hooks/api'
import { formatBRL, formatIsoDateBr } from '../utils/format'
import { parseApiError } from '../utils/apiError'
import { currentMonthRange } from '../utils/dateRange'
import { HomeCategoryRow } from './home/HomeCategoryRow'
import { HomeSubcategoryRow } from './home/HomeSubcategoryRow'

type HomeGroupMode = 'category' | 'subcategory'

export function HomePage() {
  const token = useAuthToken()
  const hasToken = token !== null

  const [range, setRange] = useState(() => currentMonthRange())
  const [groupMode, setGroupMode] = useState<HomeGroupMode>('category')
  const [expandedKey, setExpandedKey] = useState<string | null>(null)

  const summaryQuery = useSpendingSummaryQuery(hasToken && groupMode === 'category', range)
  const subSummaryQuery = useSpendingSummaryBySubcategoryQuery(hasToken && groupMode === 'subcategory', range)

  useEffect(() => {
    setExpandedKey(null)
  }, [range.date_from, range.date_to, groupMode])

  if (!hasToken) {
    return (
      <section className="landing" aria-labelledby="landing-title">
        <div className="landing-inner">
          <p className="landing-eyebrow">Controle financeiro simples</p>
          <h1 id="landing-title" className="landing-title">
            Seu dinheiro, <span className="landing-title-accent">organizado</span>
          </h1>
          <p className="landing-lead">
            Conecte-se à API, registre gastos e acompanhe totais e categorias em tempo real — no celular ou no
            computador.
          </p>
          <ul className="landing-features">
            <li>
              <span className="landing-feature-icon" aria-hidden>
                ◆
              </span>
              <span className="landing-feature-text">
                <strong>Resumo</strong>
                <span>Totais e por categoria</span>
              </span>
            </li>
            <li>
              <span className="landing-feature-icon" aria-hidden>
                ◆
              </span>
              <span className="landing-feature-text">
                <strong>Lista</strong>
                <span>Gastos paginados</span>
              </span>
            </li>
            <li>
              <span className="landing-feature-icon" aria-hidden>
                ◆
              </span>
              <span className="landing-feature-text">
                <strong>Rápido</strong>
                <span>React + API Laravel</span>
              </span>
            </li>
          </ul>
          <div className="landing-card">
            <div className="landing-cta">
              <Link to="/login" className="button button-lg primary stretch">
                Entrar
              </Link>
              <Link to="/register" className="button button-lg secondary stretch">
                Criar conta
              </Link>
            </div>
            <p className="landing-foot muted">Após entrar, você vê o painel com resumo e acesso à lista completa.</p>
          </div>
        </div>
      </section>
    )
  }

  const summary = summaryQuery.data
  const subSummary = subSummaryQuery.data
  const activePending =
    groupMode === 'category' ? summaryQuery.isPending : subSummaryQuery.isPending
  const activeError =
    groupMode === 'category' ? summaryQuery.error : subSummaryQuery.error
  const errorMessage = activeError ? parseApiError(activeError).message : ''

  return (
    <section className="page home-dashboard">
      <header className="page-header page-header-stack">
        <div>
          <h1>Visão geral</h1>
          <p className="page-subtitle muted home-dashboard-subtitle">
            {groupMode === 'category' ? 'Resumo por categoria' : 'Resumo por subcategoria'} de{' '}
            <span className="home-dashboard-subtitle-dates">
              {formatIsoDateBr(range.date_from)} a {formatIsoDateBr(range.date_to)}
            </span>
            .
          </p>
        </div>
        <div className="header-actions">
          <Link to="/expenses/new" className="button primary">
            Novo gasto
          </Link>
          <Link
            to={`/expenses?date_from=${encodeURIComponent(range.date_from)}&date_to=${encodeURIComponent(range.date_to)}`}
            className="button secondary"
          >
            Ver todos
          </Link>
        </div>
      </header>

      <div className="home-group-toggle" role="group" aria-label="Agrupamento do resumo">
        <button
          type="button"
          className={`button secondary home-group-toggle-btn${groupMode === 'category' ? ' home-group-toggle-btn--active' : ''}`}
          aria-pressed={groupMode === 'category'}
          onClick={() => setGroupMode('category')}
        >
          Por categoria
        </button>
        <button
          type="button"
          className={`button secondary home-group-toggle-btn${groupMode === 'subcategory' ? ' home-group-toggle-btn--active' : ''}`}
          aria-pressed={groupMode === 'subcategory'}
          onClick={() => setGroupMode('subcategory')}
        >
          Por subcategoria
        </button>
      </div>

      <div className="home-date-filter">
        <label className="home-date-field">
          <span className="home-date-label">De</span>
          <input
            type="date"
            className="input-date"
            value={range.date_from}
            onChange={(e) => setRange((r) => ({ ...r, date_from: e.target.value }))}
          />
        </label>
        <label className="home-date-field">
          <span className="home-date-label">Até</span>
          <input
            type="date"
            className="input-date"
            value={range.date_to}
            onChange={(e) => setRange((r) => ({ ...r, date_to: e.target.value }))}
          />
        </label>
        <button
          type="button"
          className="button secondary home-date-filter-reset"
          onClick={() => setRange(currentMonthRange())}
        >
          Este mês
        </button>
      </div>

      {errorMessage ? (
        <p className="form-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {activePending ? (
        <p className="muted">Carregando resumo…</p>
      ) : groupMode === 'category' && summary ? (
        <>
          <div className="summary-hero">
            <p className="summary-hero-label">Total no período</p>
            <p className="summary-hero-value">{formatBRL(summary.total)}</p>
          </div>

          {summary.by_category.length > 0 ? (
            <>
              <h2 className="section-title">Por categoria</h2>
              <p className="muted section-hint">
                Clique em uma categoria para ver descrição, subcategoria e valor de cada gasto.
              </p>
              <ul className="category-chips category-chips--stack">
                {summary.by_category.map((row) => {
                  const key = `c:${row.category_id}`
                  const open = expandedKey === key
                  return (
                    <HomeCategoryRow
                      key={row.category_id}
                      row={row}
                      range={range}
                      open={open}
                      onToggle={() => setExpandedKey(open ? null : key)}
                    />
                  )
                })}
              </ul>
            </>
          ) : (
            <p className="muted empty-hint">Nenhum gasto neste período. Ajuste as datas ou cadastre um gasto.</p>
          )}
        </>
      ) : groupMode === 'subcategory' && subSummary ? (
        <>
          <div className="summary-hero">
            <p className="summary-hero-label">Total no período</p>
            <p className="summary-hero-value">{formatBRL(subSummary.total)}</p>
          </div>

          {subSummary.by_subcategory.length > 0 ? (
            <>
              <h2 className="section-title">Por subcategoria</h2>
              <p className="muted section-hint">
                Só aparecem gastos com subcategoria. Clique na linha para expandir e ver descrição e valor de cada um.
              </p>
              <ul className="category-chips category-chips--stack">
                {subSummary.by_subcategory.map((row) => {
                  const key = `s:${row.subcategory_id}`
                  const open = expandedKey === key
                  return (
                    <HomeSubcategoryRow
                      key={key}
                      row={row}
                      range={range}
                      open={open}
                      onToggle={() => setExpandedKey(open ? null : key)}
                    />
                  )
                })}
              </ul>
            </>
          ) : (
            <p className="muted empty-hint">Nenhum gasto neste período. Ajuste as datas ou cadastre um gasto.</p>
          )}
        </>
      ) : null}
    </section>
  )
}
