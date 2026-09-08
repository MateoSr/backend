import { z } from 'zod';


//no agregue el id porque seria autogeneral
export const precioSchema = z.object({
  precioBase :z.number().min(1, "El precio base es un campo obligatorio"),
  precioAdicional :z.number().min(1, "El precio adicional es un campo obligatorio"),
  precioSena :z.number().min(1, "El precio de la seña es un campo obligatorio"),
  id_complejo: z.number().int("El id debe ser un numero entero"),
  nro_cancha: z.number().int("El id debe ser un numero entero"),
   fecha: z.union([z.string().date(), z.date()]),
}).strict();

export type Precio = z.infer<typeof precioSchema>;
