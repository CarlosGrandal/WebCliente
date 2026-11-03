import {
  pokemonDetailsCacheKey,
  pokemonListCacheKey,
  readPokemonCache,
  writePokemonCache,
} from './pokemonCache.js';

export const POKEMON_API_BASE_URL = 'https://pokeapi.co/api/v2/';
const pendingRequests = new Map();

function isPokemonListPayload(payload) {
  return Number.isFinite(payload?.count)
    && Array.isArray(payload.results)
    && payload.results.every((pokemon) => pokemon
      && typeof pokemon.name === 'string'
      && typeof pokemon.url === 'string')
    && (payload.next === null || typeof payload.next === 'string')
    && (payload.previous === null || typeof payload.previous === 'string');
}

function isPokemonDetailsPayload(payload) {
  return typeof payload?.name === 'string'
    && payload.name.length > 0
    && Number.isInteger(payload.id)
    && payload.id > 0;
}

async function requestJson({ url, cacheKey, resourceDescription, validate }) {
  const cachedPayload = readPokemonCache(cacheKey, validate);
  if (cachedPayload) return cachedPayload;

  const pendingRequest = pendingRequests.get(cacheKey);
  if (pendingRequest) return pendingRequest;

  const request = (async () => {
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
    if (!validate(payload)) {
      throw new TypeError(`PokéAPI devolvió datos inesperados al solicitar ${resourceDescription}.`);
    }

    // Un fallo o cuota agotada al escribir no altera la respuesta de red válida.
    writePokemonCache(cacheKey, payload);
    return payload;
  })();

  pendingRequests.set(cacheKey, request);
  try {
    return await request;
  } finally {
    if (pendingRequests.get(cacheKey) === request) pendingRequests.delete(cacheKey);
  }
}

/** Obtiene una página de referencias Pokémon, identificada por límite y desplazamiento. */
export async function getPokemonList({ limit = 20, offset = 0 } = {}) {
  if (!Number.isInteger(limit) || limit < 1 || !Number.isInteger(offset) || offset < 0) {
    throw new TypeError('El límite debe ser un entero positivo y el desplazamiento un entero no negativo.');
  }

  const url = new URL('pokemon/', POKEMON_API_BASE_URL);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('offset', String(offset));
  return requestJson({
    url,
    cacheKey: pokemonListCacheKey({ limit, offset }),
    resourceDescription: 'la lista de Pokémon',
    validate: isPokemonListPayload,
  });
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
  return requestJson({
    url,
    cacheKey: pokemonDetailsCacheKey(value),
    resourceDescription: `los detalles de «${value}»`,
    validate: isPokemonDetailsPayload,
  });
}
