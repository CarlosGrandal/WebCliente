import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculateAverageBaseStats,
  filterPokemon,
  normalizePokemonList,
  sortPokemon,
} from '../src/logic/pokemonLogic.js';

test('normaliza una lista y tolera propiedades opcionales ausentes', () => {
  const result = normalizePokemonList([
    { id: 1, name: ' Bulbasaur ', height: 7, weight: 69, types: [{ type: { name: 'grass' } }] },
    { id: 2, name: 'Missing-data' },
  ]);

  assert.equal(result.length, 2);
  assert.equal(result[0].name, 'bulbasaur');
  assert.equal(result[0].heightCm, 70);
  assert.deepEqual(result[0].types, ['grass']);
  assert.equal(result[1].image, null);
  assert.deepEqual(result[1].types, []);
  assert.equal(result[1].stats.hp, null);
});

test('filtra de forma tolerante a espacios, mayúsculas y resultados vacíos', () => {
  const pokemon = [
    { id: 25, name: 'pikachu', types: ['electric'] },
    { id: 4, name: 'charmander', types: ['fire'] },
  ];

  assert.deepEqual(filterPokemon(pokemon, { search: '  PIKA  ' }).map(({ id }) => id), [25]);
  assert.deepEqual(filterPokemon(pokemon, { type: 'fire' }).map(({ id }) => id), [4]);
  assert.deepEqual(filterPokemon(pokemon, { search: 'no existe' }), []);
  assert.equal(filterPokemon(pokemon, { search: '   ' }).length, 2);
});

test('ordena por nombre y calcula la media del total de estadísticas disponibles', () => {
  const pokemon = [
    { id: 25, name: 'pikachu', stats: { hp: 35, attack: 55, speed: 90 } },
    { id: 1, name: 'bulbasaur', stats: { hp: 45, attack: 49 } },
    { id: 3, name: 'sparse', stats: { hp: null } },
  ];

  assert.deepEqual(sortPokemon(pokemon, 'name').map(({ name }) => name), ['bulbasaur', 'pikachu', 'sparse']);
  assert.equal(calculateAverageBaseStats(pokemon), 137);
  assert.equal(calculateAverageBaseStats([]), null);
});
