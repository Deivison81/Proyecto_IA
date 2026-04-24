import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../../app/providers/useAuth'
import type { UserRole } from '../../../types/auth'
import {
  getCatalogs,
  getPlatformSettings,
  listAuditLogs,
  listPlatformUsers,
  toggleCatalogItem,
  updatePlatformSettings,
  updatePlatformUser,
  upsertCatalogItem,
  type AuditLogResponse,
  type CatalogItemResponse,
  type CatalogsResponse,
  type PlatformSettingsResponse,
  type PlatformUserResponse,
} from '../platform-api'

type PlatformRole = UserRole

interface PlatformUser {
  id: string
  name: string
  email: string
  role: PlatformRole
  status: 'Activo' | 'Suspendido'
}

interface PlatformCatalog {
  services: string[]
  priorities: string[]
  statuses: string[]
  items: CatalogItemResponse[]
}

interface PlatformSettings {
  maintenanceMode: boolean
  allowClientRegistration: boolean
  slaHours: number
}

interface AuditEntry {
  id: string
  at: string
  action: string
  actor: string
}

interface PlatformState {
  users: PlatformUser[]
  catalog: PlatformCatalog
  settings: PlatformSettings
  audit: AuditEntry[]
}

const ROLE_LABELS: Record<PlatformRole, string> = {
  client: 'Cliente',
  technician: 'Personal tecnico',
  administrative: 'Personal administrativo',
  platform_admin: 'Administrador de plataforma',
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

function mapUser(user: PlatformUserResponse): PlatformUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.isActive ? 'Activo' : 'Suspendido',
  }
}

function mapCatalog(catalogs: CatalogsResponse): PlatformCatalog {
  return {
    services: catalogs.services,
    priorities: catalogs.priorities,
    statuses: catalogs.statuses,
    items: catalogs.items,
  }
}

function mapSettings(settings: PlatformSettingsResponse): PlatformSettings {
  return {
    maintenanceMode: settings.maintenanceMode,
    allowClientRegistration: settings.allowClientRegistration,
    slaHours: settings.slaHours,
  }
}

function mapAuditEntry(entry: AuditLogResponse): AuditEntry {
  return {
    id: entry.id,
    at: entry.createdAt,
    action: entry.action,
    actor: entry.actorName,
  }
}

