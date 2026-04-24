import { useEffect, useState } from 'react'
import { useAuth } from '../../../app/providers/useAuth'
import { createTicket, listTickets, type TicketResponse, type TicketStatus } from '../tickets-api'
import type { TicketPriority } from '../types'

interface TicketUpdate {
  at: string
  author: string
  message: string
}

interface ClientTicket {
  id: string
  code: string
  title: string
  service: string
  priority: TicketPriority
  status: TicketStatus
  description: string
  evidence: string
  createdAt: string
  updatedAt: string
  updates: TicketUpdate[]
}

interface TicketForm {
  title: string
  service: string
  priority: TicketPriority
  description: string
  evidence: string
}

const SERVICE_OPTIONS = [
  'Soporte TI general',
  'Manejo de servidores',
  'Soporte al desarrollo',
  'Instalacion y soporte de redes',
  'Instalacion de camaras',
]

const initialForm: TicketForm = {
  title: '',
  service: SERVICE_OPTIONS[0],
  priority: 'Media',
  description: '',
  evidence: '',
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

function mapTicket(ticket: TicketResponse): ClientTicket {
  return {
    id: ticket.id,
    code: ticket.code,
    title: ticket.title,
    service: ticket.service,
    priority: ticket.priority,
    status: ticket.status,
    description: ticket.description,
    evidence: ticket.evidence ?? '',
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    updates: ticket.updates.map((update) => ({
      at: update.at,
      author: update.author,
      message: update.note,
    })),
  }
}

export function ClientDashboardPage() {
  const { token } = useAuth()
  const [tickets, setTickets] = useState<ClientTicket[]>([])
  const [form, setForm] = useState<TicketForm>(initialForm)
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'all' | TicketStatus>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!token) {
      setTickets([])
      setSelectedTicketId(null)
      setIsLoading(false)
      setError('Tu sesion no es valida para consultar tickets.')
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
            : 'No fue posible consultar tus solicitudes.',
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

  useEffect(() => {
    if (tickets.length === 0) {
      setSelectedTicketId(null)
      return
    }

    const selectedExists = tickets.some((ticket) => ticket.id === selectedTicketId)

    if (!selectedExists) {
      setSelectedTicketId(tickets[0]?.id ?? null)
    }
  }, [selectedTicketId, tickets])

  const updateField = (field: keyof TicketForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value as never }))
    setFeedback('')
    setError('')
  }

  const handleCreateTicket = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (form.title.trim().length < 6 || form.description.trim().length < 12) {
      setFeedback('Completa un titulo y una descripcion mas detallada para crear la solicitud.')
      return
    }

    if (!token) {
      setError('Tu sesion no es valida para crear tickets.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const created = await createTicket(token, {
        title: form.title.trim(),
        service: form.service,
        priority: form.priority,
        description: form.description.trim(),
        evidence: form.evidence.trim() || undefined,
      })

      const nextTicket = mapTicket(created)
      setTickets((current) => [nextTicket, ...current])
      setSelectedTicketId(nextTicket.id)
      setForm(initialForm)
      setFeedback('Solicitud creada correctamente. Ya aparece en tu historial.')
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'No fue posible crear la solicitud.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const visibleTickets = tickets.filter((ticket) =>
    filter === 'all' ? true : ticket.status === filter,
  )

  const selectedTicket =
    tickets.find((ticket) => ticket.id === selectedTicketId) ?? visibleTickets[0] ?? null

  const openTickets = tickets.filter((ticket) => ticket.status !== 'Resuelto').length
  const resolvedTickets = tickets.filter((ticket) => ticket.status === 'Resuelto').length

  return (
    <div className="dashboard-grid">
      <section className="panel dashboard-card-span">
        <p className="eyebrow">Dashboard Cliente</p>
        <h3>Solicitudes y seguimiento de servicio</h3>
        <p>
          Desde aqui puedes registrar incidencias, revisar su estado actual y consultar el historial
          completo de atenciones asociadas a tu cuenta.
        </p>
        <div className="dashboard-stats">
          <article className="stat-card">
            <strong>{tickets.length}</strong>
            <span>Solicitudes totales</span>
          </article>
          <article className="stat-card">
            <strong>{openTickets}</strong>
            <span>Casos activos</span>
          </article>
          <article className="stat-card">
            <strong>{resolvedTickets}</strong>
            <span>Casos resueltos</span>
          </article>
        </div>
      </section>

      <section className="panel">
        <h3>Nueva solicitud</h3>
        <form className="form-grid" onSubmit={handleCreateTicket}>
          <label>
            Titulo del caso
            <input
              value={form.title}
              onChange={(event) => updateField('title', event.target.value)}
              placeholder="Ej: No puedo ingresar al sistema"
            />
          </label>

          <label>
            Servicio
            <select
              value={form.service}
              onChange={(event) => updateField('service', event.target.value)}
            >
              {SERVICE_OPTIONS.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </label>

          <label>
            Prioridad
            <select
              value={form.priority}
              onChange={(event) => updateField('priority', event.target.value)}
            >
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
          </label>

          <label>
            Descripcion
            <textarea
              rows={4}
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              placeholder="Describe el problema, el impacto y desde cuando ocurre"
            />
          </label>

          <label>
            Evidencia o referencia
            <input
              value={form.evidence}
              onChange={(event) => updateField('evidence', event.target.value)}
              placeholder="Captura, video, nombre de equipo o referencia"
            />
          </label>

          <button type="submit" className="button button-primary" disabled={isSubmitting || !token}>
            {isSubmitting ? 'Creando solicitud...' : 'Crear solicitud'}
          </button>
        </form>

        {feedback && <p className="status-ok">{feedback}</p>}
        {error && <p className="status-error">{error}</p>}
      </section>

      <section className="panel">
        <div className="section-head-row">
          <h3>Historial</h3>
          <div className="filter-chip-row">
            {(['all', 'Nuevo', 'En revision', 'En proceso', 'Resuelto'] as const).map((item) => (
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

        {isLoading && <p>Cargando solicitudes...</p>}

        {!isLoading && visibleTickets.length === 0 && (
          <p>No hay solicitudes registradas para el filtro actual.</p>
        )}

        <div className="ticket-list">
          {visibleTickets.map((ticket) => (
            <button
              key={ticket.id}
              type="button"
              className={`ticket-row ${selectedTicket?.id === ticket.id ? 'ticket-row-active' : ''}`}
              onClick={() => setSelectedTicketId(ticket.id)}
            >
              <div>
                <strong>{ticket.code}</strong>
                <p>{ticket.title}</p>
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
        <h3>Detalle de solicitud</h3>
        {!selectedTicket && <p>No hay solicitudes para mostrar.</p>}

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
                <li>Servicio: {selectedTicket.service}</li>
                <li>Prioridad: {selectedTicket.priority}</li>
                <li>Creado: {formatDate(selectedTicket.createdAt)}</li>
                <li>Actualizado: {formatDate(selectedTicket.updatedAt)}</li>
                <li>Evidencia: {selectedTicket.evidence || 'Sin adjunto registrado'}</li>
              </ul>
            </article>

            <article className="detail-card">
              <h4>Seguimiento</h4>
              <div className="timeline-list">
                {selectedTicket.updates.map((update) => (
                  <div key={`${selectedTicket.id}-${update.at}-${update.author}`} className="timeline-item">
                    <strong>{update.author}</strong>
                    <small>{formatDate(update.at)}</small>
                    <p>{update.message}</p>
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
