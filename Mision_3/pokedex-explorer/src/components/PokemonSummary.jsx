export default function PokemonSummary({ loadedCount, resultCount, averageStats, showInitialLoading }) {
  return (
    <div className="summary-grid" aria-live="polite" aria-atomic="true">
      <article className="summary-card summary-card-primary">
        <span className="summary-mark" aria-hidden="true">◉</span>
        <div><span className="summary-label">EN ESTA POKÉDEX</span><strong>{loadedCount || (showInitialLoading ? '—' : 0)}</strong><small>Pokémon cargados</small></div>
      </article>
      <article className="summary-card">
        <span className="summary-mark summary-mark-leaf" aria-hidden="true">✳</span>
        <div><span className="summary-label">COINCIDENCIAS</span><strong>{showInitialLoading ? '—' : resultCount}</strong><small>Con los filtros actuales</small></div>
      </article>
      <article className="summary-card">
        <span className="summary-mark summary-mark-sun" aria-hidden="true">↗</span>
        <div><span className="summary-label">MEDIA DE STATS BASE</span><strong>{averageStats === null ? '—' : Math.round(averageStats)}</strong><small>Total medio por Pokémon</small></div>
      </article>
    </div>
  );
}
