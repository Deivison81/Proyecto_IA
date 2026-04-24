import { serviceLines } from '../data/salesPack'

export function ServicesPage() {
  return (
    <div className="public-stack">
      <section className="panel">
        <h2>Servicios</h2>
        <p>
          Portafolio basado en tu pack comercial. Cada linea combina solucion
          tecnica, impacto operativo y ruta de crecimiento.
        </p>
      </section>

      {serviceLines.map((line) => (
        <section className="panel" key={line.key}>
          <p className="eyebrow">{line.subtitle}</p>
          <h3>{line.title}</h3>
          <p>{line.description}</p>

          <ul>
            {line.outcomes.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>

          {line.images.length > 0 && (
            <div className="gallery-grid">
              {line.images.map((imagePath) => (
                <img
                  key={imagePath}
                  src={imagePath}
                  alt={line.title}
                  loading="lazy"
                  className="gallery-item"
                />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  )
}
