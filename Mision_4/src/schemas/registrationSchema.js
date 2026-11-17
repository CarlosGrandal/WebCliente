import { z } from 'zod'

export const registrationSchema = z.object({
  nombre: z.string().trim().min(2, 'Escribe el nombre del jugador.'),
  apellidos: z.string().trim().min(2, 'Escribe los apellidos del jugador.'),
  fechaNacimiento: z.string().min(1, 'Indica la fecha de nacimiento.'),
  posicion: z.string().min(1, 'Selecciona una posición.'),
  emailContacto: z.email('Introduce un correo electrónico válido.'),
})
