import { useCallback, useEffect, useRef, useState } from 'react';
import { getPokemonDetails, getPokemonList } from './api/pokemonApi.js';
import {
  calculateAverageBaseStats,
  filterPokemon,
  getAvailableTypes,
  normalizePokemonList,
  sortPokemon,
} from './logic/pokemonLogic.js';
import Explorer from './components/Explorer.jsx';
import HeroSection from './components/HeroSection.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import SiteHeader from './components/SiteHeader.jsx';
import useLocalStorage from './hooks/useLocalStorage.js';

const PAGE_SIZE = 12;
const FAVORITES_STORAGE_KEY = 'pokedex-explorer:favorites:v1';

function appendUniquePokemon(currentPokemon, newPokemon) {
  const uniqueItems = new Map(currentPokemon.map((pokemon) => [pokemon.id ?? pokemon.name, pokemon]));
  newPokemon.forEach((pokemon) => {
    const key = pokemon.id ?? pokemon.name;
    if (key !== '' && !uniqueItems.has(key)) uniqueItems.set(key, pokemon);
  });
  return [...uniqueItems.values()];
}

export default function App() {
  const [items, setItems] = useState([]);
  const [nextOffset, setNextOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [failedOffset, setFailedOffset] = useState(null);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [sort, setSort] = useState('id');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [storedFavoriteIds, setStoredFavoriteIds] = useLocalStorage(FAVORITES_STORAGE_KEY, []);
  const [statusMessage, setStatusMessage] = useState('Conectando con PokéAPI…');
  const loadingRef = useRef(false);
  const mountedRef = useRef(false);
  const searchRef = useRef(null);

  const favoriteIds = Array.isArray(storedFavoriteIds) ? storedFavoriteIds : [];
  const favoriteIdSet = new Set(favoriteIds);
  const filteredPokemon = sortPokemon(
    filterPokemon(items, { search, type }),
    sort,
  );
  const visiblePokemon = showFavoritesOnly
    ? filteredPokemon.filter((pokemon) => favoriteIdSet.has(pokemon.id ?? pokemon.name))
    : filteredPokemon;
  const loadedFavoriteCount = items.reduce(
    (count, pokemon) => count + Number(favoriteIdSet.has(pokemon.id ?? pokemon.name)),
    0,
  );
  const types = getAvailableTypes(items);
  const averageStats = calculateAverageBaseStats(items);

  const loadPage = useCallback(async (offset, currentItems) => {
    if (loadingRef.current) return;
    const initialLoad = currentItems.length === 0;
    loadingRef.current = true;
    setIsLoading(true);
    setFailedOffset(null);
    setStatusMessage(initialLoad ? 'Conectando con PokéAPI…' : 'Cargando más Pokémon…');

    try {
      const page = await getPokemonList({ limit: PAGE_SIZE, offset });
      const details = await Promise.all(page.results.map(({ name }) => getPokemonDetails(name)));
      const newPokemon = normalizePokemonList(details);
      if (!mountedRef.current) return;
      const updatedItems = appendUniquePokemon(currentItems, newPokemon);
      setItems(updatedItems);
      setNextOffset(offset + page.results.length);
      setHasMore(typeof page.next === 'string' && page.results.length > 0);
      setStatusMessage(`${updatedItems.length} Pokémon cargados. Puedes seguir ampliando la selección.`);
    } catch (error) {
      if (!mountedRef.current) return;
      setFailedOffset(offset);
      setStatusMessage(error instanceof Error ? error.message : 'No se pudieron cargar los Pokémon.');
    } finally {
      loadingRef.current = false;
      if (mountedRef.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    void loadPage(0, []);
    return () => {
      mountedRef.current = false;
    };
  }, [loadPage]);

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
    setShowFavoritesOnly(false);
    searchRef.current?.focus();
  };
  const loadNextPage = ({ retry = false } = {}) => {
    const offset = retry ? failedOffset : nextOffset;
    if (offset !== null) return loadPage(offset, items);
  };
  const toggleFavorite = (pokemonId) => {
    setStoredFavoriteIds((current) => {
      const safeCurrent = Array.isArray(current) ? current : [];
      return safeCurrent.includes(pokemonId)
        ? safeCurrent.filter((favoriteId) => favoriteId !== pokemonId)
        : [...safeCurrent, pokemonId];
    });
  };
  const loadFailed = failedOffset !== null;
  const showInitialLoading = isLoading && items.length === 0;

  return (
    <main className="app-shell">
      <SiteHeader />
      <HeroSection />
      <Explorer
        search={search}
        onSearchChange={setSearch}
        searchRef={searchRef}
        type={type}
        types={types}
        onTypeChange={setType}
        sort={sort}
        onSortChange={setSort}
        items={items}
        visiblePokemon={visiblePokemon}
        averageStats={averageStats}
        favoriteIds={favoriteIds}
        loadedFavoriteCount={loadedFavoriteCount}
        showFavoritesOnly={showFavoritesOnly}
        onShowFavoritesOnlyChange={setShowFavoritesOnly}
        onToggleFavorite={toggleFavorite}
        statusMessage={statusMessage}
        isLoading={isLoading}
        showInitialLoading={showInitialLoading}
        loadFailed={loadFailed}
        hasMore={hasMore}
        onClearFilters={clearFilters}
        onLoadMore={() => loadNextPage()}
        onRetry={() => loadNextPage({ retry: true })}
      />
      <SiteFooter />
    </main>
  );
}
