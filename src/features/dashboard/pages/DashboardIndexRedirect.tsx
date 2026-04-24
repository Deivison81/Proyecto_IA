import { Navigate } from 'react-router-dom'
import { useAuth } from '../../../app/providers/useAuth'
import { ROLE_DASHBOARD_PATHS } from '../../../types/auth'

export function DashboardIndexRedirect() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to={ROLE_DASHBOARD_PATHS[user.role]} replace />
}
