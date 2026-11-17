import { z } from 'zod'
import { playerDorsalSchema, playerSchema } from './playerSchema.js'

export const playerResponseSchema = playerSchema.extend({
  id: z.uuid({ error: 'El identificador recibido no es válido' }),
  dorsal: playerDorsalSchema,
  createdAt: z.iso.datetime({ error: 'La fecha de registro recibida no es válida' }),
})

export const playersResponseSchema = z.object({
  players: z.array(playerResponseSchema),
})

export const createdPlayerResponseSchema = z.object({
  player: playerResponseSchema,
})