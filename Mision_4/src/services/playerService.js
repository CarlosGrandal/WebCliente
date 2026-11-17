import { createdPlayerResponseSchema, playersResponseSchema } from '../schemas/playerResponseSchema.js'

export class ApiResponseValidationError extends Error {
  constructor(validationIssues) {
    super('El servidor devolvió datos de jugadores con un formato inesperado. No se han mostrado.')
    this.name = 'ApiResponseValidationError'
    this.validationIssues = validationIssues
  }
}

async function request(path, options) {
  let response

  try {
    response = await fetch(`/api${path}`, options)
  } catch {
    throw new Error('No se pudo conectar con el servidor. Comprueba que está en ejecución.')
  }

  let payload
  try {
    payload = await response.json()
  } catch {
    throw new Error('El servidor devolvió una respuesta que no se pudo leer.')
  }

  if (!response.ok) {
    const error = new Error(payload.message || `La petición falló (HTTP ${response.status}).`)
    error.status = response.status
    error.details = payload.errors
    throw error
  }

  return payload
}

function throwIfInvalidResponse(result) {
  if (!result.success) {
    throw new ApiResponseValidationError(result.error.issues)
  }
  return result.data
}

export async function getPlayers({ simulateCorruptResponse = false } = {}) {
  const path = simulateCorruptResponse ? '/players?demo=corrupt' : '/players'
  const payload = await request(path)
  const result = playersResponseSchema.safeParse(payload)
  return throwIfInvalidResponse(result).players
}

export async function createPlayer(playerData) {
  const payload = await request('/players', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(playerData),
  })
  const result = createdPlayerResponseSchema.safeParse(payload)
  return throwIfInvalidResponse(result).player
}