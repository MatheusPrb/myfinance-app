import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuthToken } from '../../hooks/useAuthToken'
import { useCurrentUserQuery, useLogoutMutation } from '../../hooks/api'

const NARROW_MQ = '(max-width: 768px)'

export function AppShell() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const token = useAuthToken()
  const hasToken = token !== null
  const userQuery = useCurrentUserQuery(hasToken)
  const logoutMutation = useLogoutMutation()
  const isAdmin = userQuery.data?.is_admin === true
  const isGuestHome = pathname === '/' && !hasToken
  const isAuthPage =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password'
  const expensesNavActive =
    pathname.startsWith('/expenses') && pathname !== '/expenses/new'

  const [narrow, setNarrow] = useState(false)
  const [adminMenuOpen, setAdminMenuOpen] = useState(false)

  const useAdminDrawer = Boolean(hasToken && isAdmin && narrow)

  useEffect(() => {
    const mq = window.matchMedia(NARROW_MQ)
    const sync = () => setNarrow(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    setAdminMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!narrow) setAdminMenuOpen(false)
  }, [narrow])

  useEffect(() => {
    if (!useAdminDrawer || !adminMenuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [useAdminDrawer, adminMenuOpen])

  useEffect(() => {
    if (!adminMenuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAdminMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [adminMenuOpen])

  async function handleLogout() {
    try {
      await logoutMutation.mutateAsync()
    } catch {
      /* onSettled ainda limpa token e cache */
    }
    setAdminMenuOpen(false)
    navigate('/')
  }

  function closeAdminMenu() {
    setAdminMenuOpen(false)
  }

  const navInner = (
    <>
      <Link to="/" data-active={pathname === '/' ? 'true' : undefined} onClick={closeAdminMenu}>
        Início
      </Link>
      {hasToken ? (
        <>
          <Link
            to="/expenses"
            data-active={expensesNavActive ? 'true' : undefined}
            onClick={closeAdminMenu}
          >
            Gastos
          </Link>
          <Link
            to="/expenses/new"
            data-active={pathname === '/expenses/new' ? 'true' : undefined}
            onClick={closeAdminMenu}
          >
            Novo
          </Link>
          {isAdmin ? (
            <>
              <Link
                to="/admin/categories"
                data-active={pathname.startsWith('/admin/categories') ? 'true' : undefined}
                onClick={closeAdminMenu}
              >
                Categorias
              </Link>
              <Link
                to="/admin/subcategories"
                data-active={pathname.startsWith('/admin/subcategories') ? 'true' : undefined}
                onClick={closeAdminMenu}
              >
                Subcategorias
              </Link>
              <Link
                to="/admin/logs"
                data-active={pathname.startsWith('/admin/logs') ? 'true' : undefined}
                onClick={closeAdminMenu}
              >
                Logs
              </Link>
            </>
          ) : null}
        </>
      ) : null}
      {!hasToken ? (
        <>
          <Link to="/login" onClick={closeAdminMenu}>
            Entrar
          </Link>
          <Link to="/register" onClick={closeAdminMenu}>
            Cadastrar
          </Link>
        </>
      ) : (
        <button
          type="button"
          className="nav-text-btn"
          onClick={() => {
            void handleLogout()
          }}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? 'Saindo…' : 'Sair'}
        </button>
      )}
    </>
  )

  return (
    <div className="app-shell">
      <header
        className={[
          'app-header',
          useAdminDrawer ? 'app-header--admin-drawer' : '',
          !hasToken && narrow ? 'app-header--guest-mobile' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {useAdminDrawer ? (
          <>
            <div className="app-header-admin-bar">
              <Link to="/" className="brand" onClick={closeAdminMenu}>
                MyFinance
              </Link>
              <button
                type="button"
                className="app-header-menu-btn"
                aria-expanded={adminMenuOpen}
                aria-controls={adminMenuOpen ? 'app-main-nav' : undefined}
                aria-label={adminMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                onClick={() => setAdminMenuOpen((o) => !o)}
              >
                <span className="app-header-menu-bars" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
              </button>
            </div>
            {adminMenuOpen
              ? createPortal(
                  <div className="app-admin-menu-portal">
                    <button
                      type="button"
                      className="app-nav-backdrop"
                      aria-label="Fechar menu"
                      onClick={closeAdminMenu}
                    />
                    <nav
                      className="app-nav app-nav--admin-portal"
                      id="app-main-nav"
                      aria-label="Principal"
                    >
                      <div className="app-nav-drawer-top">
                        <span className="app-nav-drawer-title">Menu</span>
                        <button type="button" className="app-nav-drawer-close" onClick={closeAdminMenu}>
                          Fechar
                        </button>
                      </div>
                      <div className="app-nav-drawer-links">{navInner}</div>
                    </nav>
                  </div>,
                  document.body,
                )
              : null}
          </>
        ) : (
          <>
            <Link to="/" className="brand">
              MyFinance
            </Link>
            <nav className="app-nav" id="app-main-nav" aria-label="Principal">
              {navInner}
            </nav>
          </>
        )}
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
