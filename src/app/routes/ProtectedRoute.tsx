import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../providers/useAuth'
import type { UserRole } from '../../types/auth'

interface ProtectedRouteProps {
  allowedRoles: UserRole[]
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const location = useLocation()
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
