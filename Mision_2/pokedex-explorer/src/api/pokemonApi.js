export const POKEMON_API_BASE_URL = 'https://pokeapi.co/api/v2/';

async function requestJson(url, resourceDescription) {
  let response;
  try {
    response = await fetch(url);
  } catch (error) {
    throw new Error(`No se pudo conectar con PokéAPI al solicitar ${resourceDescription}.`, { cause: error });
  }

  if (!response.ok) {
    throw new Error(`PokéAPI respondió HTTP ${response.status} al solicitar ${resourceDescription}.`);
  }

  let payload;
  try {
    payload = await response.json();
  } catch (error) {
    throw new Error(`La respuesta de PokéAPI para ${resourceDescription} no contiene JSON válido.`, { cause: error });
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new TypeError(`La respuesta de PokéAPI para ${resourceDescription} no tiene el formato de objeto esperado.`);
  }
  return payload;
}

/** Obtiene una página de referencias Pokémon. */
export async function getPokemonList({ limit = 20, offset = 0 } = {}) {
  if (!Number.isInteger(limit) || limit < 1 || !Number.isInteger(offset) || offset < 0) {
    throw new TypeError('El límite debe ser un entero positivo y el desplazamiento un entero no negativo.');
  }

  const url = new URL('pokemon/', POKEMON_API_BASE_URL);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('offset', String(offset));
  const payload = await requestJson(url, 'la lista de Pokémon');

  if (!Array.isArray(payload.results) || !payload.results.every((pokemon) =>
    pokemon && typeof pokemon.name === 'string' && typeof pokemon.url === 'string')) {
    throw new TypeError('PokéAPI devolvió una lista de Pokémon con un formato inesperado.');
  }
  return payload;
}

/** Obtiene los detalles de un Pokémon por nombre, número o URL de PokéAPI. */
export async function getPokemonDetails(identifier) {
  if ((typeof identifier !== 'string' && typeof identifier !== 'number') || String(identifier).trim() === '') {
    throw new TypeError('Se necesita un nombre, número o URL válido para consultar un Pokémon.');
  }
  const value = String(identifier).trim();
  const url = /^https:\/\/pokeapi\.co\/api\/v2\/pokemon\//i.test(value)
    ? value
    : new URL(`pokemon/${encodeURIComponent(value.toLowerCase())}/`, POKEMON_API_BASE_URL);
  const payload = await requestJson(url, `los detalles de «${value}»`);

  if (typeof payload.name !== 'string' || !Number.isFinite(payload.id)) {
    throw new TypeError(`PokéAPI devolvió datos incompletos para «${value}».`);
  }
  return payload;
}
