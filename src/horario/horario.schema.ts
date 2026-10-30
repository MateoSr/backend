import { z } from 'zod';

// Expresión regular para validar las horas (HH:MM)
const horaRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const horarioSchema = z.object({
    complejoId: z.number().int("El id debe ser un número entero").min(1, "El id es un campo obligatorio"),
    nroDia: z.number().int("El número de día debe ser un número entero").min(1, "El día mínimo es 1").max(7, "El número de día tiene un máximo de 7"),
    horaApertura: z.string({ message: "El horario de apertura es obligatorio" }).regex(horaRegex, "Formato de hora incorrecto (HH:MM)"),
    horaCierre: z.string({ message: "El horario de cierre es obligatorio" }).regex(horaRegex, "Formato de hora incorrecto (HH:MM)")
});

export type Horario = z.infer<typeof horarioSchema>;

