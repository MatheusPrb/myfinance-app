import { useQueryClient } from '@tanstack/react-query'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { clearAuthToken, readStoredToken } from '../../hooks/useAuthToken'

export function AppShell() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const token = readStoredToken()
  const hasToken = token !== null
  const isGuestHome = pathname === '/' && !hasToken
  const isAuthPage = pathname === '/login' || pathname === '/register'

  function handleLogout() {
    clearAuthToken()
    queryClient.clear()
    navigate('/')
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="brand">
          MyFinance
        </Link>
        <nav className="app-nav">
          <Link to="/" data-active={pathname === '/' ? 'true' : undefined}>
            Início
          </Link>
          {hasToken ? (
            <>
              <Link to="/expenses" data-active={pathname.startsWith('/expenses') ? 'true' : undefined}>
                Gastos
              </Link>
              <Link to="/expenses/new" data-active={pathname === '/expenses/new' ? 'true' : undefined}>
                Novo
              </Link>
            </>
          ) : null}
          {!hasToken ? (
            <>
              <Link to="/login">Entrar</Link>
              <Link to="/register">Cadastrar</Link>
            </>
          ) : (
            <button type="button" className="nav-text-btn" onClick={handleLogout}>
              Sair
            </button>
          )}
        </nav>
      </header>
      <main
        className={['app-main', isGuestHome && 'app-main--landing', isAuthPage && 'app-main--auth']
          .filter(Boolean)
          .join(' ')}
        data-path={pathname}
        data-landing={isGuestHome ? 'true' : undefined}
      >
        <Outlet />
      </main>
    </div>
  )
}
