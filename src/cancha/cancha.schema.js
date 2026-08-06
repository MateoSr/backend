import { z } from 'zod';


//no agregue el id porque seria autogeneral
export const complejoSchema = z.object({
  nro: z.number().min(1, {required_error: "El numero de cancha es un campo obligatorio"}).int("El nro de cancha debe ser un numero entero"),
  direccion: z.string().min(1,"La dirección es un campo obligatorio"),
  id_tipo_cancha: z.number({ required_error: "El tipo de cancha es un campo obligatorio" }).int("El id del tipo de cancha debe ser un numero entero")
}).strict();;
