import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../../app/providers/useAuth'
import { ROLE_DASHBOARD_PATHS, ROLE_LABELS, type UserRole } from '../../../types/auth'

interface LoginForm {
  email: string
  password: string
}

const initialForm: LoginForm = {
  email: '',
  password: '',
}

interface RegisterForm {
  name: string
  email: string
  role: UserRole
  password: string
  confirmPassword: string
}

const initialRegisterForm: RegisterForm = {
  name: '',
  email: '',
  role: 'client',
  password: '',
  confirmPassword: '',
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { login, register, isAuthenticating } = useAuth()
  const [form, setForm] = useState<LoginForm>(initialForm)
  const [registerForm, setRegisterForm] = useState<RegisterForm>(initialRegisterForm)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const activeTab = searchParams.get('tab') === 'register' ? 'register' : 'login'

  const locationState = (location.state as {
    from?: { pathname?: string }
    prefillRegister?: { name?: string; email?: string; role?: UserRole; companyName?: string; phone?: string; service?: string }
  } | null)

  const fromPath = locationState
    ?.from?.pathname

  useEffect(() => {
    if (!locationState?.prefillRegister) {
      return
    }

    const { name, email, role } = locationState.prefillRegister

    setRegisterForm((current) => ({
      ...current,
      name: name ?? current.name,
      email: email ?? current.email,
      role: role ?? current.role,
    }))
    setSearchParams({ tab: 'register' })
    setSuccess('Completa una contrasena para finalizar tu registro real de cliente.')
  }, [locationState, setSearchParams])

  const updateField = (field: keyof LoginForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError('')
    setSuccess('')
  }

  const updateRegisterField = (field: keyof RegisterForm, value: string) => {
    setRegisterForm((prev) => ({ ...prev, [field]: value }))
    setError('')
    setSuccess('')
  }

  const navigateAfterLogin = (role: UserRole) => {
    navigate(fromPath && !fromPath.startsWith('/login') ? fromPath : ROLE_DASHBOARD_PATHS[role], {
      replace: true,
    })
  }

  const fillDemo = (email: string, password: string) => {
    setForm({ email, password })
    setError('')
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSuccess('')
    const result = await login(form)

    if (!result.ok) {
      setError(result.error ?? 'Error de autenticacion')
      return
    }

    const role = result.role

    if (role) {
      navigateAfterLogin(role)
      return
    }

    navigate('/dashboard', { replace: true })
  }

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (registerForm.password.length < 6) {
      setError('La contrasena debe tener minimo 6 caracteres.')
      return
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('La confirmacion de contrasena no coincide.')
      return
    }

    const result = await register({
      name: registerForm.name,
      email: registerForm.email,
      role: registerForm.role,
      password: registerForm.password,
    })

    if (!result.ok) {
      setError(result.error ?? 'No fue posible registrar el usuario.')
      return
    }

    setForm({
      email: registerForm.email,
      password: registerForm.password,
    })
    setRegisterForm(initialRegisterForm)
    setSuccess('Registro completado. Ya puedes iniciar sesion con tu usuario.')
    setSearchParams({ tab: 'login' })
  }

  return (
    <section className="panel auth-panel">
      <div className="auth-hub-switch">
        <button
          type="button"
          className={`button ${activeTab === 'login' ? 'button-primary' : 'button-secondary'}`}
          onClick={() => setSearchParams({ tab: 'login' })}
        >
          Iniciar sesion
        </button>
        <button
          type="button"
          className={`button ${activeTab === 'register' ? 'button-primary' : 'button-secondary'}`}
          onClick={() => setSearchParams({ tab: 'register' })}
        >
          Registrarme
        </button>
      </div>

      {activeTab === 'login' && (
        <>
          <h2>Iniciar sesion</h2>
          <p>
            Accede con tus credenciales registradas en el backend para entrar al
            dashboard segun tu perfil.
          </p>

          <form className="form-grid" onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                placeholder="usuario@empresa.com"
              />
            </label>

            <label>
              Contrasena
              <input
                type="password"
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
                placeholder="********"
              />
            </label>

            <button className="button button-primary" disabled={isAuthenticating} type="submit">
              {isAuthenticating ? 'Validando...' : 'Ingresar'}
            </button>
          </form>
        </>
      )}

      {activeTab === 'register' && (
        <>
          <h2>Registro de acceso</h2>
          <p>
            Crea tu usuario segun el rol correspondiente. Luego podras ingresar al
            dashboard asignado para ese perfil.
          </p>

          <form className="form-grid" onSubmit={handleRegister}>
            <label>
              Nombre completo
              <input
                value={registerForm.name}
                onChange={(event) => updateRegisterField('name', event.target.value)}
                placeholder="Ej: Laura Gomez"
              />
            </label>

            <label>
              Usuario (email)
              <input
                type="email"
                value={registerForm.email}
                onChange={(event) => updateRegisterField('email', event.target.value)}
                placeholder="usuario@empresa.com"
              />
            </label>

            <label>
              Perfil o rol
              <select
                value={registerForm.role}
                onChange={(event) =>
                  updateRegisterField('role', event.target.value as UserRole)
                }
              >
                {Object.entries(ROLE_LABELS).map(([role, label]) => (
                  <option key={role} value={role}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Contrasena
              <input
                type="password"
                value={registerForm.password}
                onChange={(event) => updateRegisterField('password', event.target.value)}
                placeholder="Minimo 6 caracteres"
              />
            </label>

            <label>
              Confirmar contrasena
              <input
                type="password"
                value={registerForm.confirmPassword}
                onChange={(event) => updateRegisterField('confirmPassword', event.target.value)}
                placeholder="Repite la contrasena"
              />
            </label>

            <button className="button button-primary" disabled={isAuthenticating} type="submit">
              {isAuthenticating ? 'Creando cuenta...' : 'Registrar usuario'}
            </button>
          </form>
        </>
      )}

      {error && <p className="status-error">{error}</p>}
      {success && <p className="status-ok">{success}</p>}

      <p>
        <Link to="/recuperar-acceso" className="text-link">
          Olvide mi contrasena
        </Link>
      </p>

      {activeTab === 'login' && (
        <section className="panel muted-panel">
          <h3>Acceso conectado a API</h3>
          <p className="small-note">
            Esta pantalla ya consume el backend real en <strong>/api/v1/auth</strong>.
          </p>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => fillDemo('admin@proyectoia.local', 'Demo1234')}
          >
            Autocompletar credenciales conocidas
          </button>
        </section>
      )}
    </section>
  )
}
