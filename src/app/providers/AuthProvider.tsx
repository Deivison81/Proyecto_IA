import { useMemo, useState, type ReactNode } from 'react'
import {
  AuthContext,
  SESSION_HOURS,
  STORAGE_KEY,
  type AuthContextValue,
  type AuthSession,
} from './auth-context'
import { loginWithApi, registerWithApi } from '../../features/auth/auth-api'

function readStoredSession() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    return null
  }

  try {
    const parsed = JSON.parse(stored) as AuthSession
    if (Date.now() >= parsed.expiresAt) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return parsed
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(readStoredSession)
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session?.user),
      isAuthenticating,
      login: async (credentials) => {
        setIsAuthenticating(true)
        try {
          const result = await loginWithApi(credentials)

          const nextSession: AuthSession = {
            user: result.user,
            token: result.accessToken,
            expiresAt: Date.now() + SESSION_HOURS * 60 * 60 * 1000,
          }

          setSession(nextSession)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession))
          setIsAuthenticating(false)

          return { ok: true, role: result.user.role }
        } catch (error) {
          setIsAuthenticating(false)
          return {
            ok: false,
            error: error instanceof Error ? error.message : 'No fue posible iniciar sesion.',
          }
        }
      },
      register: async (payload) => {
        setIsAuthenticating(true)
        try {
          await registerWithApi(payload)
          setIsAuthenticating(false)

          return { ok: true }
        } catch (error) {
          setIsAuthenticating(false)

          return {
            ok: false,
            error:
              error instanceof Error ? error.message : 'No fue posible registrar el usuario.',
          }
        }
      },
      logout: () => {
        setSession(null)
        localStorage.removeItem(STORAGE_KEY)
      },
    }),
    [session, isAuthenticating],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
