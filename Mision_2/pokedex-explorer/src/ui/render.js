const statLabels = [
  ['hp', 'PS'], ['attack', 'Ataque'], ['defense', 'Defensa'], ['speed', 'Velocidad'],
];

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

export function renderPokemon(container, pokemonList) {
  container.replaceChildren();
  if (pokemonList.length === 0) {
    container.append(createElement('p', 'empty-state', 'No se encontraron Pokémon con esos criterios.'));
    return;
  }

  pokemonList.forEach((pokemon) => {
    const card = createElement('article', 'pokemon-card');
    const picture = createElement('div', 'pokemon-picture');
    if (pokemon.image) {
      const image = createElement('img');
      image.src = pokemon.image;
      image.alt = pokemon.name ? `Ilustración de ${pokemon.name}` : 'Ilustración de Pokémon';
      image.loading = 'lazy';
      image.addEventListener('error', () => image.remove(), { once: true });
      picture.append(image);
    } else {
      picture.append(createElement('span', 'image-placeholder', 'Sin imagen'));
    }

    const identity = createElement('div', 'pokemon-identity');
    identity.append(createElement('span', 'pokemon-number', pokemon.id === null ? 'N.º —' : `N.º ${String(pokemon.id).padStart(3, '0')}`));
    identity.append(createElement('h2', 'pokemon-name', pokemon.name || 'Nombre no disponible'));
    const badges = createElement('div', 'type-list');
    pokemon.types.forEach((type) => badges.append(createElement('span', `type-badge type-${type}`, type)));

    const dimensions = createElement('p', 'dimensions', `Altura ${pokemon.heightCm === null ? '—' : `${pokemon.heightCm} cm`} · Peso ${pokemon.weightKg === null ? '—' : `${pokemon.weightKg} kg`}`);
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

export function renderSummary({ resultCount, averageStats, page, limit }) {
  document.querySelector('#result-count').textContent = String(resultCount);
  document.querySelector('#average-stat').textContent = averageStats === null ? '—' : String(Math.round(averageStats));
  document.querySelector('#page-label').textContent = String(Math.floor(page / limit) + 1);
}

export function setStatus(message, { error = false } = {}) {
  const status = document.querySelector('#status-message');
  status.textContent = message;
  status.classList.toggle('is-error', error);
}
