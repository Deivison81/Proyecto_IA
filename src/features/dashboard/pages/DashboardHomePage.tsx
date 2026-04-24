import { useAuth } from '../../../app/providers/useAuth'
import { ROLE_DASHBOARD_PATHS, ROLE_LABELS } from '../../../types/auth'
import { NavLink } from 'react-router-dom'

export function DashboardHomePage() {
  const { user } = useAuth()

  return (
    <section className="panel">
      <h3>Resumen</h3>
      <p>
        Sesion activa como: <strong>{user ? ROLE_LABELS[user.role] : 'Sin rol'}</strong>
      </p>
      <p>
        Esta vista confirma que la proteccion de rutas y el enrutamiento por rol
        ya estan activos.
      </p>
      {user && (
        <NavLink to={ROLE_DASHBOARD_PATHS[user.role]} className="button button-primary">
          Ir a dashboard personalizado
        </NavLink>
      )}
    </section>
  )
}
