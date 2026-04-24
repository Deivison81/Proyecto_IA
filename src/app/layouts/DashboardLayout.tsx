import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../providers/useAuth'
import { ROLE_DASHBOARD_PATHS, ROLE_LABELS } from '../../types/auth'

export function DashboardLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <p className="brand-kicker">Panel interno</p>
        <h2>{user ? ROLE_LABELS[user.role] : 'Dashboard'}</h2>

        <nav className="dashboard-nav" aria-label="Menu de dashboard">
          <NavLink to="/dashboard/resumen" className="nav-link">
            Resumen
          </NavLink>
          {user && (
            <NavLink to={ROLE_DASHBOARD_PATHS[user.role]} className="nav-link">
              Mi panel
            </NavLink>
          )}
          <NavLink to="/" className="nav-link">
            Volver al sitio publico
          </NavLink>
        </nav>

        <button type="button" className="button button-secondary" onClick={logout}>
          Cerrar sesion
        </button>
      </aside>

      <section className="dashboard-main">
        <Outlet />
      </section>
    </div>
  )
}
