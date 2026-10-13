/** Funciones de transformación y reglas de dominio para los datos Pokémon. */

export function normalizePokemonName(name) {
  return name.trim().toLowerCase();
}
