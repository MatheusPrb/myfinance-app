import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { readStoredToken } from '../../hooks/useAuthToken'

export function RequireAuth() {
  const location = useLocation()
  if (!readStoredToken()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}

export function GuestOnly() {
  if (readStoredToken()) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}
