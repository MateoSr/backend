import { z } from 'zod';

export const turnoSchema = z
  .object({
    clienteId: z.number().int("El id debe ser un numero entero"),
    tipoTurnoId: z.number().int("El id debe ser un numero entero"),
    complejoId: z.number().int("El id debe ser un numero entero"),
    canchaNro: z.number().int("El id debe ser un numero entero"),
    fechaInicio: z.coerce.date(),
    fechaFin: z.coerce.date(),
    estado: z.string().min(1, "El estado es un campo obligatorio"),
    motivoCancelacion: z.string().optional().nullable(),
  })
  .strict()
  .refine((data) => data.fechaFin > data.fechaInicio, {
    message: "La fecha de fin debe ser posterior a la fecha de inicio",
    path: ["fechaFin"],
  });

export type Turno = z.infer<typeof turnoSchema>;