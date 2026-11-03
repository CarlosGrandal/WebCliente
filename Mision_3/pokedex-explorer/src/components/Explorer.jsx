import ExplorerControls from './ExplorerControls.jsx';
import LoadControls from './LoadControls.jsx';
import PokemonResults from './PokemonResults.jsx';
import PokemonSummary from './PokemonSummary.jsx';

export default function Explorer({
  search,
  onSearchChange,
  searchRef,
  type,
  types,
  onTypeChange,
  sort,
  onSortChange,
  items,
  visiblePokemon,
  averageStats,
  favoriteIds,
  loadedFavoriteCount,
  showFavoritesOnly,
  onShowFavoritesOnlyChange,
  onToggleFavorite,
  statusMessage,
  isLoading,
  showInitialLoading,
  loadFailed,
  hasMore,
  onClearFilters,
  onLoadMore,
  onRetry,
}) {
  return (
    <section className="explorer" id="explorer" aria-labelledby="explorer-title">
      <div className="section-intro">
        <div><p className="eyebrow"><span>02</span> · REGISTRO NACIONAL</p><h2 id="explorer-title">Explora la Pokédex</h2></div>
        <span className="loaded-scope">MOSTRANDO LOS CARGADOS</span>
      </div>
      <ExplorerControls
        search={search}
        onSearchChange={onSearchChange}
        searchRef={searchRef}
        type={type}
        types={types}
        onTypeChange={onTypeChange}
        sort={sort}
        onSortChange={onSortChange}
        loadedFavoriteCount={loadedFavoriteCount}
        showFavoritesOnly={showFavoritesOnly}
        onShowFavoritesOnlyChange={onShowFavoritesOnlyChange}
      />
      <PokemonSummary
        loadedCount={items.length}
        resultCount={visiblePokemon.length}
        averageStats={averageStats}
        showInitialLoading={showInitialLoading}
      />
      <PokemonResults
        items={items}
        visiblePokemon={visiblePokemon}
        favoriteIds={favoriteIds}
        onToggleFavorite={onToggleFavorite}
        statusMessage={statusMessage}
        isLoading={isLoading}
        showInitialLoading={showInitialLoading}
        loadFailed={loadFailed}
        showFavoritesOnly={showFavoritesOnly}
        onClearFilters={onClearFilters}
      />
      <LoadControls
        hasMore={hasMore}
        loadFailed={loadFailed}
        isLoading={isLoading}
        loadedCount={items.length}
        onLoadMore={onLoadMore}
        onRetry={onRetry}
      />
    </section>
  );
}
