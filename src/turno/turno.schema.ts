import { z } from 'zod';

export const turnoSchema = z
  .object({
    clienteId: z.number().int("El id debe ser un número entero").optional().nullable(),
    tipoTurnoId: z.number().int("El id debe ser un número entero"),
    complejoId: z.number().int("El id debe ser un número entero"),
    canchaNro: z.number().int("El id debe ser un número entero"),
    fechaInicio: z.coerce.date(),
    fechaFin: z.coerce.date(),
    estado: z.string().min(1, "El estado es un campo obligatorio"),
    motivoCancelacion: z.string().optional().nullable(),
    // Datos del solicitante cuando el turno no tiene cuenta de cliente asociada
    // (ej: el encargado lo asigna para una persona que no se registró).
    nombreSolicitante: z.string().optional().nullable(),
    apellidoSolicitante: z.string().optional().nullable(),
  })
  .strict()
  .refine((data) => data.fechaFin > data.fechaInicio, {
    message: "La fecha de fin debe ser posterior a la fecha de inicio",
    path: ["fechaFin"],
  });

export type Turno = z.infer<typeof turnoSchema>;