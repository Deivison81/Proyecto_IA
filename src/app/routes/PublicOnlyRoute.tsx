import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../providers/useAuth'
import { ROLE_DASHBOARD_PATHS } from '../../types/auth'

export function PublicOnlyRoute() {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated && user) {
    return <Navigate to={ROLE_DASHBOARD_PATHS[user.role]} replace />
  }

  return <Outlet />
}
