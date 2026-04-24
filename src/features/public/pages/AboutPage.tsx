export function AboutPage() {
  return (
    <div className="public-stack">
      <section className="panel">
        <h2>Quienes somos</h2>
        <p>
          Equipo especializado en continuidad operativa de infraestructura,
          soporte TI y operacion de servicios tecnicos empresariales.
        </p>
      </section>

      <section className="panel">
        <h3>Nuestra propuesta</h3>
        <ul>
          <li>Un unico canal para incidencias y requerimientos tecnicos.</li>
          <li>Priorizacion clara para reducir tiempos de atencion.</li>
          <li>Trazabilidad completa para auditoria y mejora continua.</li>
        </ul>
      </section>

      <section className="panel">
        <h3>Principios de trabajo</h3>
        <div className="kpi-grid">
          <article>
            <strong>Respuesta oportuna</strong>
            <p>Gestion de tickets con enfoque en impacto operativo.</p>
          </article>
          <article>
            <strong>Estandarizacion</strong>
            <p>Procesos repetibles para soporte, redes y servidores.</p>
          </article>
          <article>
            <strong>Comunicacion clara</strong>
            <p>Actualizaciones continuas para clientes y equipos internos.</p>
          </article>
        </div>
      </section>
    </div>
  )
}
