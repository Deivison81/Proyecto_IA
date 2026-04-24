import type { AuthUser, UserRole } from '../../types/auth'

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  role: UserRole
  password: string
}

interface AuthApiResponse {
  accessToken: string
  tokenType: string
  user: AuthUser
}

interface ApiErrorPayload {
  message?: string | string[]
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:3001/api/v1'

async function parseError(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as ApiErrorPayload

    if (Array.isArray(payload.message)) {
      return payload.message.join('. ')
    }

    if (typeof payload.message === 'string' && payload.message.trim().length > 0) {
      return payload.message
    }
  } catch {
    return 'No fue posible completar la solicitud.'
  }

  return 'No fue posible completar la solicitud.'
}

async function requestAuth<TPayload extends LoginInput | RegisterInput>(
  path: 'login' | 'register',
  payload: TPayload,
): Promise<AuthApiResponse> {
  let response: Response

  try {
    response = await fetch(`${API_BASE_URL}/auth/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error(
      `No se pudo conectar con la API (${API_BASE_URL}). Verifica VITE_API_BASE_URL y CORS_ORIGIN.`,
    )
  }

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  return (await response.json()) as AuthApiResponse
}

export async function loginWithApi(input: LoginInput) {
  return requestAuth('login', {
    email: input.email.trim().toLowerCase(),
    password: input.password,
  })
}

export async function registerWithApi(input: RegisterInput) {
  return requestAuth('register', {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    role: input.role,
    password: input.password,
  })
}
