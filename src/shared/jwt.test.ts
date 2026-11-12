import { describe, it, expect } from 'vitest';
import jwt from 'jsonwebtoken';
import {
  emitirToken,
  emitirRefreshToken,
  verificarToken,
  verificarRefreshToken,
  type TokenPayload,
} from '../shared/jwt.js';

// Test unitario 1: emisión y verificación de tokens JWT.
describe('shared/jwt', () => {
  const payload: TokenPayload = {
    userId: 7,
    email: 'cliente@turnolibre.com',
    rol: 'Cliente',
  };

  it('emite un token y lo verifica devolviendo el mismo payload', () => {
    const token = emitirToken(payload);
    const decodificado = verificarToken(token);

    expect(decodificado.userId).toBe(payload.userId);
    expect(decodificado.email).toBe(payload.email);
    expect(decodificado.rol).toBe(payload.rol);
  });

  it('emite un refresh token y lo verifica', () => {
    const refreshToken = emitirRefreshToken(payload);
    const decodificado = verificarRefreshToken(refreshToken);

    expect(decodificado.userId).toBe(payload.userId);
    expect(decodificado.tipo).toBe('refresh');
  });

  it('un refresh token no sirve como access token', () => {
    const refreshToken = emitirRefreshToken(payload);

    expect(() => verificarToken(refreshToken)).toThrow();
  });

  it('un access token no sirve como refresh token', () => {
    const token = emitirToken(payload);

    expect(() => verificarRefreshToken(token)).toThrow();
  });

  it('rechaza un refresh token vencido', () => {
    const vencido = jwt.sign(
      { ...payload, tipo: 'refresh', exp: Math.floor(Date.now() / 1000) - 10 },
      process.env.SECRET_KEY_REFRESH!
    );

    expect(() => verificarRefreshToken(vencido)).toThrow();
  });
});
