import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import { getPokemonDetails, getPokemonList } from '../src/api/pokemonApi.js';
import {
  clearPokemonCache,
  pokemonDetailsCacheKey,
  pokemonListCacheKey,
  readPokemonCache,
  writePokemonCache,
} from '../src/api/pokemonCache.js';
import { normalizePokemon } from '../src/logic/pokemonLogic.js';

class MemoryStorage {
  values = new Map();
  quotaExceeded = false;

  get length() { return this.values.size; }
  key(index) { return [...this.values.keys()][index] ?? null; }
  getItem(key) { return this.values.get(String(key)) ?? null; }
  removeItem(key) { this.values.delete(String(key)); }
  setItem(key, value) {
    if (this.quotaExceeded) {
      const error = new Error('Storage quota exceeded');
      error.name = 'QuotaExceededError';
      throw error;
    }
    this.values.set(String(key), String(value));
  }
}

const originalFetch = globalThis.fetch;
const originalStorageDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
let storage;

function listPayload() {
  return {
    count: 1,
    next: null,
    previous: null,
    results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
  };
}

function jsonResponse(payload, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => payload };
}

beforeEach(() => {
  storage = new MemoryStorage();
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage });
  globalThis.fetch = async () => jsonResponse(listPayload());
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalStorageDescriptor) {
    Object.defineProperty(globalThis, 'localStorage', originalStorageDescriptor);
  } else {
    delete globalThis.localStorage;
  }
});

test('cachea listas por límite y desplazamiento', async () => {
  let calls = 0;
  globalThis.fetch = async () => { calls += 1; return jsonResponse(listPayload()); };

  await getPokemonList({ limit: 1, offset: 0 });
  await getPokemonList({ limit: 1, offset: 0 });
  await getPokemonList({ limit: 1, offset: 1 });

  assert.equal(calls, 2);
});

test('comparte la misma petición de detalle mientras sigue pendiente', async () => {
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    await new Promise((resolve) => setTimeout(resolve, 15));
    return jsonResponse({ id: 1, name: 'bulbasaur' });
  };

  const results = await Promise.all([getPokemonDetails('Bulbasaur'), getPokemonDetails('bulbasaur')]);
  assert.equal(calls, 1);
  assert.deepEqual(results[0], results[1]);
});

test('no cachea errores HTTP, de red, JSON inválido ni respuestas incompletas', async () => {
  let call = 0;
  globalThis.fetch = async () => {
    call += 1;
    if (call === 1) return jsonResponse({}, 503);
    if (call === 2) throw new TypeError('offline');
    if (call === 3) return { ok: true, status: 200, json: async () => { throw new SyntaxError('bad JSON'); } };
    if (call === 4) return jsonResponse({ count: 1, results: [] });
    return jsonResponse(listPayload());
  };

  await assert.rejects(getPokemonList({ limit: 7, offset: 0 }), /HTTP 503/);
  await assert.rejects(getPokemonList({ limit: 7, offset: 0 }), /conectar/);
  await assert.rejects(getPokemonList({ limit: 7, offset: 0 }), /JSON válido/);
  await assert.rejects(getPokemonList({ limit: 7, offset: 0 }), /inesperados/);
  await getPokemonList({ limit: 7, offset: 0 });
  assert.equal(call, 5);
});

test('descarta entradas corruptas y caducadas antes de pedir datos nuevos', async () => {
  let calls = 0;
  globalThis.fetch = async () => { calls += 1; return jsonResponse(listPayload()); };
  storage.setItem(pokemonListCacheKey({ limit: 8, offset: 0 }), '{broken');
  storage.setItem(pokemonListCacheKey({ limit: 8, offset: 8 }), JSON.stringify({
    version: 1,
    expiresAt: Date.now() - 1,
    data: listPayload(),
  }));

  await getPokemonList({ limit: 8, offset: 0 });
  await getPokemonList({ limit: 8, offset: 8 });
  assert.equal(calls, 2);
});

test('aplica el TTL configurable y vuelve a consultar detalles de forma incompleta', async () => {
  const key = pokemonDetailsCacheKey('pikachu');
  assert.equal(writePokemonCache(key, { id: 25, name: 'pikachu' }, { ttlMs: 10, now: 100 }), true);
  assert.deepEqual(readPokemonCache(key, undefined, 109), { id: 25, name: 'pikachu' });
  assert.equal(readPokemonCache(key, undefined, 110), null);

  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    return jsonResponse(calls === 1 ? { name: 'pikachu' } : { id: 25, name: 'pikachu' });
  };
  await assert.rejects(getPokemonDetails('pikachu'), /inesperados/);
  assert.equal((await getPokemonDetails('pikachu')).id, 25);
  assert.equal(calls, 2);
});

test('sigue funcionando si localStorage no existe o su cuota está agotada', async () => {
  let calls = 0;
  globalThis.fetch = async () => { calls += 1; return jsonResponse({ id: 4, name: 'charmander' }); };
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('blocked'); } });
  assert.equal((await getPokemonDetails('charmander')).id, 4);

  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage });
  storage.quotaExceeded = true;
  assert.equal((await getPokemonDetails('charmander')).id, 4);
  assert.equal(calls, 2);
});

test('invalida solo claves de PokéDex y normaliza propiedades opcionales ausentes', () => {
  storage.setItem(pokemonDetailsCacheKey('bulbasaur'), JSON.stringify({
    version: 1, expiresAt: Date.now() + 1000, data: { id: 1, name: 'bulbasaur' },
  }));
  storage.setItem('other-app:key', 'preserve');

  assert.equal(clearPokemonCache(), true);
  assert.equal(storage.getItem(pokemonDetailsCacheKey('bulbasaur')), null);
  assert.equal(storage.getItem('other-app:key'), 'preserve');
  assert.deepEqual(normalizePokemon({ id: 1, name: 'missing-fields' }).types, []);
  assert.equal(normalizePokemon({ id: 1, name: 'missing-fields' }).image, null);
});
