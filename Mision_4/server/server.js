import express from 'express'
import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { playerSchema } from '../src/schemas/playerSchema.js'

const serverDirectory = path.dirname(fileURLToPath(import.meta.url))
const dataDirectory = path.join(serverDirectory, 'data')
const dataFile = path.join(dataDirectory, 'players.json')
const app = express()
const port = Number(process.env.PORT) || 3001

app.use(express.json({ limit: '20kb' }))

async function readPlayers() {
  const content = await readFile(dataFile, 'utf8')
  const players = JSON.parse(content)
  if (!Array.isArray(players)) throw new Error('El archivo de jugadores debe contener una lista.')
  return players
}

async function initializeStorage() {
  await mkdir(dataDirectory, { recursive: true })
  try {
    await writeFile(dataFile, '[]\n', { encoding: 'utf8', flag: 'wx' })
  } catch (error) {
    if (error.code !== 'EEXIST') throw error
  }
}

// Serializa las altas para que dos peticiones simultáneas no puedan reservar el mismo dorsal.
let writeQueue = Promise.resolve()
function createPlayer(player) {
  const operation = writeQueue.then(async () => {
    const players = await readPlayers()
    if (players.some((existing) => existing.dorsal === player.dorsal)) {
      const error = new Error(`El dorsal ${player.dorsal} ya está asignado a otro jugador.`)
      error.status = 409
      throw error
    }

    const savedPlayer = { id: randomUUID(), ...player, createdAt: new Date().toISOString() }
    players.unshift(savedPlayer)
    const temporaryFile = path.join(dataDirectory, `players-${randomUUID()}.tmp`)

    try {
      await writeFile(temporaryFile, `${JSON.stringify(players, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' })
      await rename(temporaryFile, dataFile)
    } catch (error) {
      await rm(temporaryFile, { force: true })
      throw error
    }

    return savedPlayer
  })

  writeQueue = operation.then(() => undefined, () => undefined)
  return operation
}

app.get('/api/players', async (_request, response, next) => {
  try {
    await writeQueue
    response.json({ players: await readPlayers() })
  } catch (error) {
    next(error)
  }
})

app.post('/api/players', async (request, response, next) => {
  if (!request.body || typeof request.body !== 'object' || Array.isArray(request.body)) {
    return response.status(400).json({ message: 'Envía los datos del jugador en formato JSON.' })
  }

  // El formulario envía el dorsal ya convertido a número; el esquema compartido
  // valida el mismo dato como texto y lo transforma al tipo numérico canónico.
  const formData = {
    ...request.body,
    dorsal: typeof request.body.dorsal === 'number' ? String(request.body.dorsal) : request.body.dorsal,
  }
  const result = playerSchema.safeParse(formData)

  if (!result.success) {
    return response.status(400).json({
      message: 'Revisa los datos del jugador e inténtalo de nuevo.',
      errors: result.error.flatten().fieldErrors,
    })
  }

  try {
    const player = await createPlayer(result.data)
    response.status(201).json({ player })
  } catch (error) {
    if (error.status === 409) return response.status(409).json({ message: error.message })
    next(error)
  }
})

app.use('/api', (_request, response) => {
  response.status(404).json({ message: 'La ruta solicitada no existe.' })
})

app.use((error, _request, response, _next) => {
  if (error.type === 'entity.parse.failed') {
    return response.status(400).json({ message: 'El cuerpo de la petición no contiene JSON válido.' })
  }
  if (error.type === 'entity.too.large') {
    return response.status(413).json({ message: 'La petición es demasiado grande.' })
  }

  console.error(error)
  response.status(500).json({ message: 'No se pudo completar la operación en el servidor.' })
})

await initializeStorage()
app.listen(port, '127.0.0.1', () => {
  console.log(`Los Chavales FC API disponible en http://127.0.0.1:${port}`)
})