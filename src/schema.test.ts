import { describe, it, expect } from 'vitest';
import { userSchema } from './usuario/users.schema.js';

// Test unitario 2: validación de datos de usuario con Zod.
describe('users.schema', () => {
  it('acepta un usuario válido y rechaza un email con formato inválido', () => {
    const usuarioValido = {
      email: 'nuevo@turnolibre.com',
      telefono: '1122334455',
      password: 'password123',
      tipoUsuarioId: 3,
      personaFisicaDni: '30123456',
    };

    expect(userSchema.safeParse(usuarioValido).success).toBe(true);

    const emailInvalido = { ...usuarioValido, email: 'no-es-un-email' };
    expect(userSchema.safeParse(emailInvalido).success).toBe(false);
  });
});
