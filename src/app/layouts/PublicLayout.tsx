import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../providers/useAuth'

const publicMenu = [
  { to: '/', label: 'Home' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/quienes-somos', label: 'Quienes somos' },
  { to: '/contactanos', label: 'Contactanos' },
  { to: '/registro-clientes', label: 'Registro de clientes' },
]

export function PublicLayout() {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="brand-block">
          <span className="brand-kicker">Proyecto IA</span>
          <h1>Soporte TI Integral</h1>
        </div>

        <div className="menu-access-row">
          <nav className="main-nav" aria-label="Menu principal">
            {publicMenu.map((item) => (
              <NavLink key={item.to} to={item.to} className="nav-link">
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="auth-actions auth-card">
            {!isAuthenticated && (
              <>
                <NavLink to="/login" className="button button-primary">
                  Iniciar sesion
                </NavLink>
                <NavLink to="/login?tab=register" className="button button-secondary">
                  Registrarme
                </NavLink>
              </>
            )}

            {isAuthenticated && user && (
              <>
                <span className="small-note">{user.email}</span>
                <NavLink to="/dashboard" className="button button-primary">
                  Dashboard
                </NavLink>
                <button type="button" className="button button-secondary" onClick={logout}>
                  Cerrar sesion
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>
    </div>
  )
}
