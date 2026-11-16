import { z } from 'zod';
import { userSchema } from '../usuario/users.schema.js';
import { personaFisicaSchema } from '../personaFisica/personaFisica.schema.js';

// Body de POST /register: datos del usuario + datos de la persona física.
export const registroSchema = z.object({
  email: userSchema.shape.email,
  password: userSchema.shape.password,
  telefono: userSchema.shape.telefono,
  dni: personaFisicaSchema.shape.dni,
  nombre: personaFisicaSchema.shape.nombre,
  apellido: personaFisicaSchema.shape.apellido,
  fechaNacimiento: personaFisicaSchema.shape.fechaNacimiento,
});

export type Registro = z.infer<typeof registroSchema>;
