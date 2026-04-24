import { createContext } from 'react'
import type { AuthUser, UserRole } from '../../types/auth'
import type { LoginInput, RegisterInput } from '../../features/auth/auth-api'

export interface LoginResult {
  ok: boolean
  role?: UserRole
  error?: string
}

export interface RegisterResult {
  ok: boolean
  error?: string
}

export interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isAuthenticating: boolean
  login: (credentials: LoginInput) => Promise<LoginResult>
  register: (payload: RegisterInput) => Promise<RegisterResult>
  logout: () => void
}

export const STORAGE_KEY = 'proyecto_ia_auth_user'
export const SESSION_HOURS = 8

export interface AuthSession {
  user: AuthUser
  token: string
  expiresAt: number
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
