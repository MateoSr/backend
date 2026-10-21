import { describe, it, expect } from 'vitest';
import {
  emitirToken,
  verificarToken,
  type TokenPayload,
} from '../shared/jwt.js';

// Test unitario 1: emisión y verificación de tokens JWT.
describe('shared/jwt', () => {
  it('emite un token y lo verifica devolviendo el mismo payload', () => {
    const payload: TokenPayload = {
      userId: 7,
      email: 'cliente@turnolibre.com',
      rol: 'Cliente',
    };

    const token = emitirToken(payload);
    const decodificado = verificarToken(token);

    expect(decodificado.userId).toBe(payload.userId);
    expect(decodificado.email).toBe(payload.email);
    expect(decodificado.rol).toBe(payload.rol);
  });
});
