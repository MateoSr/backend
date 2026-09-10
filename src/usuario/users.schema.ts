import { z } from 'zod';


//no agregue el id porque seria autogeneral
export const userSchema = z.object({
  email: z.string().min(1, "El email es un campo obligatorio").email("El formato del email no es válido"),
  telefono: z.string().min(1, "El telefono es un campo obligatorio"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  tipoUsuarioId: z.number().int("El id debe ser un numero entero").positive("El id debe ser un número positivo"),
  personaFisicaDni: z.string().min(7, "El dni debe tener como minimo 7 caracteres").optional(),
  personaJuridicaCuit: z.string().min(11, "El cuit debe tener como minimo 11 caracteres").optional()
}).strict();;

export const userUpdateSchema = z.object({
  id: z.number().int("El id debe ser un numero entero").positive("El id debe ser un número positivo"),
  email: z.string().min(1, "El email es un campo obligatorio").email("El formato del email no es válido"),
  telefono: z.string().min(1, "El telefono es un campo obligatorio"),
  // password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres").optional(),
  // Campos correspondientes a PersonaFisica
  nombre: z.string().min(1, "El nombre es obligatorio").optional(),
  apellido: z.string().min(1, "El apellido es obligatorio").optional(),
  fechaNacimiento: z.string().optional() // Debe convertirse a Date antes de guardar en DB
});

export type User = z.infer<typeof userSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
