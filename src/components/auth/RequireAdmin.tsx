import { Navigate, Outlet } from 'react-router-dom'
import { useAuthToken } from '../../hooks/useAuthToken'
import { useCurrentUserQuery } from '../../hooks/api'

export function RequireAdmin() {
  const token = useAuthToken()
  const userQuery = useCurrentUserQuery(token !== null)

  if (token === null) {
    return <Navigate to="/login" replace />
  }

  if (userQuery.isPending) {
    return (
      <section className="page">
        <p className="muted">Verificando permissões…</p>
      </section>
    )
  }

  if (userQuery.isError || userQuery.data?.is_admin !== true) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
