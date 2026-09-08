import { z } from 'zod';

// Expresión regular para validar las horas (HH:MM)
const horaRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const horarioSchema = z.object({
    complejoId: z.number().int("El id debe ser un numero entero").min(1, "El id es un campo obligatorio"),
    nroDia: z.number().int("El numero de dia debe ser un numero entero").min(1, "El dia minimo es 1").max(8, "El numero de dia tiene un maximo de 8"),
    horarioApertura: z.string({ message: "El horario de apertura es obligatorio" }).regex(horaRegex, "Formato de hora incorrecto (HH:MM)"),
    horarioCierre: z.string({ message: "El horario de cierre es obligatorio" }).regex(horaRegex, "Formato de hora incorrecto (HH:MM)")
});

export type Horario = z.infer<typeof horarioSchema>;

