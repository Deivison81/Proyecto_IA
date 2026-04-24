import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface RegistrationForm {
  companyName: string
  contactName: string
  email: string
  phone: string
  service: string
  details: string
}

const initialForm: RegistrationForm = {
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  service: 'Soporte TI general',
  details: '',
}

export function ClientRegistrationPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<RegistrationForm>(initialForm)

  const isValid =
    form.companyName.trim().length > 2 &&
    form.contactName.trim().length > 2 &&
    form.email.includes('@') &&
    form.phone.trim().length >= 7

  const updateField = (field: keyof RegistrationForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isValid) {
      return
    }

    navigate('/login?tab=register', {
      state: {
        prefillRegister: {
          name: form.contactName.trim(),
          email: form.email.trim().toLowerCase(),
          role: 'client',
          companyName: form.companyName.trim(),
          phone: form.phone.trim(),
          service: form.service,
        },
      },
    })
  }

  return (
    <section className="panel">
      <h2>Registro de clientes</h2>
      <p>
        Completa esta informacion inicial y te llevaremos al registro real para
        activar tu cuenta de cliente y comenzar a crear solicitudes de servicio.
      </p>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Nombre de empresa
          <input
            value={form.companyName}
            onChange={(event) => updateField('companyName', event.target.value)}
          />
        </label>

        <label>
          Nombre de contacto
          <input
            value={form.contactName}
            onChange={(event) => updateField('contactName', event.target.value)}
          />
        </label>

        <label>
          Correo principal
          <input
            type="email"
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
          />
        </label>

        <label>
          Telefono
          <input
            value={form.phone}
            onChange={(event) => updateField('phone', event.target.value)}
          />
        </label>

        <label>
          Servicio prioritario
          <select
            value={form.service}
            onChange={(event) => updateField('service', event.target.value)}
          >
            <option>Soporte TI general</option>
            <option>Manejo de servidores</option>
            <option>Soporte al desarrollo</option>
            <option>Instalacion y soporte de redes</option>
            <option>Instalacion y soporte de camaras</option>
          </select>
        </label>

        <label>
          Comentarios (opcional)
          <textarea
            value={form.details}
            onChange={(event) => updateField('details', event.target.value)}
            rows={4}
          />
        </label>

        <button type="submit" className="button button-primary" disabled={!isValid}>
          Continuar con registro
        </button>
      </form>
    </section>
  )
}
