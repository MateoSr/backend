import { z } from 'zod';


//no agregue el id porque seria autogeneral

export const turnoSchema = z.object({
  clienteId: z.number().int("El id debe ser un numero entero"),
  tipoTurnoId: z.number().int("El id debe ser un numero entero"),
  complejoId: z.number().int("El id debe ser un numero entero"),
  canchaNro: z.number().int("El id debe ser un numero entero"),
  fecha: z.coerce.date(),
  
  // Acepta string de tiempo (ej. "18:00" o formato ISO) o un objeto Date de Prisma
  horaInicio: z.union([
    z.string().min(1, "El horario de inicio es un campo obligatorio"),
    z.date()
  ]),
  horaFin: z.union([
    z.string().min(1, "El horario de fin es un campo obligatorio"),
    z.date()
  ]),

  estado: z.string().min(1, "El estado es un campo obligatorio"),
  motivoCancelacion: z.string().optional().nullable()
}).strict();

export type Turno = z.infer<typeof turnoSchema>;