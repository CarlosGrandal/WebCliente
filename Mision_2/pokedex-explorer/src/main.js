import './styles/main.css';
import { getPokemonDetails, getPokemonList } from './api/pokemonApi.js';
import {
  calculateAverageBaseStats,
  filterPokemon,
  getAvailableTypes,
  normalizePokemonList,
  sortPokemon,
} from './logic/pokemonLogic.js';
import {
  renderLoading,
  renderPokemon,
  renderSummary,
  renderTypeOptions,
  setStatus,
} from './ui/render.js';

const PAGE_SIZE = 12;
const state = {
  items: [],
  nextOffset: 0,
  hasMore: true,
  isLoading: false,
  lastFailedOffset: null,
};

const grid = document.querySelector('#pokemon-grid');
const searchInput = document.querySelector('#pokemon-search');
const typeSelect = document.querySelector('#type-filter');
const sortSelect = document.querySelector('#sort-order');
const loadMoreButton = document.querySelector('#load-more');
const retryButton = document.querySelector('#retry-load');
const endMessage = document.querySelector('#end-message');

function updateVisiblePokemon() {
  const filtered = filterPokemon(state.items, {
    search: searchInput.value,
    type: typeSelect.value,
  });
  const ordered = sortPokemon(filtered, sortSelect.value);
  renderPokemon(grid, ordered, {
    onClearFilters: () => {
      searchInput.value = '';
      typeSelect.value = '';
      updateVisiblePokemon();
      searchInput.focus();
    },
  });
  renderSummary({
    loadedCount: state.items.length,
    resultCount: ordered.length,
    averageStats: calculateAverageBaseStats(state.items),
  });
  document.querySelector('#collection-caption').textContent = `${ordered.length} de ${state.items.length} cargados`;
}

function updateLoadControls() {
  const failed = state.lastFailedOffset !== null;
  loadMoreButton.hidden = !state.hasMore || failed;
  retryButton.hidden = !failed;
  endMessage.hidden = state.hasMore || failed || state.isLoading || state.items.length === 0;
  loadMoreButton.disabled = state.isLoading;
  retryButton.disabled = state.isLoading;
  loadMoreButton.textContent = state.isLoading && state.items.length > 0
    ? 'Cargando Pokémon…'
    : 'Cargar más Pokémon ↓';
}

function appendUniquePokemon(pokemonList) {
  const uniqueItems = new Map(state.items.map((pokemon) => [pokemon.id ?? pokemon.name, pokemon]));
  pokemonList.forEach((pokemon) => {
    const key = pokemon.id ?? pokemon.name;
    if (key !== '' && !uniqueItems.has(key)) uniqueItems.set(key, pokemon);
  });
  state.items = [...uniqueItems.values()];
}

async function loadNextPage({ retry = false } = {}) {
  if (state.isLoading) return;
  const offset = retry ? state.lastFailedOffset : state.nextOffset;
  const isInitialLoad = state.items.length === 0;
  state.isLoading = true;
  state.lastFailedOffset = null;

  if (isInitialLoad) {
    setStatus('Conectando con PokéAPI…', { loading: true });
    renderLoading(grid);
  } else {
    setStatus('Cargando más Pokémon…', { loading: true });
  }
  grid.setAttribute('aria-busy', 'true');
  updateLoadControls();

  try {
    const page = await getPokemonList({ limit: PAGE_SIZE, offset });
    const details = await Promise.all(page.results.map(({ name }) => getPokemonDetails(name)));
    const addedPokemon = normalizePokemonList(details);
    appendUniquePokemon(addedPokemon);
    state.nextOffset = offset + page.results.length;
    state.hasMore = typeof page.next === 'string' && page.results.length > 0;
    state.lastFailedOffset = null;

    renderTypeOptions(typeSelect, getAvailableTypes(state.items));
    updateVisiblePokemon();
    setStatus(`${state.items.length} Pokémon cargados. Puedes seguir ampliando la selección.`);
  } catch (error) {
    state.lastFailedOffset = offset;
    setStatus(error instanceof Error ? error.message : 'No se pudieron cargar los Pokémon.', { error: true });
    if (isInitialLoad) grid.replaceChildren();
  } finally {
    state.isLoading = false;
    grid.setAttribute('aria-busy', 'false');
    updateLoadControls();
  }
}

searchInput.addEventListener('input', updateVisiblePokemon);
typeSelect.addEventListener('change', updateVisiblePokemon);
sortSelect.addEventListener('change', updateVisiblePokemon);
loadMoreButton.addEventListener('click', () => loadNextPage());
retryButton.addEventListener('click', () => loadNextPage({ retry: true }));

document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    searchInput.focus();
  }
});

loadNextPage();
