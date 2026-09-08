import { z } from 'zod';

export const canchaSchema = z.object({
  nro: z.number().min(1).int("El nro de cancha debe ser un numero entero"),
  tipoCanchaId: z.number().int("El id del tipo de cancha debe ser un numero entero"), // <-- Cambiado de id_tipo_cancha
}).strict();

export type Cancha = z.infer<typeof canchaSchema>;
