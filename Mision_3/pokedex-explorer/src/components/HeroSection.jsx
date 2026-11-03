export default function HeroSection() {
  return (
    <section className="hero" id="inicio" aria-labelledby="page-title">
      <div className="hero-copy">
        <p className="eyebrow"><span>01</span> · GUÍA DE CAMPO DIGITAL</p>
        <h1 id="page-title">Un mundo lleno<br />de <em>Pokémon.</em></h1>
        <p className="hero-description">Consulta sus tipos, medidas y estadísticas. Tu próxima aventura empieza por conocerlos.</p>
        <a className="hero-link" href="#explorer">Abrir la Pokédex <span aria-hidden="true">↓</span></a>
      </div>
      <div className="hero-art" aria-hidden="true">
        <span className="hero-spark spark-one">✳</span><span className="hero-spark spark-two">✦</span>
        <span className="hero-disc"><span className="hero-disc-inner"><span className="hero-disc-band" /><span className="hero-disc-button" /></span></span>
        <span className="hero-art-label">N.º 001 — ∞</span>
      </div>
      <div className="hero-index" aria-hidden="true">POKÉDEX / 2026</div>
    </section>
  );
}
