import { z } from 'zod';

export const canchaSchema = z.object({
  nro: z.number().min(1).int("El número de cancha debe ser un número entero"),
  tipoCanchaId: z.number().int("El id del tipo de cancha debe ser un número entero"),
  estado: z.string().min(1, "El estado es un campo obligatorio"),
}).strict();

export type Cancha = z.infer<typeof canchaSchema>;
