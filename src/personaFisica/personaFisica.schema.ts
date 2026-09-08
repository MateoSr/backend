import { z } from 'zod';


export const personaFisicaSchema = z.object({
  dni: z.string().min(7, "El dni es un campo obligatorio"),
  fechaNacimiento:  z.union([
    z.string().min(1, "La fecha de nacimiento es un campo obligatorio"),
    z.date()
  ]),
  nombre: z.string().min(1, "El nombre es un campo obligatorio"),
  apellido: z.string().min(1, "El apellido es un campo obligatorio")
});


export type PersonaFisica = z.infer<typeof personaFisicaSchema>;