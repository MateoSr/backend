import { z } from 'zod';


//no agregue el id porque seria autogeneral
export const precioSchema = z.object({
  nombre: z.string().min(1, "El nombre es un campo obligatorio"),
  precioBase :z.number().min(1, "El precio base es un campo obligatorio"),
  precioAdicional :z.number().min(1, "El precio adicional es un campo obligatorio"),
  precioSeña :z.number().min(1, "El precio de la seña es un campo obligatorio"),
  id_complejo: z.number({ required_error: "El id del complejo es un campo obligatorio" }).int("El id debe ser un numero entero"),
  nro_cancha: z.number({ required_error: "El nro de la cancha es un campo obligatorio" }).int("El id debe ser un numero entero"),
  fechaDesde: z.date()
}).strict();;
