const links = [
  { id: 'inscripcion', number: '01', label: 'Inscripción' },
  { id: 'plantilla', number: '02', label: 'Plantilla' },
]

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <a className="club-brand" href="#inicio" onClick={(event) => event.preventDefault()} aria-label="Los Chavales FC, inicio">
        <img className="club-crest" src="/images/los-chavales-crest.png" alt="" />
        <span className="brand-name">LOS CHAVALES <b>FC</b><small>CLUB DE FÚTBOL · MADRID</small></span>
      </a>
      <div className="sidebar-rule" />
      <p className="nav-label">MENÚ PRINCIPAL</p>
      <nav className="main-nav" aria-label="Navegación principal">
        {links.map((link) => (
          <button key={link.id} className={`nav-link ${activePage === link.id ? 'is-active' : ''}`} type="button" onClick={() => onNavigate(link.id)} aria-current={activePage === link.id ? 'page' : undefined}>
            <span className="nav-number">{link.number}</span><span>{link.label}</span>{activePage === link.id && <span className="nav-arrow" aria-hidden="true">↗</span>}
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-motto">Perder, perder y perder</div>
        <div className="sidebar-meta"><span className="sidebar-star">✳</span><span>MADRID, ESPAÑA<br />FUNDADO EN 2014</span></div>
      </div>
    </aside>
  )
}
