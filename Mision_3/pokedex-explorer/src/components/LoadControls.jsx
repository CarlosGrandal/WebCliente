export default function LoadControls({
  hasMore,
  loadFailed,
  isLoading,
  loadedCount,
  onLoadMore,
  onRetry,
}) {
  return (
    <div className="load-controls">
      {!loadFailed && hasMore && (
        <button className="load-button" type="button" disabled={isLoading} onClick={onLoadMore}>
          {isLoading && loadedCount > 0 ? 'Cargando Pokémon…' : <>Cargar más Pokémon <span aria-hidden="true">↓</span></>}
        </button>
      )}
      {loadFailed && <button className="retry-button" type="button" disabled={isLoading} onClick={onRetry}>Reintentar carga</button>}
      {!hasMore && !loadFailed && !isLoading && loadedCount > 0 && (
        <span className="end-message">Has llegado al final de la Pokédex cargable.</span>
      )}
    </div>
  );
}
