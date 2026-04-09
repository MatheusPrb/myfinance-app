import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuthToken } from '../../hooks/useAuthToken'
import { useCurrentUserQuery, useLogoutMutation } from '../../hooks/api'

export function AppShell() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const token = useAuthToken()
  const hasToken = token !== null
  const userQuery = useCurrentUserQuery(hasToken)
  const logoutMutation = useLogoutMutation()
  const isAdmin = userQuery.data?.is_admin === true
  const isGuestHome = pathname === '/' && !hasToken
  const isAuthPage = pathname === '/login' || pathname === '/register'

  async function handleLogout() {
    try {
      await logoutMutation.mutateAsync()
    } catch {
      /* onSettled ainda limpa token e cache */
    }
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
              {isAdmin ? (
                <>
                  <Link
                    to="/admin/categories"
                    data-active={pathname.startsWith('/admin/categories') ? 'true' : undefined}
                  >
                    Categorias
                  </Link>
                  <Link
                    to="/admin/subcategories"
                    data-active={pathname.startsWith('/admin/subcategories') ? 'true' : undefined}
                  >
                    Subcategorias
                  </Link>
                </>
              ) : null}
            </>
          ) : null}
          {!hasToken ? (
            <>
              <Link to="/login">Entrar</Link>
              <Link to="/register">Cadastrar</Link>
            </>
          ) : (
            <button
              type="button"
              className="nav-text-btn"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? 'Saindo…' : 'Sair'}
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
