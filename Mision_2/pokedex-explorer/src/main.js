import './styles/main.css';
import { getPokemonDetails, getPokemonList } from './api/pokemonApi.js';
import { calculateAverageBaseStats, filterPokemon, getAvailableTypes, normalizePokemonList } from './logic/pokemonLogic.js';
import { renderPokemon, renderSummary, renderTypeOptions, setStatus } from './ui/render.js';

const PAGE_SIZE = 12;
const state = { offset: 0, items: [], count: null, next: null, previous: null };
const grid = document.querySelector('#pokemon-grid');
const searchInput = document.querySelector('#pokemon-search');
const typeSelect = document.querySelector('#type-filter');
const previousButton = document.querySelector('#previous-page');
const nextButton = document.querySelector('#next-page');

function updateVisiblePokemon() {
  const visiblePokemon = filterPokemon(state.items, { search: searchInput.value, type: typeSelect.value });
  renderPokemon(grid, visiblePokemon);
  renderSummary({
    resultCount: visiblePokemon.length,
    averageStats: calculateAverageBaseStats(state.items),
    page: state.offset,
    limit: PAGE_SIZE,
  });
}

async function loadPage(offset = 0) {
  state.offset = offset;
  setStatus('Cargando Pokémon desde PokéAPI…');
  grid.replaceChildren();
  previousButton.disabled = true;
  nextButton.disabled = true;

  try {
    const page = await getPokemonList({ limit: PAGE_SIZE, offset });
    const details = await Promise.all(page.results.map(({ name }) => getPokemonDetails(name)));
    state.items = normalizePokemonList(details);
    state.count = Number.isFinite(page.count) ? page.count : null;
    state.next = typeof page.next === 'string' ? page.next : null;
    state.previous = typeof page.previous === 'string' ? page.previous : null;
    renderTypeOptions(typeSelect, getAvailableTypes(state.items));
    updateVisiblePokemon();
    setStatus(state.count === null ? 'Pokémon cargados desde PokéAPI.' : `${state.count.toLocaleString('es-ES')} Pokémon disponibles en PokéAPI.`);
    previousButton.disabled = !state.previous;
    nextButton.disabled = !state.next;
  } catch (error) {
    state.items = [];
    updateVisiblePokemon();
    setStatus(error instanceof Error ? error.message : 'Se produjo un error inesperado al cargar Pokémon.', { error: true });
    console.error('Error al cargar Pokémon:', error);
  }
}

searchInput.addEventListener('input', updateVisiblePokemon);
typeSelect.addEventListener('change', updateVisiblePokemon);
previousButton.addEventListener('click', () => loadPage(Math.max(0, state.offset - PAGE_SIZE)));
nextButton.addEventListener('click', () => loadPage(state.offset + PAGE_SIZE));

loadPage();
