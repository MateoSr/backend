import { z } from 'zod';


//no agregue el id porque seria autogeneral
export const canchaSchema = z.object({
  nro: z.number().min(1).int("El nro de cancha debe ser un numero entero"),
  id_tipo_cancha: z.number().int("El id del tipo de cancha debe ser un numero entero"),
  id_complejo: z.number().int("El id del complejo debe ser un numero entero")
}).strict();;

export type Cancha = z.infer<typeof canchaSchema>;
