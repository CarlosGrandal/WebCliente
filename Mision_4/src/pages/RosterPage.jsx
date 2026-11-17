export default function RosterPage() {
  return (
    <div className="page-wrap roster-wrap">
      <header className="page-heading">
        <div>
          <p className="eyebrow">TEMPORADA 2026 / 27 <span className="eyebrow-dot" /></p>
          <h1>La plantilla</h1>
          <p className="page-intro">El equipo se construye con cada nuevo jugador.</p>
        </div>
      </header>
      <section className="roster-empty">
        <div className="roster-ball" aria-hidden="true">⚽</div>
        <p className="eyebrow">NUEVO CURSO, NUEVO EQUIPO</p>
        <h2>Estamos preparando el once.</h2>
        <p>Cuando se confirme la plantilla de esta temporada, la encontrarás aquí.</p>
      </section>
    </div>
  )
}