export function PlatformAdminDashboardPage() {
  const { token } = useAuth()
  const [platformState, setPlatformState] = useState<PlatformState | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [newService, setNewService] = useState('')
  const [settingsDraft, setSettingsDraft] = useState<PlatformSettings>({
    maintenanceMode: false,
    allowClientRegistration: true,
    slaHours: 8,
  })
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const loadPlatformData = async () => {
    if (!token) {
      setPlatformState(null)
      setSelectedUserId(null)
      setError('Tu sesion no es valida para administrar la plataforma.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const [users, catalogs, settings, audit] = await Promise.all([
        listPlatformUsers(token),
        getCatalogs(token),
        getPlatformSettings(token),
        listAuditLogs(token),
      ])

      const nextState: PlatformState = {
        users: users.map(mapUser),
        catalog: mapCatalog(catalogs),
        settings: mapSettings(settings),
        audit: audit.map(mapAuditEntry),
      }

      setPlatformState(nextState)
      setSettingsDraft(nextState.settings)
      setSelectedUserId((current) => current ?? nextState.users[0]?.id ?? null)
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'No fue posible cargar la configuracion de plataforma.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadPlatformData()
  }, [token])

  const selectedUser =
    platformState?.users.find((user) => user.id === selectedUserId) ?? platformState?.users[0] ?? null

  const serviceItems = useMemo(
    () => platformState?.catalog.items.filter((item) => item.category === 'service') ?? [],
    [platformState],
  )

  const persistUser = (user: PlatformUserResponse) => {
    setPlatformState((current) =>
      current
        ? {
            ...current,
            users: current.users.map((entry) => (entry.id === user.id ? mapUser(user) : entry)),
          }
        : current,
    )
  }

  const toggleUserStatus = async (userId: string) => {
    if (!token || !platformState) {
      return
    }

    const currentUser = platformState.users.find((user) => user.id === userId)
    if (!currentUser) {
      return
    }

    setIsSaving(true)
    setFeedback('')
    setError('')

    try {
      const updated = await updatePlatformUser(token, userId, {
        isActive: currentUser.status !== 'Activo',
      })
      persistUser(updated)
      setFeedback('Estado de usuario actualizado correctamente.')
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : 'No fue posible actualizar el usuario.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  const changeUserRole = async (userId: string, role: PlatformRole) => {
    if (!token) {
      return
    }

    setIsSaving(true)
    setFeedback('')
    setError('')

    try {
      const updated = await updatePlatformUser(token, userId, { role })
      persistUser(updated)
      setFeedback('Rol actualizado correctamente.')
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : 'No fue posible actualizar el rol.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  const addService = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!token || !platformState) {
      return
    }

    if (newService.trim().length < 4) {
      setError('El nombre del servicio debe ser mas descriptivo.')
      return
    }

    setIsSaving(true)
    setFeedback('')
    setError('')

    try {
      const created = await upsertCatalogItem(token, {
        category: 'service',
        value: newService.trim(),
        isActive: true,
      })

      setPlatformState((current) =>
        current
          ? {
              ...current,
              catalog: {
                ...current.catalog,
                services: current.catalog.services.includes(created.value)
                  ? current.catalog.services
                  : [...current.catalog.services, created.value],
                items: [...current.catalog.items.filter((item) => item.id !== created.id), created],
              },
            }
          : current,
      )
      setNewService('')
      setFeedback('Servicio agregado al catalogo correctamente.')
      void loadPlatformData()
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : 'No fue posible agregar el servicio.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleService = async (itemId: string, isActive: boolean) => {
    if (!token) {
      return
    }

    setIsSaving(true)
    setFeedback('')
    setError('')

    try {
      await toggleCatalogItem(token, itemId, !isActive)
      setFeedback('Estado del servicio actualizado correctamente.')
      void loadPlatformData()
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'No fue posible actualizar el servicio.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  const saveSettings = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!token) {
      return
    }

    setIsSaving(true)
    setFeedback('')
    setError('')

    try {
      const updated = await updatePlatformSettings(token, settingsDraft)
      setSettingsDraft(mapSettings(updated))
      setFeedback('Configuracion global actualizada.')
      void loadPlatformData()
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'No fue posible actualizar la configuracion.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading && !platformState) {
    return (
      <section className="panel">
        <p>Cargando configuracion de plataforma...</p>
      </section>
    )
  }

  if (!platformState) {
    return (
      <section className="panel">
        <p className="status-error">{error || 'No fue posible cargar la plataforma.'}</p>
      </section>
    )
  }

  return (
    <div className="dashboard-grid">
      <section className="panel dashboard-card-span">
        <p className="eyebrow">Dashboard Administrador de plataforma</p>
        <h3>Usuarios, catalogos y control global</h3>
        <p>
          Administra usuarios y roles, define catalogos del sistema y mantiene parametros de
          operacion con trazabilidad de auditoria.
        </p>
        <div className="dashboard-stats">
          <article className="stat-card">
            <strong>{platformState.users.length}</strong>
            <span>Usuarios registrados</span>
          </article>
          <article className="stat-card">
            <strong>{platformState.catalog.services.length}</strong>
            <span>Servicios en catalogo</span>
          </article>
          <article className="stat-card">
            <strong>{platformState.users.filter((user) => user.status === 'Activo').length}</strong>
            <span>Usuarios activos</span>
          </article>
          <article className="stat-card">
            <strong>{platformState.audit.length}</strong>
            <span>Eventos auditados</span>
          </article>
        </div>
      </section>

      <section className="panel">
        <h3>Usuarios y roles</h3>
        <div className="ticket-list">
          {platformState.users.map((user) => (
            <button
              key={user.id}
              type="button"
              className={`ticket-row ${selectedUser?.id === user.id ? 'ticket-row-active' : ''}`}
              onClick={() => {
                setSelectedUserId(user.id)
                setFeedback('')
                setError('')
              }}
            >
              <div>
                <strong>{user.name}</strong>
                <p>{user.email}</p>
              </div>
              <div className="ticket-meta">
                <span className="status-pill status-en-proceso">{ROLE_LABELS[user.role]}</span>
                <small>{user.status}</small>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <h3>Detalle de usuario</h3>
        {!selectedUser && <p>No hay usuario seleccionado.</p>}
        {selectedUser && (
          <div className="detail-card">
            <strong>{selectedUser.name}</strong>
            <p>{selectedUser.email}</p>
            <label>
              Rol asignado
              <select
                value={selectedUser.role}
                onChange={(event) => void changeUserRole(selectedUser.id, event.target.value as PlatformRole)}
              >
                {Object.entries(ROLE_LABELS).map(([role, label]) => (
                  <option key={role} value={role}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="button button-secondary"
              disabled={isSaving}
              onClick={() => void toggleUserStatus(selectedUser.id)}
            >
              {selectedUser.status === 'Activo' ? 'Suspender usuario' : 'Reactivar usuario'}
            </button>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="section-head-row">
          <h3>Catalogos del sistema</h3>
        </div>
        <div className="detail-card">
          <strong>Servicios</strong>
          <ul className="detail-list compact-list">
            {serviceItems.map((service) => (
              <li key={service.id}>
                {service.value} - {service.isActive ? 'Activo' : 'Inactivo'}
                <button
                  type="button"
                  className="button button-secondary"
                  disabled={isSaving}
                  onClick={() => void handleToggleService(service.id, service.isActive)}
                >
                  {service.isActive ? 'Desactivar' : 'Activar'}
                </button>
              </li>
            ))}
          </ul>
          <form className="form-grid" onSubmit={addService}>
            <label>
              Nuevo servicio
              <input
                value={newService}
                onChange={(event) => {
                  setNewService(event.target.value)
                  setFeedback('')
                  setError('')
                }}
                placeholder="Ej: Monitoreo preventivo"
              />
            </label>
            <button type="submit" className="button button-primary" disabled={isSaving}>
              Agregar servicio
            </button>
          </form>
        </div>
      </section>

      <section className="panel">
        <h3>Parametros globales</h3>
        <form className="form-grid" onSubmit={saveSettings}>
          <label className="toggle-row">
            <span>Modo mantenimiento</span>
            <input
              type="checkbox"
              checked={settingsDraft.maintenanceMode}
              onChange={(event) =>
                setSettingsDraft((prev) => ({ ...prev, maintenanceMode: event.target.checked }))
              }
            />
          </label>

          <label className="toggle-row">
            <span>Permitir registro de clientes</span>
            <input
              type="checkbox"
              checked={settingsDraft.allowClientRegistration}
              onChange={(event) =>
                setSettingsDraft((prev) => ({
                  ...prev,
                  allowClientRegistration: event.target.checked,
                }))
              }
            />
          </label>

          <label>
            SLA por defecto (horas)
            <input
              type="number"
              min={1}
              max={72}
              value={settingsDraft.slaHours}
              onChange={(event) =>
                setSettingsDraft((prev) => ({
                  ...prev,
                  slaHours: Number(event.target.value),
                }))
              }
            />
          </label>

          <button type="submit" className="button button-primary" disabled={isSaving}>
            Guardar parametros
          </button>
        </form>
      </section>

      <section className="panel dashboard-card-span">
        <h3>Auditoria reciente</h3>
        <div className="timeline-list">
          {platformState.audit.map((entry) => (
            <div key={entry.id} className="timeline-item">
              <strong>{entry.action}</strong>
              <small>
                {entry.actor} - {formatDate(entry.at)}
              </small>
            </div>
          ))}
        </div>

        {feedback && <p className="status-ok">{feedback}</p>}
        {error && <p className="status-error">{error}</p>}
      </section>
    </div>
  )
}