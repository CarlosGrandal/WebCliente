const statLabels = [
  ['hp', 'PS'],
  ['attack', 'Ataque'],
  ['defense', 'Defensa'],
  ['speed', 'Velocidad'],
];

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

export function renderLoading(container) {
  const loading = createElement('div', 'loading-card');
  loading.append(createElement('span', 'loading-spinner loading-spinner-large'));
  loading.append(createElement('p', '', 'Buscando datos en PokéAPI…'));
  container.replaceChildren(loading);
}

export function renderPokemon(container, pokemonList, { onClearFilters } = {}) {
  container.replaceChildren();
  if (pokemonList.length === 0) {
    const empty = createElement('div', 'empty-state');
    empty.append(createElement('span', 'empty-icon', '⌕'));
    empty.append(createElement('h4', '', 'No hay coincidencias'));
    empty.append(createElement('p', '', 'Prueba con otro nombre o tipo entre los Pokémon cargados.'));
    if (onClearFilters) {
      const clearButton = createElement('button', 'clear-filters', 'Limpiar búsqueda y filtros');
      clearButton.type = 'button';
      clearButton.addEventListener('click', onClearFilters);
      empty.append(clearButton);
    }
    container.append(empty);
    return;
  }

  pokemonList.forEach((pokemon) => {
    const card = createElement('article', 'pokemon-card');
    const picture = createElement('div', `pokemon-picture${pokemon.types[0] ? ` tone-${pokemon.types[0]}` : ''}`);
    picture.append(createElement('span', 'card-orbit orbit-a'), createElement('span', 'card-orbit orbit-b'));
    if (pokemon.image) {
      const image = createElement('img');
      image.src = pokemon.image;
      image.alt = pokemon.name ? `Ilustración de ${pokemon.name}` : 'Ilustración de Pokémon';
      image.loading = 'lazy';
      image.addEventListener('error', () => {
        picture.replaceChildren(createElement('span', 'image-placeholder', '✳'));
        picture.append(createElement('small', 'image-placeholder-label', 'Imagen no disponible'));
      }, { once: true });
      picture.append(image);
    } else {
      picture.append(createElement('span', 'image-placeholder', '✳'));
      picture.append(createElement('small', 'image-placeholder-label', 'Imagen no disponible'));
    }

    const identity = createElement('div', 'pokemon-identity');
    identity.append(createElement('span', 'pokemon-number', pokemon.id === null ? 'N.º —' : `N.º ${String(pokemon.id).padStart(3, '0')}`));
    identity.append(createElement('h4', 'pokemon-name', pokemon.name || 'Nombre no disponible'));

    const badges = createElement('div', 'type-list');
    pokemon.types.forEach((type) => badges.append(createElement('span', `type-badge type-${type}`, type)));
    if (pokemon.types.length === 0) badges.append(createElement('span', 'type-badge type-unknown', 'Tipo no disponible'));

    const dimensions = createElement(
      'p',
      'dimensions',
      `ALTURA ${pokemon.heightCm === null ? '—' : `${pokemon.heightCm} cm`}  ·  PESO ${pokemon.weightKg === null ? '—' : `${pokemon.weightKg} kg`}`,
    );
    const stats = createElement('dl', 'card-stats');
    statLabels.forEach(([key, label]) => {
      const row = createElement('div', 'stat-item');
      row.append(createElement('dt', '', label), createElement('dd', '', pokemon.stats[key] ?? '—'));
      stats.append(row);
    });
    card.append(picture, identity, badges, dimensions, stats);
    container.append(card);
  });
}

export function renderTypeOptions(select, types) {
  const currentValue = select.value;
  select.replaceChildren(new Option('Todos los tipos', ''));
  types.forEach((type) => select.add(new Option(type, type)));
  select.value = types.includes(currentValue) ? currentValue : '';
}

export function renderSummary({ loadedCount, resultCount, averageStats }) {
  document.querySelector('#loaded-count').textContent = String(loadedCount);
  document.querySelector('#result-count').textContent = String(resultCount);
  document.querySelector('#average-stat').textContent = averageStats === null ? '—' : String(Math.round(averageStats));
}

export function setStatus(message, { error = false, loading = false } = {}) {
  const status = document.querySelector('#status-message');
  status.replaceChildren();
  status.className = `status-message${error ? ' is-error' : ''}${loading ? ' is-loading' : ''}`;
  if (loading) status.append(createElement('span', 'loading-spinner'));
  status.append(document.createTextNode(message));
}
