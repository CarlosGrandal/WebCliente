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
    throw new Error(payload.message || `La petición falló (HTTP ${response.status}).`)
  }

  return payload
}

export async function getPlayers() {
  const { players } = await request('/players')
  return players
}

export async function createPlayer(playerData) {
  const { player } = await request('/players', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(playerData),
  })
  return player
}