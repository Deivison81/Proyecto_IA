import { useState } from 'react'

interface ContactForm {
  name: string
  email: string
  company: string
  message: string
}

const initialForm: ContactForm = {
  name: '',
  email: '',
  company: '',
  message: '',
}

export function ContactPage() {
  const [form, setForm] = useState<ContactForm>(initialForm)
  const [submitted, setSubmitted] = useState(false)

  const isValid =
    form.name.trim().length >= 3 &&
    form.email.includes('@') &&
    form.message.trim().length >= 10

  const updateField = (field: keyof ContactForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setSubmitted(false)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isValid) {
      return
    }

    setSubmitted(true)
    setForm(initialForm)
  }

  return (
    <div className="public-stack two-col-layout">
      <section className="panel">
        <h2>Contactanos</h2>
        <p>
          Cuentanos tu necesidad para orientarte al servicio adecuado. Este
          formulario funciona en modo demo para validar flujo UX.
        </p>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Nombre completo
            <input
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              placeholder="Ej: Ana Martinez"
            />
          </label>

          <label>
            Correo
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="empresa@dominio.com"
            />
          </label>

          <label>
            Empresa (opcional)
            <input
              value={form.company}
              onChange={(event) => updateField('company', event.target.value)}
              placeholder="Nombre de empresa"
            />
          </label>

          <label>
            Mensaje
            <textarea
              value={form.message}
              onChange={(event) => updateField('message', event.target.value)}
              placeholder="Describe brevemente la situacion"
              rows={4}
            />
          </label>

          <button type="submit" className="button button-primary" disabled={!isValid}>
            Enviar mensaje
          </button>
        </form>

        {submitted && (
          <p className="status-ok">
            Mensaje enviado en modo demo. En la siguiente etapa lo conectamos a
            backend.
          </p>
        )}
      </section>

      <section className="panel">
        <h3>Canales directos</h3>
        <ul>
          <li>Email: soporte@proyectoia.local</li>
          <li>Telefono: +57 300 000 0000</li>
          <li>Horario: Lunes a Sabado, 7:00 a.m. - 7:00 p.m.</li>
        </ul>
      </section>
    </div>
  )
}
