const CACHE_PREFIX = 'pokedex-explorer:cache:v1:';

/** Cambia este valor para ajustar la vida útil predeterminada de las respuestas. */
export const POKEMON_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function getStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function isPokemonPayload(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function removeEntry(storage, key) {
  try {
    storage.removeItem(key);
  } catch {
    // La caché nunca debe impedir que la API siga funcionando.
  }
}

export function pokemonListCacheKey({ limit, offset }) {
  return `${CACHE_PREFIX}list:limit=${limit}:offset=${offset}`;
}

export function pokemonDetailsCacheKey(identifier) {
  const normalizedIdentifier = String(identifier).trim().toLowerCase();
  return `${CACHE_PREFIX}detail:${encodeURIComponent(normalizedIdentifier)}`;
}

/** Devuelve null ante falta de caché, corrupción, caducidad o storage inaccesible. */
export function readPokemonCache(key, validate = isPokemonPayload, now = Date.now()) {
  const storage = getStorage();
  if (!storage || !key.startsWith(CACHE_PREFIX)) return null;

  let raw;
  try {
    raw = storage.getItem(key);
  } catch {
    return null;
  }
  if (raw === null) return null;

  try {
    const entry = JSON.parse(raw);
    const validEntry = entry?.version === 1
      && Number.isFinite(entry.expiresAt)
      && entry.expiresAt > now
      && isPokemonPayload(entry.data)
      && validate(entry.data);
    if (validEntry) return entry.data;
  } catch {
    // JSON corrupto o un validador que detecta una forma inesperada.
  }

  removeEntry(storage, key);
  return null;
}

function isQuotaError(error) {
  return error?.name === 'QuotaExceededError'
    || error?.code === 22
    || error?.code === 1014;
}

function getEvictionCandidates(storage, protectedKey, now) {
  const candidates = [];
  try {
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (!key?.startsWith(CACHE_PREFIX) || key === protectedKey) continue;
      let expiresAt = 0;
      try {
        expiresAt = JSON.parse(storage.getItem(key))?.expiresAt ?? 0;
      } catch {
        // Las entradas corruptas son las primeras candidatas a eliminar.
      }
      candidates.push({ key, expired: !Number.isFinite(expiresAt) || expiresAt <= now, expiresAt });
    }
  } catch {
    return [];
  }

  return candidates.sort((a, b) => Number(b.expired) - Number(a.expired) || a.expiresAt - b.expiresAt);
}

/** Guarda únicamente objetos que ya han superado la validación de la API. */
export function writePokemonCache(key, data, { ttlMs = POKEMON_CACHE_TTL_MS, now = Date.now() } = {}) {
  const storage = getStorage();
  if (!storage || !key.startsWith(CACHE_PREFIX) || !isPokemonPayload(data)
    || !Number.isFinite(ttlMs) || ttlMs <= 0) return false;

  const entry = JSON.stringify({ version: 1, expiresAt: now + ttlMs, data });
  try {
    storage.setItem(key, entry);
    return true;
  } catch (error) {
    if (!isQuotaError(error)) return false;
  }

  const candidates = getEvictionCandidates(storage, key, now);
  for (const candidate of candidates) {
    removeEntry(storage, candidate.key);
    try {
      storage.setItem(key, entry);
      return true;
    } catch (error) {
      if (!isQuotaError(error)) return false;
    }
  }
  return false;
}

/** Invalida solo las entradas de PokéDex Explorer; no toca otras claves del sitio. */
export function clearPokemonCache() {
  const storage = getStorage();
  if (!storage) return false;
  let cleared = true;
  try {
    for (let index = storage.length - 1; index >= 0; index -= 1) {
      const key = storage.key(index);
      if (key?.startsWith(CACHE_PREFIX)) storage.removeItem(key);
    }
  } catch {
    cleared = false;
  }
  return cleared;
}
