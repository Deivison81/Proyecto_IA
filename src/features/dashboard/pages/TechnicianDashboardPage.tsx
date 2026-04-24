import { useEffect, useState } from 'react'
import { useAuth } from '../../../app/providers/useAuth'
import {
  assignTicket,
  listTickets,
  updateTicketStatus,
  type TicketResponse,
  type TicketStatus,
} from '../tickets-api'

interface TechnicianUpdate {
  at: string
  author: string
  note: string
}

interface TechnicianTicket {
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
  updates: TechnicianUpdate[]
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

function mapTicket(ticket: TicketResponse): TechnicianTicket {
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

export function TechnicianDashboardPage() {
  const { user, token } = useAuth()
  const technicianId = user?.id ?? null
  const technicianEmail = user?.email ?? ''
  const technicianName = user?.name ?? 'Tecnico'
  const [tickets, setTickets] = useState<TechnicianTicket[]>([])
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [statusDraft, setStatusDraft] = useState<TicketStatus>('Asignado')
  const [noteDraft, setNoteDraft] = useState('')
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!token) {
      setTickets([])
      setSelectedTicketId(null)
      setError('Tu sesion no es valida para consultar tickets.')
      setIsLoading(false)
      return
    }

    let isMounted = true

    const loadTickets = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await listTickets(token)
        if (!isMounted) {
          return
        }

        const nextTickets = response.map(mapTicket)
        setTickets(nextTickets)
        setSelectedTicketId((current) => current ?? nextTickets[0]?.id ?? null)
      } catch (loadError) {
        if (!isMounted) {
          return
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : 'No fue posible consultar tu bandeja tecnica.',
        )
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadTickets()

    return () => {
      isMounted = false
    }
  }, [token])

  const myTickets = tickets.filter((ticket) => ticket.assignedToUserId === technicianId)
  const availableTickets = tickets.filter((ticket) => ticket.assignedToUserId === null)
  const selectedTicket =
    tickets.find((ticket) => ticket.id === selectedTicketId) ?? myTickets[0] ?? availableTickets[0] ?? null

  useEffect(() => {
    if (!selectedTicket) {
      return
    }

    if (selectedTicket.assignedToUserId === technicianId) {
      setStatusDraft(selectedTicket.status === 'Disponible' ? 'Asignado' : selectedTicket.status)
    }
  }, [selectedTicket, technicianId])

  const replaceTicket = (updated: TechnicianTicket) => {
    setTickets((current) => current.map((ticket) => (ticket.id === updated.id ? updated : ticket)))
    setSelectedTicketId(updated.id)
  }

  const takeTicket = async (ticketId: string) => {
    if (!token || !technicianEmail) {
      setError('Tu sesion no es valida para asignarte tickets.')
      return
    }

    setIsSaving(true)
    setFeedback('')
    setError('')

    try {
      const updated = await assignTicket(token, ticketId, {
        technicianEmail,
        note: 'Ticket tomado por tecnico para gestion operativa.',
      })

      replaceTicket(mapTicket(updated))
      setStatusDraft('Asignado')
      setFeedback('Ticket asignado correctamente a tu bandeja.')
    } catch (assignError) {
      setError(
        assignError instanceof Error ? assignError.message : 'No fue posible tomar el ticket.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  const updateTicket = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!token || !selectedTicket || selectedTicket.assignedToUserId !== technicianId) {
      setError('Selecciona un ticket propio para actualizar.')
      return
    }

    if (noteDraft.trim().length < 8) {
      setError('Agrega una nota tecnica mas descriptiva antes de guardar.')
      return
    }

    setIsSaving(true)
    setFeedback('')
    setError('')

    try {
      const updated = await updateTicketStatus(token, selectedTicket.id, {
        status: statusDraft,
        note: noteDraft.trim(),
      })

      replaceTicket(mapTicket(updated))
      setNoteDraft('')
      setFeedback('Actualizacion tecnica registrada correctamente.')
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : 'No fue posible registrar el avance tecnico.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  const activeCount = myTickets.filter((ticket) => ticket.status !== 'Resuelto').length
  const availableCount = availableTickets.length
  const resolvedCount = myTickets.filter((ticket) => ticket.status === 'Resuelto').length

  return (
    <div className="dashboard-grid">
      <section className="panel dashboard-card-span">
        <p className="eyebrow">Dashboard Personal tecnico</p>
        <h3>Bandeja operativa y seguimiento tecnico</h3>
        <p>
          Toma tickets disponibles, actualiza el estado de los casos asignados y registra el
          seguimiento tecnico hasta la resolucion.
        </p>
        <div className="dashboard-stats">
          <article className="stat-card">
            <strong>{myTickets.length}</strong>
            <span>Tickets asignados</span>
          </article>
          <article className="stat-card">
            <strong>{activeCount}</strong>
            <span>Casos en gestion</span>
          </article>
          <article className="stat-card">
            <strong>{availableCount}</strong>
            <span>Disponibles por tomar</span>
          </article>
          <article className="stat-card">
            <strong>{resolvedCount}</strong>
            <span>Resueltos por ti</span>
          </article>
        </div>
      </section>

      <section className="panel">
        <h3>Cola disponible</h3>
        {isLoading && <p>Cargando tickets...</p>}
        <div className="ticket-list">
          {!isLoading && availableTickets.length === 0 && <p>No hay tickets disponibles en este momento.</p>}
          {availableTickets.map((ticket) => (
            <div key={ticket.id} className="ticket-row ticket-row-static">
              <div>
                <strong>{ticket.code}</strong>
                <p>{ticket.title}</p>
                <small>{ticket.client}</small>
              </div>
              <div className="ticket-meta">
                <span className={`status-pill status-${ticket.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {ticket.status}
                </span>
                <button
                  type="button"
                  className="button button-primary"
                  disabled={isSaving}
                  onClick={() => void takeTicket(ticket.id)}
                >
                  Tomar ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h3>Mis tickets</h3>
        <div className="ticket-list">
          {!isLoading && myTickets.length === 0 && <p>Aun no tienes tickets asignados.</p>}
          {myTickets.map((ticket) => (
            <button
              key={ticket.id}
              type="button"
              className={`ticket-row ${selectedTicket?.id === ticket.id ? 'ticket-row-active' : ''}`}
              onClick={() => {
                setSelectedTicketId(ticket.id)
                setStatusDraft(ticket.status === 'Disponible' ? 'Asignado' : ticket.status)
                setFeedback('')
                setError('')
              }}
            >
              <div>
                <strong>{ticket.code}</strong>
                <p>{ticket.title}</p>
                <small>{ticket.service}</small>
              </div>
              <div className="ticket-meta">
                <span className={`status-pill status-${ticket.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {ticket.status}
                </span>
                <small>{formatDate(ticket.updatedAt)}</small>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="panel dashboard-card-span">
        <h3>Detalle tecnico</h3>
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
                <li>Prioridad: {selectedTicket.priority}</li>
                <li>Asignado a: {selectedTicket.assignedToUserId === technicianId ? technicianName : 'Sin asignar'}</li>
                <li>Creado: {formatDate(selectedTicket.createdAt)}</li>
                <li>Actualizado: {formatDate(selectedTicket.updatedAt)}</li>
              </ul>
              <p>
                <strong>Diagnostico inicial:</strong> {selectedTicket.diagnosis}
              </p>
            </article>

            <article className="detail-card">
              <h4>Registrar avance tecnico</h4>
              {selectedTicket.assignedToUserId !== technicianId && (
                <p>Debes tomar este ticket para registrar avances tecnicos.</p>
              )}

              {selectedTicket.assignedToUserId === technicianId && (
                <form className="form-grid" onSubmit={updateTicket}>
                  <label>
                    Estado actual
                    <select
                      value={statusDraft}
                      onChange={(event) => setStatusDraft(event.target.value as TicketStatus)}
                    >
                      <option value="Asignado">Asignado</option>
                      <option value="En proceso">En proceso</option>
                      <option value="Resuelto">Resuelto</option>
                    </select>
                  </label>

                  <label>
                    Nota tecnica
                    <textarea
                      rows={4}
                      value={noteDraft}
                      onChange={(event) => {
                        setNoteDraft(event.target.value)
                        setFeedback('')
                        setError('')
                      }}
                      placeholder="Describe diagnostico, accion realizada o solucion aplicada"
                    />
                  </label>

                  <button type="submit" className="button button-primary" disabled={isSaving}>
                    {isSaving ? 'Guardando...' : 'Guardar avance'}
                  </button>
                </form>
              )}

              {feedback && <p className="status-ok">{feedback}</p>}
              {error && <p className="status-error">{error}</p>}
            </article>

            <article className="detail-card dashboard-card-span">
              <h4>Bitacora del ticket</h4>
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
