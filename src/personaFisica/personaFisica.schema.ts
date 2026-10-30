import { z } from 'zod';


export const personaFisicaSchema = z.object({
  dni: z.string().min(7, "El dni es un campo obligatorio"),
  fechaNacimiento:  z.coerce.date(),
  nombre: z.string().min(1, "El nombre es un campo obligatorio"),
  apellido: z.string().min(1, "El apellido es un campo obligatorio")
});


export type PersonaFisica = z.infer<typeof personaFisicaSchema>;