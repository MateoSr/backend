import { z } from 'zod';

//Expresion regular para validar las horas
const horaRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const horarioSchema = z.object({
    id_complejo: z.number().int("El id debe ser un numero entero").min(1,"El id es un campo obligatorio"),
    num_dia:z.number().int("El id debe ser un numero entero").min(1,"El id es un campo obligatorio").max(8,"El numero de dia tiene maximo 8"),
    horarioApertura: z.string("El horario de apertura es obligatorio").regex(horaRegex,"Formato de hora incorrecto"),
    horarioCierre:z.string("El horario de cierre es obligatorio").regex(horaRegex,"Formato de hora incorrecto")
});

export type Horario = z.infer<typeof horarioSchema>;

