export type UserRole =
  | 'client'
  | 'technician'
  | 'administrative'
  | 'platform_admin'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
}

export const ROLE_LABELS: Record<UserRole, string> = {
  client: 'Cliente',
  technician: 'Personal tecnico',
  administrative: 'Personal administrativo',
  platform_admin: 'Administrador de plataforma',
}

export const ROLE_DASHBOARD_PATHS: Record<UserRole, string> = {
  client: '/dashboard/cliente',
  technician: '/dashboard/tecnico',
  administrative: '/dashboard/administrativo',
  platform_admin: '/dashboard/admin-plataforma',
}
