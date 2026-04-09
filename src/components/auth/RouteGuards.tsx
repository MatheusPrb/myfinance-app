import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthToken } from '../../hooks/useAuthToken'

export function RequireAuth() {
  const location = useLocation()
  const token = useAuthToken()
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}

export function GuestOnly() {
  const token = useAuthToken()
  if (token) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}
