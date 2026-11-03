import PokemonCard from './PokemonCard.jsx';

export default function PokemonResults({
  items,
  visiblePokemon,
  statusMessage,
  isLoading,
  showInitialLoading,
  loadFailed,
  onClearFilters,
}) {
  return (
    <>
      <div className="results-heading">
        <div><p className="eyebrow">TU COLECCIÓN</p><h3>Pokémon descubiertos</h3></div>
        <span className="collection-caption">
          {showInitialLoading ? 'Cargando datos…' : `${visiblePokemon.length} de ${items.length} cargados`}
        </span>
      </div>
      <p className={`status-message${loadFailed ? ' is-error' : ''}${isLoading ? ' is-loading' : ''}`} role="status" aria-live="polite" aria-atomic="true">
        {isLoading && <span className="loading-spinner" aria-hidden="true" />}{statusMessage}
      </p>
      <div className="pokemon-grid" aria-label="Resultados de Pokémon" aria-busy={isLoading}>
        {showInitialLoading ? (
          <div className="loading-card"><span className="loading-spinner loading-spinner-large" /><p>Buscando datos en PokéAPI…</p></div>
        ) : items.length === 0 && loadFailed ? null : visiblePokemon.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">⌕</span><h4>No hay coincidencias</h4>
            <p>Prueba con otro nombre o tipo entre los Pokémon cargados.</p>
            <button className="clear-filters" type="button" onClick={onClearFilters}>Limpiar búsqueda y filtros</button>
          </div>
        ) : visiblePokemon.map((pokemon) => <PokemonCard key={pokemon.id ?? pokemon.name} pokemon={pokemon} />)}
      </div>
    </>
  );
}
