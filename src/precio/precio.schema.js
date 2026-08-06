import { z } from 'zod';


//no agregue el id porque seria autogeneral
export const complejoSchema = z.object({
  nombre: z.string().min(1, "El nombre es un campo obligatorio"),
  precioBase :z.number().min(1, "El precio base es un campo obligatorio").float("El precio base debe ser un numero"),
  precioAdicional :z.number().min(1, "El precio adicional es un campo obligatorio").float("El precio adicional debe ser un numero"),
  precioSeña :z.number().min(1, "El precio de la seña es un campo obligatorio").float("El precio de la seña debe ser un numero"),
  id_complejo: z.number({ required_error: "El id del complejo es un campo obligatorio" }).int("El id debe ser un numero entero"),
  nro_cancha: z.number({ required_error: "El id de la localidad es un campo obligatorio" }).int("El id debe ser un numero entero"),
  fechaDesde: z.date()
}).strict();;
