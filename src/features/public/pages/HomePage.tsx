import { serviceLines } from '../data/salesPack'

export function HomePage() {
  return (
    <div className="public-stack">
      {serviceLines.map((line) => (
        <section className="panel service-section" key={line.key}>
          <div className="service-copy">
            <p className="eyebrow">{line.subtitle}</p>
            <h3>{line.title}</h3>
            <p>{line.description}</p>

            <ul>
              {line.outcomes.map((outcome) => (
                <li key={outcome}>{outcome}</li>
              ))}
            </ul>
          </div>

          {line.images.length > 0 && (
            <div className="gallery-grid service-gallery">
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
