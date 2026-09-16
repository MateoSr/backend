import { z } from 'zod';


//no agregue el id porque seria autogeneral
export const complejoSchema = z.object({
  nombre: z.string().min(1, "El nombre es un campo obligatorio"),
  direccion: z.string().min(1, "La dirección es un campo obligatorio"),
  telefono: z.string().min(1, "El telefono es un campo obligatorio"),
  instagram: z.string().min(1, "El instagram es un campo obligatorio").optional().nullable(),
  imagenUrl: z.string().url("La URL no es válida").optional().nullable(),
  duenoId: z.number().int("El id debe ser un numero entero"),
  localidadId: z.number().int("El id debe ser un numero entero"),
  encargadoId: z.number().int("El id debe ser un numero entero")
}).strict();

export type Complejo = z.infer<typeof complejoSchema>;