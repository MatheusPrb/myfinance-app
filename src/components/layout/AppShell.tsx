import { Link, Outlet, useLocation } from 'react-router-dom'
import { readStoredToken } from '../../hooks/useAuthToken'

export function AppShell() {
  const { pathname } = useLocation()
  const hasToken = readStoredToken() !== null

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="brand">
          MyFinance
        </Link>
        <nav className="app-nav">
          <Link to="/">Início</Link>
          <Link to="/login">Entrar</Link>
          <Link to="/register">Cadastrar</Link>
          {hasToken ? <span className="nav-hint">Sessão ativa</span> : null}
        </nav>
      </header>
      <main className="app-main" data-path={pathname}>
        <Outlet />
      </main>
    </div>
  )
}
