import { z } from 'zod';


//no agregue el id porque seria autogeneral
export const precioSchema = z.object({
  precioBase :z.number().min(1, "El precio base es un campo obligatorio"),
  precioAdicional :z.number().min(1, "El precio adicional es un campo obligatorio"),
  precioSeña :z.number().min(1, "El precio de la seña es un campo obligatorio"),
  id_complejo: z.number().int("El id debe ser un numero entero"),
  nro_cancha: z.number().int("El id debe ser un numero entero"),
  fechaDesde: z.string().date().min(1, "La fecha de nacimiento es un campo obligatorio"),
}).strict();

export type Precio = z.infer<typeof precioSchema>;
