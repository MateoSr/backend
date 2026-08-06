import { z } from 'zod';


//no agregue el id porque seria autogeneral
export const turnoSchema = z.object({
  id_cliente: z.number({ required_error: "El id_cliente es un campo obligatorio" }).int("El id debe ser un numero entero"),
  id_tipo_turno: z.number({ required_error: "El id_tipo_turno es un campo obligatorio" }).int("El id debe ser un numero entero"),
  id_complejo: z.number({ required_error: "El id_complejo es un campo obligatorio" }).int("El id debe ser un numero entero"),
  nro_cancha: z.number({ required_error: "El nro_cancha es un campo obligatorio" }).int("El id debe ser un numero entero"),
  horarioInicio: z.string().min(1, "El horario de inicio es un campo obligatorio"),
  horarioFin: z.string().min(1, "El horario de fin es un campo obligatorio"),
  estado: z.string().min(1, "El estado es un campo obligatorio"),
  motivoCancelacion: z.string().optional()
}).strict();;
