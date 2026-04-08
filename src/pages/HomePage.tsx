import { Link } from 'react-router-dom'
import { readStoredToken } from '../hooks/useAuthToken'

export function HomePage() {
  const token = readStoredToken()

  return (
    <section className="page home-page">
      <h1>MyFinance</h1>
      <p className="lead">Gerencie suas finanças com a API Laravel e este app React.</p>
      <div className="card-actions">
        <Link to="/login" className="button primary">
          Entrar
        </Link>
        <Link to="/register" className="button secondary">
          Criar conta
        </Link>
      </div>
      {token ? (
        <p className="success-banner">Você está autenticado. O token foi salvo no navegador.</p>
      ) : (
        <p className="muted">Use Entrar ou Cadastrar para conectar à API em <code>/api/v1</code>.</p>
      )}
    </section>
  )
}
