import { z } from 'zod'

export const playerPositions = [
  'Portero',
  'Defensa',
  'Centrocampista',
  'Delantero',
]

export const playerDorsalSchema = z.number({ error: 'El dorsal debe ser un n\u00FAmero entero' })
  .int('El dorsal debe ser un n\u00FAmero entero')
  .min(1, 'El dorsal debe estar entre 1 y 99')
  .max(99, 'El dorsal debe estar entre 1 y 99')

const dniLetters = 'TRWAGMYFPDXBNJZSQVHLCKE'

function isValidSpanishDni(dni) {
  const number = Number(dni.slice(0, 8))
  return dni[8] === dniLetters[number % 23]
}

function isNotFutureDate(date) {
  const now = new Date()
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-')

  // Las fechas ISO YYYY-MM-DD se pueden comparar por orden cronológico como texto.
  return date <= today
}

export const playerSchema = z.object({
  nombre: z.string({ error: 'El nombre es obligatorio' })
    .trim()
    .min(1, 'El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(40, 'El nombre no puede superar los 40 caracteres'),

  apellido: z.string({ error: 'El apellido es obligatorio' })
    .trim()
    .min(1, 'El apellido es obligatorio')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(60, 'El apellido no puede superar los 60 caracteres'),

  dni: z.string({ error: 'El DNI es obligatorio' })
    .trim()
    .toUpperCase()
    .min(1, 'El DNI es obligatorio')
    .regex(/^\d{8}[A-Z]$/, 'El DNI introducido no es válido')
    .refine(isValidSpanishDni, 'El DNI introducido no es válido'),

  dorsal: z.string({ error: 'El dorsal es obligatorio' })
    .trim()
    .min(1, 'El dorsal es obligatorio')
    .regex(/^\d+$/, 'El dorsal debe ser un número entero')
    .transform(Number)
    .pipe(playerDorsalSchema),


  fechaNacimiento: z.string({ error: 'La fecha de nacimiento es obligatoria' })
    .min(1, 'La fecha de nacimiento es obligatoria')
    .pipe(z.iso.date({ error: 'Introduce una fecha de nacimiento válida' }))
    .refine(isNotFutureDate, 'La fecha de nacimiento no puede ser futura'),

  posicion: z.enum(playerPositions, { error: 'Selecciona una posición' }),
})