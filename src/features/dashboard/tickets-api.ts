import { getApiBaseUrl } from '../../lib/api-base-url'
import type { TicketPriority } from './types'

export type TicketStatus = 'Disponible' | 'Nuevo' | 'Asignado' | 'En revision' | 'En proceso' | 'Resuelto'

export interface TicketUpdateResponse {
  id: string
  at: string
  author: string
  note: string
}

export interface TicketResponse {
  id: string
  code: string
  title: string
  service: string
  priority: TicketPriority
  status: TicketStatus
  description: string
  evidence: string | null
  diagnosis: string | null
  clientName: string
  createdByUserId: string
  assignedToUserId: string | null
  createdAt: string
  updatedAt: string
  updates: TicketUpdateResponse[]
}

export interface CreateTicketPayload {
  title: string
  service: string
  priority: TicketPriority
  description: string
  evidence?: string
}

export interface AssignTicketPayload {
  technicianEmail: string
  note: string
  priority?: TicketPriority
}

export interface UpdateTicketStatusPayload {
  status: TicketStatus
  note: string
}

interface ApiErrorPayload {
  message?: string | string[]
}

const API_BASE_URL = getApiBaseUrl()

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

async function requestTickets<T>(
  path: string,
  token: string,
  init?: RequestInit,
): Promise<T> {
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

export function listTickets(token: string) {
  return requestTickets<TicketResponse[]>('/tickets', token, {
    method: 'GET',
  })
}

export function createTicket(token: string, payload: CreateTicketPayload) {
  return requestTickets<TicketResponse>('/tickets', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function assignTicket(token: string, ticketId: string, payload: AssignTicketPayload) {
  return requestTickets<TicketResponse>(`/tickets/${ticketId}/assign`, token, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function updateTicketStatus(
  token: string,
  ticketId: string,
  payload: UpdateTicketStatusPayload,
) {
  return requestTickets<TicketResponse>(`/tickets/${ticketId}/status`, token, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}