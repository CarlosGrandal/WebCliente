const isFiniteNumber = (value) => typeof value === 'number' && Number.isFinite(value);

function getStat(pokemon, statName) {
  const stat = Array.isArray(pokemon?.stats)
    ? pokemon.stats.find((entry) => entry?.stat?.name === statName)
    : undefined;
  return isFiniteNumber(stat?.base_stat) ? stat.base_stat : null;
}

/** Convierte una respuesta de detalle de PokéAPI al modelo que consume la interfaz. */
export function normalizePokemon(pokemon) {
  const sprites = pokemon?.sprites;
  const image = sprites?.other?.['official-artwork']?.front_default
    ?? sprites?.front_default
    ?? null;
  const stats = {
    hp: getStat(pokemon, 'hp'),
    attack: getStat(pokemon, 'attack'),
    defense: getStat(pokemon, 'defense'),
    specialAttack: getStat(pokemon, 'special-attack'),
    specialDefense: getStat(pokemon, 'special-defense'),
    speed: getStat(pokemon, 'speed'),
  };

  return {
    id: isFiniteNumber(pokemon?.id) && pokemon.id > 0 ? pokemon.id : null,
    name: typeof pokemon?.name === 'string' ? pokemon.name.trim().toLowerCase() : '',
    image: typeof image === 'string' && image.length > 0 ? image : null,
    types: Array.isArray(pokemon?.types)
      ? pokemon.types.map((entry) => entry?.type?.name).filter((type) => typeof type === 'string' && type.length > 0)
      : [],
    heightCm: isFiniteNumber(pokemon?.height) && pokemon.height >= 0 ? pokemon.height * 10 : null,
    weightKg: isFiniteNumber(pokemon?.weight) && pokemon.weight >= 0 ? pokemon.weight / 10 : null,
    stats,
  };
}

/** Transforma una colección de respuestas de detalle al modelo de tarjetas. */
export function normalizePokemonList(pokemonList) {
  return Array.isArray(pokemonList) ? pokemonList.map(normalizePokemon) : [];
}

/** Filtra por nombre, número de Pokédex o tipo. */
export function filterPokemon(pokemonList, { search = '', type = '' } = {}) {
  const normalizedSearch = String(search).trim().toLowerCase();
  const normalizedType = String(type).trim().toLowerCase();
  return (Array.isArray(pokemonList) ? pokemonList : []).filter((pokemon) => {
    const numericQuery = normalizedSearch.replace(/^#/, '');
    const matchesSearch = !normalizedSearch
      || (typeof pokemon?.name === 'string' && pokemon.name.includes(normalizedSearch))
      || (/^\d+$/.test(numericQuery) && String(pokemon?.id ?? '') === String(Number(numericQuery)));
    const matchesType = !normalizedType || (Array.isArray(pokemon?.types) && pokemon.types.includes(normalizedType));
    return matchesSearch && matchesType;
  });
}

/** Media del total de estadísticas base disponible por Pokémon en la colección. */
export function calculateAverageBaseStats(pokemonList) {
  const totals = (Array.isArray(pokemonList) ? pokemonList : [])
    .map((pokemon) => Object.values(pokemon?.stats ?? {}).filter(isFiniteNumber))
    .filter((availableStats) => availableStats.length > 0)
    .map((availableStats) => availableStats.reduce((total, stat) => total + stat, 0));

  if (totals.length === 0) return null;
  return totals.reduce((sum, total) => sum + total, 0) / totals.length;
}

export function getAvailableTypes(pokemonList) {
  return [...new Set((Array.isArray(pokemonList) ? pokemonList : [])
    .flatMap((pokemon) => Array.isArray(pokemon?.types) ? pokemon.types : []))].sort();
}
