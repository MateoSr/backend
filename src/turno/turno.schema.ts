import { z } from 'zod';


//no agregue el id porque seria autogeneral
export const turnoSchema = z.object({
  id_cliente: z.number().int("El id debe ser un numero entero"),
  id_tipo_turno: z.number().int("El id debe ser un numero entero"),
  id_complejo: z.number().int("El id debe ser un numero entero"),
  nro_cancha: z.number().int("El id debe ser un numero entero"),
  fecha: z.string().date().min(1, "La fecha es un campo obligatorio"),
  horarioInicio: z.string().min(1, "El horario de inicio es un campo obligatorio"),
  horarioFin: z.string().min(1, "El horario de fin es un campo obligatorio"),
  estado: z.string().min(1, "El estado es un campo obligatorio"),
  motivoCancelacion: z.string().optional()
}).strict();;

export type Turno = z.infer<typeof turnoSchema>;