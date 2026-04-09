import { Link } from 'react-router-dom'
import { readStoredToken } from '../hooks/useAuthToken'
import { useSpendingSummaryQuery } from '../hooks/api'
import { formatBRL } from '../utils/format'
import { parseApiError } from '../utils/apiError'

export function HomePage() {
  const token = readStoredToken()
  const hasToken = token !== null

  const summaryQuery = useSpendingSummaryQuery(hasToken)

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
  const errorMessage = summaryQuery.isError ? parseApiError(summaryQuery.error).message : ''

  return (
    <section className="page home-dashboard">
      <header className="page-header page-header-stack">
        <div>
          <h1>Visão geral</h1>
          <p className="page-subtitle muted">Resumo dos seus gastos na API.</p>
        </div>
        <div className="header-actions">
          <Link to="/expenses/new" className="button primary">
            Novo gasto
          </Link>
          <Link to="/expenses" className="button secondary">
            Ver todos
          </Link>
        </div>
      </header>

      {errorMessage ? (
        <p className="form-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {summaryQuery.isPending ? (
        <p className="muted">Carregando resumo…</p>
      ) : summary ? (
        <>
          <div className="summary-hero">
            <p className="summary-hero-label">Total gasto</p>
            <p className="summary-hero-value">{formatBRL(summary.total)}</p>
          </div>

          {summary.by_category.length > 0 ? (
            <>
              <h2 className="section-title">Por categoria</h2>
              <ul className="category-chips">
                {summary.by_category.map((row) => (
                  <li key={row.category_id} className="category-chip">
                    <span className="category-chip-name">{row.category_name}</span>
                    <span className="category-chip-total">{formatBRL(row.total)}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="muted empty-hint">Ainda não há gastos. Cadastre um para ver o total por categoria.</p>
          )}
        </>
      ) : null}
    </section>
  )
}
