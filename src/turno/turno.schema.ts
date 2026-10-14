import { z } from 'zod';


//no agregue el id porque seria autogeneral

// Expresión regular para validar las horas (HH:MM)
const horaRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const turnoSchema = z.object({
  clienteId: z.number().int("El id debe ser un numero entero"),
  tipoTurnoId: z.number().int("El id debe ser un numero entero"),
  complejoId: z.number().int("El id debe ser un numero entero"),
  canchaNro: z.number().int("El id debe ser un numero entero"),
  fecha: z.coerce.date(),
  horaInicio: z.string({ message: "El horario de inicio es obligatorio" }).regex(horaRegex, "Formato de hora incorrecto (HH:MM)"),
  horaFin: z.string({ message: "El horario de fin es obligatorio" }).regex(horaRegex, "Formato de hora incorrecto (HH:MM)"),

  estado: z.string().min(1, "El estado es un campo obligatorio"),
  motivoCancelacion: z.string().optional().nullable()
}).strict();

export type Turno = z.infer<typeof turnoSchema>;