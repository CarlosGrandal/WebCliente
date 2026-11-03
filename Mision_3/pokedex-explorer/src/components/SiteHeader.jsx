export default function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="#inicio" aria-label="PokéDex Explorer, inicio">
        <span className="brand-ball" aria-hidden="true"><i /></span>
        <span className="brand-copy"><strong>PokéDex</strong><small>FIELD GUIDE</small></span>
      </a>
      <span className="data-source"><i aria-hidden="true" /> DATOS EN DIRECTO · POKÉAPI</span>
    </header>
  );
}
