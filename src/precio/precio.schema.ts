import { z } from 'zod';


//no agregue el id porque seria autogeneral
export const precioSchema = z.object({
  precioBase :z.number().min(1, "El precio base es un campo obligatorio"),
  precioAdicional :z.number().min(1, "El precio adicional es un campo obligatorio"),
  precioSena :z.number().min(1, "El precio de la seña es un campo obligatorio"),
  id_complejo: z.number().int("El id debe ser un número entero"),
  nro_cancha: z.number().int("El id debe ser un número entero"),
  fecha: z.union([z.string().date(), z.date()]),
}).strict();

// Los ids vienen por path, no por body.
export const precioBodySchema = precioSchema.omit({ id_complejo: true, nro_cancha: true }).strict();

export const precioParamsSchema = z.object({
  id_complejo: z.coerce.number().int("El id debe ser un número entero"),
  nro_cancha: z.coerce.number().int("El id debe ser un número entero"),
});

export type Precio = z.infer<typeof precioSchema>;
export type PrecioBody = z.infer<typeof precioBodySchema>;
