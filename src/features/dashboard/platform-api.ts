import type { UserRole } from '../../types/auth'

export interface PlatformUserResponse {
  id: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
  createdAt: string
}

export interface UpdatePlatformUserPayload {
  role?: UserRole
  isActive?: boolean
}

export type CatalogCategory = 'service' | 'priority' | 'status'

export interface CatalogItemResponse {
  id: string
  category: CatalogCategory
  value: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CatalogsResponse {
  services: string[]
  priorities: string[]
  statuses: string[]
  items: CatalogItemResponse[]
}

export interface PlatformSettingsResponse {
  maintenanceMode: boolean
  allowClientRegistration: boolean
  slaHours: number
}

export interface AuditLogResponse {
  id: string
  action: string
  actorUserId: string | null
  actorName: string
  context: Record<string, unknown> | null
  createdAt: string
}

export interface UpsertCatalogItemPayload {
  category: CatalogCategory
  value: string
  isActive?: boolean
}

interface ApiErrorPayload {
  message?: string | string[]
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:3000/api/v1'

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

async function requestPlatform<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  return (await response.json()) as T
}

export function listPlatformUsers(token: string) {
  return requestPlatform<PlatformUserResponse[]>('/auth/users', token, {
    method: 'GET',
  })
}

export function updatePlatformUser(token: string, userId: string, payload: UpdatePlatformUserPayload) {
  return requestPlatform<PlatformUserResponse>(`/auth/users/${userId}`, token, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function getCatalogs(token: string) {
  return requestPlatform<CatalogsResponse>('/catalogs', token, {
    method: 'GET',
  })
}

export function upsertCatalogItem(token: string, payload: UpsertCatalogItemPayload) {
  return requestPlatform<CatalogItemResponse>('/catalogs/items', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function toggleCatalogItem(token: string, itemId: string, isActive: boolean) {
  return requestPlatform<CatalogItemResponse>(`/catalogs/items/${itemId}`, token, {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
  })
}

export function getPlatformSettings(token: string) {
  return requestPlatform<PlatformSettingsResponse>('/platform/settings', token, {
    method: 'GET',
  })
}

export function updatePlatformSettings(token: string, payload: PlatformSettingsResponse) {
  return requestPlatform<PlatformSettingsResponse>('/platform/settings', token, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function listAuditLogs(token: string) {
  return requestPlatform<AuditLogResponse[]>('/platform/audit', token, {
    method: 'GET',
  })
}