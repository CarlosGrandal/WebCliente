/**
 * SIMULACIÓN TEMPORAL: sustituir el cuerpo por la petición HTTP del alta.
 * Esta función puede usarse directamente como mutationFn de TanStack Query.
 */
export async function submitPlayerRegistration(playerData) {
  await new Promise((resolve) => setTimeout(resolve, 650))
  return { player: playerData }
}