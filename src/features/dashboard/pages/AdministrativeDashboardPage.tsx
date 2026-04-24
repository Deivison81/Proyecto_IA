import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../../app/providers/useAuth'
import {
  assignTicket,
  listTickets,
  updateTicketStatus,
  type TicketResponse,
  type TicketStatus,
} from '../tickets-api'
import { listPlatformUsers, type PlatformUserResponse } from '../platform-api'

interface AdministrativeUpdate {
  at: string
  author: string
  note: string
}

interface AdministrativeTicket {
  id: string
  code: string
  client: string
  title: string
  service: string
  priority: 'Alta' | 'Media' | 'Baja'
  status: TicketStatus
  assignedToUserId: string | null
  createdAt: string
  updatedAt: string
  description: string
  diagnosis: string
  updates: AdministrativeUpdate[]
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

function mapTicket(ticket: TicketResponse): AdministrativeTicket {
  return {
    id: ticket.id,
    code: ticket.code,
    client: ticket.clientName,
    title: ticket.title,
    service: ticket.service,
    priority: ticket.priority,
    status: ticket.status,
    assignedToUserId: ticket.assignedToUserId,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    description: ticket.description,
    diagnosis: ticket.diagnosis ?? 'Sin diagnostico inicial registrado.',
    updates: ticket.updates.map((update) => ({
      at: update.at,
      author: update.author,
      note: update.note,
    })),
  }
}

export function AdministrativeDashboardPage() {
  const { user, token } = useAuth()
  const operatorName = user?.name ?? 'Administrativo'

  const [tickets, setTickets] = useState<AdministrativeTicket[]>([])
  const [technicians, setTechnicians] = useState<PlatformUserResponse[]>([])
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | TicketStatus>('all')
  const [assignmentDraft, setAssignmentDraft] = useState('')
  const [priorityDraft, setPriorityDraft] = useState<'Alta' | 'Media' | 'Baja'>('Alta')
  const [noteDraft, setNoteDraft] = useState('')
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!token) {
      setTickets([])
      setTechnicians([])
      setSelectedTicketId(null)
      setError('Tu sesion no es valida para operar tickets.')
      setIsLoading(false)
      return
    }

    let isMounted = true

    const loadData = async () => {
      setIsLoading(true)
      setError('')

      try {
        const [ticketsResponse, usersResponse] = await Promise.all([
          listTickets(token),
          listPlatformUsers(token),
        ])

        if (!isMounted) {
          return
        }

        const nextTechnicians = usersResponse.filter(
          (candidate) => candidate.role === 'technician' && candidate.isActive,
        )
        const nextTickets = ticketsResponse.map(mapTicket)

        setTechnicians(nextTechnicians)
        setTickets(nextTickets)
        setSelectedTicketId((current) => current ?? nextTickets[0]?.id ?? null)
        setAssignmentDraft(nextTechnicians[0]?.email ?? '')
      } catch (loadError) {
        if (!isMounted) {
          return
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : 'No fue posible cargar la bandeja administrativa.',
        )
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadData()

    return () => {
      isMounted = false
    }
  }, [token])

  const technicianById = useMemo(
    () => new Map(technicians.map((technician) => [technician.id, technician])),
    [technicians],
  )

  const visibleTickets = tickets.filter((ticket) => (filter === 'all' ? true : ticket.status === filter))
  const selectedTicket =
    tickets.find((ticket) => ticket.id === selectedTicketId) ?? visibleTickets[0] ?? null

  useEffect(() => {
    if (!selectedTicket) {
      return
    }

    const selectedTechnician = selectedTicket.assignedToUserId
      ? technicianById.get(selectedTicket.assignedToUserId)
      : null

    setAssignmentDraft(selectedTechnician?.email ?? technicians[0]?.email ?? '')
    setPriorityDraft(selectedTicket.priority)
  }, [selectedTicket, technicianById, technicians])

