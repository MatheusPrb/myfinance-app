import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminLogsQuery } from '../hooks/api'
import { formatDateTime } from '../utils/format'
import { parseApiError } from '../utils/apiError'
import type { AdminLogRow } from '../api/logTypes'

const PER_PAGE = 25

function formatProperties(value: AdminLogRow['properties']): string {
  if (value == null || value === '') return '—'
  if (typeof value === 'string') {
    const t = value.trim()
    return t.length > 120 ? `${t.slice(0, 120)}…` : t
  }
  try {
    const s = JSON.stringify(value)
    return s.length > 120 ? `${s.slice(0, 120)}…` : s
  } catch {
    return '—'
  }
}

export function AdminLogsPage() {
  const [page, setPage] = useState(1)
  const listQuery = useAdminLogsQuery(page, PER_PAGE)

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
  const refreshing = listQuery.isFetching && !listQuery.isPending

  return (
    <section className="page logs-page">
      <header className="page-header">
        <div>
          <Link to="/" className="link-back">
            ← Início
          </Link>
          <h1>Logs do sistema</h1>
          <p className="page-subtitle muted">
            Leitura da tabela de log. Atualização automática a cada ~12s. Somente administradores.
            {refreshing ? <span className="logs-refresh-hint"> Atualizando…</span> : null}
          </p>
        </div>
        <div className="header-actions logs-header-actions">
          <button type="button" className="button secondary" disabled={listQuery.isFetching} onClick={() => listQuery.refetch()}>
            {listQuery.isFetching ? 'Carregando…' : 'Atualizar agora'}
          </button>
        </div>
      </header>

      {errorMessage ? (
        <p className="form-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {loading ? (
        <p className="muted list-placeholder">Carregando logs…</p>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-title">Nenhum registro</p>
          <p className="muted">Não há linhas na tabela de log ou a API ainda não expõe este recurso.</p>
        </div>
      ) : (
        <>
          <p className="logs-meta muted" aria-live="polite">
            {total} registro{total === 1 ? '' : 's'} — página {page} de {lastPage}
          </p>
          <div className="logs-table-wrap">
            <table className="logs-table">
              <thead>
                <tr>
                  <th scope="col">Data</th>
                  <th scope="col">Usuário</th>
                  <th scope="col">Ação</th>
                  <th scope="col" className="logs-col-wide">
                    Detalhe
                  </th>
                  <th scope="col" className="logs-col-narrow">
                    Alvo
                  </th>
                  <th scope="col" className="logs-col-narrow">
                    IP
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.id}>
                    <td className="logs-cell-nowrap">{formatDateTime(row.created_at)}</td>
                    <td>{row.user_name?.trim() || row.user_id || '—'}</td>
                    <td className="logs-cell-mono">{row.action || '—'}</td>
                    <td className="logs-cell-break">
                      {row.description?.trim() || formatProperties(row.properties)}
                    </td>
                    <td className="logs-cell-small logs-col-narrow">
                      {[row.subject_type, row.subject_id].filter(Boolean).join(' · ') || '—'}
                    </td>
                    <td className="logs-cell-mono logs-cell-small logs-col-narrow">{row.ip_address || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {lastPage > 1 ? (
            <nav className="pagination" aria-label="Paginação dos logs">
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
