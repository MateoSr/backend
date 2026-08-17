import { z } from 'zod';


//no agregue el id porque seria autogeneral
export const userSchema = z.object({
  email: z.string().min(1, "El email es un campo obligatorio").email("El formato del email no es válido"),
  telefono: z.string().min(1, "El telefono es un campo obligatorio"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  id_tipoUsuario: z.number().int("El id debe ser un numero entero").positive("El id debe ser un número positivo"),
  dni: z.string().min(7, "El dni debe tener como minimo 7 caracteres").optional(),
  cuit: z.string().min(11, "El cuit debe tener como minimo 11 caracteres").optional()
}).strict();;

export type User = z.infer<typeof userSchema>;