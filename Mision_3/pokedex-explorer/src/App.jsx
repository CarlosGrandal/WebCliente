import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getPokemonDetails, getPokemonList } from './api/pokemonApi.js';
import {
  calculateAverageBaseStats,
  filterPokemon,
  getAvailableTypes,
  normalizePokemonList,
  sortPokemon,
} from './logic/pokemonLogic.js';
import PokemonCard from './components/PokemonCard.jsx';

const PAGE_SIZE = 12;

export default function App() {
  const [items, setItems] = useState([]);
  const [nextOffset, setNextOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [failedOffset, setFailedOffset] = useState(null);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [sort, setSort] = useState('id');
  const [status, setStatus] = useState({ message: 'Conectando con PokéAPI…', loading: true, error: false });
  const loadingRef = useRef(false);
  const searchRef = useRef(null);

  const visiblePokemon = useMemo(() => sortPokemon(
    filterPokemon(items, { search, type }),
    sort,
  ), [items, search, type, sort]);
  const types = useMemo(() => getAvailableTypes(items), [items]);
  const averageStats = useMemo(() => calculateAverageBaseStats(items), [items]);

  const loadNextPage = useCallback(async ({ retry = false } = {}) => {
    if (loadingRef.current) return;
    const offset = retry ? failedOffset : nextOffset;
    if (offset === null) return;
    const initialLoad = items.length === 0;
    loadingRef.current = true;
    setIsLoading(true);
    setFailedOffset(null);
    setStatus({
      message: initialLoad ? 'Conectando con PokéAPI…' : 'Cargando más Pokémon…',
      loading: true,
      error: false,
    });

    try {
      const page = await getPokemonList({ limit: PAGE_SIZE, offset });
      const details = await Promise.all(page.results.map(({ name }) => getPokemonDetails(name)));
      const newPokemon = normalizePokemonList(details);
      setItems((current) => {
        const uniqueItems = new Map(current.map((pokemon) => [pokemon.id ?? pokemon.name, pokemon]));
        newPokemon.forEach((pokemon) => {
          const key = pokemon.id ?? pokemon.name;
          if (key !== '' && !uniqueItems.has(key)) uniqueItems.set(key, pokemon);
        });
        return [...uniqueItems.values()];
      });
      setNextOffset(offset + page.results.length);
      setHasMore(typeof page.next === 'string' && page.results.length > 0);
      setStatus({
        message: `${items.length + newPokemon.length} Pokémon cargados. Puedes seguir ampliando la selección.`,
        loading: false,
        error: false,
      });
    } catch (error) {
      setFailedOffset(offset);
      setStatus({
        message: error instanceof Error ? error.message : 'No se pudieron cargar los Pokémon.',
        loading: false,
        error: true,
      });
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, [failedOffset, items.length, nextOffset]);

  useEffect(() => {
    loadNextPage();
  }, []); // La primera página se carga una vez al montar la aplicación.

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const clearFilters = () => {
    setSearch('');
    setType('');
    searchRef.current?.focus();
  };
  const loadFailed = failedOffset !== null;
  const showInitialLoading = isLoading && items.length === 0;

  return (
    <main className="app-shell">
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="PokéDex Explorer, inicio">
          <span className="brand-ball" aria-hidden="true"><i /></span>
          <span className="brand-copy"><strong>PokéDex</strong><small>FIELD GUIDE</small></span>
        </a>
        <span className="data-source"><i aria-hidden="true" /> DATOS EN DIRECTO · POKÉAPI</span>
      </header>

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

      <section className="explorer" id="explorer" aria-labelledby="explorer-title">
        <div className="section-intro">
          <div><p className="eyebrow"><span>02</span> · REGISTRO NACIONAL</p><h2 id="explorer-title">Explora la Pokédex</h2></div>
          <span className="loaded-scope">MOSTRANDO LOS CARGADOS</span>
        </div>

        <div className="control-panel">
          <div className="toolbar">
            <label className="search-field" htmlFor="pokemon-search">
              <span className="control-icon" aria-hidden="true">⌕</span>
              <span className="visually-hidden">Buscar Pokémon por nombre</span>
              <input ref={searchRef} id="pokemon-search" type="search" placeholder="Busca un Pokémon…" autoComplete="off" value={search} onChange={(event) => setSearch(event.target.value)} />
              <kbd aria-hidden="true">⌘ K</kbd>
            </label>
            <label className="select-field" htmlFor="type-filter"><span className="select-label">TIPO</span>
              <select id="type-filter" value={type} onChange={(event) => setType(event.target.value)}>
                <option value="">Todos los tipos</option>
                {types.map((availableType) => <option value={availableType} key={availableType}>{availableType}</option>)}
              </select>
            </label>
            <label className="select-field sort-field" htmlFor="sort-order"><span className="select-label">ORDENAR</span>
              <select id="sort-order" value={sort} onChange={(event) => setSort(event.target.value)}><option value="id">Número Pokédex</option><option value="name">Nombre A–Z</option></select>
            </label>
          </div>
          <p className="scope-note"><span aria-hidden="true">ⓘ</span> La búsqueda, el filtro y el orden se aplican a los Pokémon cargados hasta ahora.</p>
        </div>

        <div className="summary-grid" aria-live="polite" aria-atomic="true">
          <article className="summary-card summary-card-primary"><span className="summary-mark" aria-hidden="true">◉</span><div><span className="summary-label">EN ESTA POKÉDEX</span><strong>{items.length || (showInitialLoading ? '—' : 0)}</strong><small>Pokémon cargados</small></div></article>
          <article className="summary-card"><span className="summary-mark summary-mark-leaf" aria-hidden="true">✳</span><div><span className="summary-label">COINCIDENCIAS</span><strong>{showInitialLoading ? '—' : visiblePokemon.length}</strong><small>Con los filtros actuales</small></div></article>
          <article className="summary-card"><span className="summary-mark summary-mark-sun" aria-hidden="true">↗</span><div><span className="summary-label">MEDIA DE STATS BASE</span><strong>{averageStats === null ? '—' : Math.round(averageStats)}</strong><small>Total medio por Pokémon</small></div></article>
        </div>

        <div className="results-heading"><div><p className="eyebrow">TU COLECCIÓN</p><h3>Pokémon descubiertos</h3></div><span className="collection-caption">{showInitialLoading ? 'Cargando datos…' : `${visiblePokemon.length} de ${items.length} cargados`}</span></div>
        <p className={`status-message${status.error ? ' is-error' : ''}${status.loading ? ' is-loading' : ''}`} role="status" aria-live="polite" aria-atomic="true">
          {status.loading && <span className="loading-spinner" aria-hidden="true" />}{status.message}
        </p>
        <div className="pokemon-grid" aria-label="Resultados de Pokémon" aria-busy={isLoading}>
          {showInitialLoading ? (
            <div className="loading-card"><span className="loading-spinner loading-spinner-large" /><p>Buscando datos en PokéAPI…</p></div>
          ) : items.length === 0 && loadFailed ? null : visiblePokemon.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">⌕</span><h4>No hay coincidencias</h4>
              <p>Prueba con otro nombre o tipo entre los Pokémon cargados.</p>
              <button className="clear-filters" type="button" onClick={clearFilters}>Limpiar búsqueda y filtros</button>
            </div>
          ) : visiblePokemon.map((pokemon) => <PokemonCard key={pokemon.id ?? pokemon.name} pokemon={pokemon} />)}
        </div>
        <div className="load-controls">
          {!loadFailed && hasMore && <button className="load-button" type="button" disabled={isLoading} onClick={() => loadNextPage()}>{isLoading && items.length > 0 ? 'Cargando Pokémon…' : <>Cargar más Pokémon <span aria-hidden="true">↓</span></>}</button>}
          {loadFailed && <button className="retry-button" type="button" disabled={isLoading} onClick={() => loadNextPage({ retry: true })}>Reintentar carga</button>}
          {!hasMore && !loadFailed && !isLoading && items.length > 0 && <span className="end-message">Has llegado al final de la Pokédex cargable.</span>}
        </div>
      </section>

      <footer className="site-footer"><span>PokéDex Explorer <i>·</i> Proyecto académico</span><span>Datos proporcionados por <a href="https://pokeapi.co/" target="_blank" rel="noreferrer">PokéAPI ↗</a></span></footer>
    </main>
  );
}
