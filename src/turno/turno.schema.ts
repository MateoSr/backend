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

// turnoSchema tiene un refine() que impide .partial(); se reconstruye desde el shape.
// El cliente y el complejo no se pueden cambiar en una actualización: el dueño
// del turno y el complejo quedan definidos al crearlo.
export const turnoUpdateBodySchema = z
  .object(turnoSchema.shape)
  .omit({ clienteId: true, complejoId: true })
  .partial();

// Body de POST /turnos/encargado: datos del cliente sin cuenta + turno.
export const turnoEncargadoSchema = z.object({
  cliente: z.object({
    nombre: z.string().min(1, "El nombre es un campo obligatorio"),
    apellido: z.string().min(1, "El apellido es un campo obligatorio"),
    telefono: z.string().optional(),
    email: z.string().email().optional(),
  }),
  turno: turnoSchema,
});

export type Turno = z.infer<typeof turnoSchema>;
export type TurnoUpdateBody = z.infer<typeof turnoUpdateBodySchema>;
export type TurnoEncargado = z.infer<typeof turnoEncargadoSchema>;