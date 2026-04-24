import { useState } from 'react'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const isValid = email.includes('@')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isValid) {
      return
    }

    setSent(true)
    setEmail('')
  }

  return (
    <section className="panel auth-panel">
      <h2>Recuperar acceso</h2>
      <p>
        Ingresa tu correo y enviaremos instrucciones para restablecer tu clave.
        Este flujo queda en modo demo hasta integrar backend.
      </p>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Correo de acceso
          <input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setSent(false)
            }}
            placeholder="usuario@empresa.com"
          />
        </label>

        <button className="button button-primary" type="submit" disabled={!isValid}>
          Enviar enlace
        </button>
      </form>

      {sent && (
        <p className="status-ok">
          Solicitud recibida en modo demo. En la siguiente etapa se conectara
          con servicio real de recuperacion.
        </p>
      )}
    </section>
  )
}
