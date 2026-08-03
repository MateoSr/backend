import { z } from 'zod';


export const personaFisicaSchema = z.object({
  dni: z.string().min(7, "El dni es un campo obligatorio"),
  fechaNacimiento: z.string().date().min(1, "La fecha de nacimiento es un campo obligatorio"),
  nombre: z.string().min(1, "El nombre es un campo obligatorio"),
  apellido: z.string().min(1, "El apellido es un campo obligatorio")
});
