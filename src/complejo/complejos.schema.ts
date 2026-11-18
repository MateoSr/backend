import { z } from 'zod';


//no agregue el id porque seria autogeneral
export const complejoSchema = z.object({
  nombre: z.string().min(1, "El nombre es un campo obligatorio"),
  direccion: z.string().min(1, "La dirección es un campo obligatorio"),
  telefono: z.string().min(1, "El teléfono es un campo obligatorio"),
  instagram: z.string().min(1, "El instagram es un campo obligatorio").optional().nullable(),
  imagenUrl: z.string().optional().nullable(),
  imagenBase64: z.string().optional(),
  duenoId: z.number().int("El id debe ser un número entero"),
  localidadId: z.number().int("El id debe ser un número entero"),
  encargadoId: z.number().int("El id debe ser un número entero")
}).strict();

// En una actualización no se permite cambiar el dueño ni el encargado.
// Esos campos se asignan al crear el complejo (ruta de Administrador).
export const complejoUpdateSchema = complejoSchema
  .omit({
    duenoId: true,
    encargadoId: true,
  })
  .partial();

export type Complejo = z.infer<typeof complejoSchema>; 