import { z } from 'zod';

export const canchaSchema = z.object({
  nro: z.number().min(1).int("El nro de cancha debe ser un numero entero"),
  tipoCanchaId: z.number().int("El id del tipo de cancha debe ser un numero entero"),
  estado: z.string().min(1, "El estado es un campo obligatorio"),
}).strict();

export type Cancha = z.infer<typeof canchaSchema>;