  const replaceTicket = (updated: AdministrativeTicket) => {
    setTickets((current) => current.map((ticket) => (ticket.id === updated.id ? updated : ticket)))
    setSelectedTicketId(updated.id)
  }

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId)
    setFeedback('')
    setError('')
  }

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!token || !selectedTicket) {
      setError('Selecciona un ticket para continuar.')
      return
    }

    if (!assignmentDraft) {
      setError('Selecciona un tecnico para asignar el ticket.')
      return
    }

    if (noteDraft.trim().length < 8) {
      setError('Agrega una nota operativa mas descriptiva para guardar cambios.')
      return
    }

    setIsSaving(true)
    setFeedback('')
    setError('')

    try {
      const updated = await assignTicket(token, selectedTicket.id, {
        technicianEmail: assignmentDraft,
        priority: priorityDraft,
        note: noteDraft.trim(),
      })

      replaceTicket(mapTicket(updated))
      setNoteDraft('')
      setFeedback('Asignacion y seguimiento administrativo actualizados.')
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'No fue posible guardar la asignacion.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  const closeTicket = async () => {
    if (!token || !selectedTicket) {
      return
    }

    setIsSaving(true)
    setFeedback('')
    setError('')

    try {
      const updated = await updateTicketStatus(token, selectedTicket.id, {
        status: 'Resuelto',
        note: noteDraft.trim() || `Cierre operativo validado por ${operatorName}.`,
      })

      replaceTicket(mapTicket(updated))
      setNoteDraft('')
      setFeedback('Ticket cerrado operativamente.')
    } catch (closeError) {
      setError(
        closeError instanceof Error
          ? closeError.message
          : 'No fue posible cerrar el ticket.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  const assignedCount = tickets.filter((ticket) => ticket.assignedToUserId !== null).length
  const pendingCount = tickets.filter((ticket) => ticket.status !== 'Resuelto').length
  const clientsCount = new Set(tickets.map((ticket) => ticket.client)).size
  const unassignedCount = tickets.filter((ticket) => ticket.assignedToUserId === null).length

  return (
    <div className="dashboard-grid">
      <section className="panel dashboard-card-span">
        <p className="eyebrow">Dashboard Personal administrativo</p>
        <h3>Bandeja global, asignaciones y seguimiento</h3>
        <p>
          Centraliza la operacion de tickets, asigna tecnicos, ajusta prioridad y valida el
          cierre de las solicitudes del servicio.
        </p>
        <div className="dashboard-stats">
          <article className="stat-card">
            <strong>{tickets.length}</strong>
            <span>Tickets globales</span>
          </article>
          <article className="stat-card">
            <strong>{pendingCount}</strong>
            <span>Casos pendientes</span>
          </article>
          <article className="stat-card">
            <strong>{unassignedCount}</strong>
            <span>Sin asignar</span>
          </article>
          <article className="stat-card">
            <strong>{clientsCount}</strong>
            <span>Clientes activos</span>
          </article>
          <article className="stat-card">
            <strong>{assignedCount}</strong>
            <span>Con tecnico asignado</span>
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="section-head-row">
          <h3>Bandeja global</h3>
          <div className="filter-chip-row">
            {(['all', 'Disponible', 'Nuevo', 'Asignado', 'En proceso', 'Resuelto'] as const).map((item) => (
              <button
                key={item}
                type="button"
                className={`chip-button ${filter === item ? 'chip-button-active' : ''}`}
                onClick={() => setFilter(item)}
              >
                {item === 'all' ? 'Todos' : item}
              </button>
            ))}
          </div>
        </div>

        {isLoading && <p>Cargando tickets...</p>}
        <div className="ticket-list">
          {visibleTickets.map((ticket) => (
            <button
              key={ticket.id}
              type="button"
              className={`ticket-row ${selectedTicket?.id === ticket.id ? 'ticket-row-active' : ''}`}
              onClick={() => handleSelectTicket(ticket.id)}
            >
              <div>
                <strong>{ticket.code}</strong>
                <p>{ticket.title}</p>
                <small>{ticket.client}</small>
              </div>
              <div className="ticket-meta">
                <span className={`status-pill status-${ticket.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {ticket.status}
                </span>
                <small>{ticket.assignedToUserId ? technicianById.get(ticket.assignedToUserId)?.name ?? 'Tecnico asignado' : 'Sin tecnico'}</small>
              </div>
            </button>
          ))}
          {!isLoading && visibleTickets.length === 0 && <p>No hay tickets para el filtro actual.</p>}
        </div>
      </section>

      <section className="panel">
        <h3>Clientes atendidos</h3>
        <div className="ticket-list">
          {[...new Set(tickets.map((ticket) => ticket.client))].map((client) => {
            const clientTickets = tickets.filter((ticket) => ticket.client === client)
            const active = clientTickets.filter((ticket) => ticket.status !== 'Resuelto').length
            return (
              <div key={client} className="ticket-row ticket-row-static">
                <div>
                  <strong>{client}</strong>
                  <p>{clientTickets.length} solicitudes registradas</p>
                </div>
                <div className="ticket-meta">
                  <span className="status-pill status-en-revision">{active} activas</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="panel dashboard-card-span">
        <h3>Control operativo</h3>
        {!selectedTicket && !isLoading && <p>No hay ticket seleccionado.</p>}

        {selectedTicket && (
          <div className="ticket-detail-grid">
            <article className="detail-card">
              <div className="section-head-row">
                <strong>{selectedTicket.code}</strong>
                <span
                  className={`status-pill status-${selectedTicket.status
                    .toLowerCase()
                    .replace(/\s+/g, '-')}`}
                >
                  {selectedTicket.status}
                </span>
              </div>
              <h4>{selectedTicket.title}</h4>
              <p>{selectedTicket.description}</p>
              <ul className="detail-list">
                <li>Cliente: {selectedTicket.client}</li>
                <li>Servicio: {selectedTicket.service}</li>
                <li>Prioridad actual: {selectedTicket.priority}</li>
                <li>Tecnico asignado: {selectedTicket.assignedToUserId ? technicianById.get(selectedTicket.assignedToUserId)?.name ?? 'Tecnico asignado' : 'Pendiente'}</li>
                <li>Creado: {formatDate(selectedTicket.createdAt)}</li>
                <li>Actualizado: {formatDate(selectedTicket.updatedAt)}</li>
              </ul>
              <p>
                <strong>Diagnostico base:</strong> {selectedTicket.diagnosis}
              </p>
            </article>

            <article className="detail-card">
              <h4>Asignacion y seguimiento</h4>
              <form className="form-grid" onSubmit={handleSave}>
                <label>
                  Asignar tecnico
                  <select
                    value={assignmentDraft}
                    onChange={(event) => setAssignmentDraft(event.target.value)}
                  >
                    {technicians.map((technician) => (
                      <option key={technician.id} value={technician.email}>
                        {technician.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Prioridad
                  <select
                    value={priorityDraft}
                    onChange={(event) => setPriorityDraft(event.target.value as 'Alta' | 'Media' | 'Baja')}
                  >
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>
                </label>

                <label>
                  Nota administrativa
                  <textarea
                    rows={4}
                    value={noteDraft}
                    onChange={(event) => {
                      setNoteDraft(event.target.value)
                      setFeedback('')
                      setError('')
                    }}
                    placeholder="Registra la razon de la asignacion, prioridad o seguimiento del caso"
                  />
                </label>

                <div className="cta-row">
                  <button type="submit" className="button button-primary" disabled={isSaving || technicians.length === 0}>
                    {isSaving ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                  <button type="button" className="button button-secondary" disabled={isSaving} onClick={() => void closeTicket()}>
                    Cerrar ticket
                  </button>
                </div>
              </form>

              {feedback && <p className="status-ok">{feedback}</p>}
              {error && <p className="status-error">{error}</p>}
            </article>

            <article className="detail-card dashboard-card-span">
              <h4>Bitacora del caso</h4>
              <div className="timeline-list">
                {selectedTicket.updates.map((update) => (
                  <div key={`${selectedTicket.id}-${update.at}-${update.author}`} className="timeline-item">
                    <strong>{update.author}</strong>
                    <small>{formatDate(update.at)}</small>
                    <p>{update.note}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        )}
      </section>
    </div>
  )
}