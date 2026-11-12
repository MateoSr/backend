import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';

// Test de integración: recorremos el flujo completo de una petición real
// (request -> controller -> service -> respuesta) sin depender de PostgreSQL,
// mockeando sólo la capa de acceso a datos.
vi.mock('./usuario/users.service.js', () => ({
  getUserEmail: vi.fn(),
  getUserId: vi.fn(),
  postUser: vi.fn(),
  patchUserPassword: vi.fn(),
}));

import app from './app.js';
import { getUserEmail, getUserId } from './usuario/users.service.js';

const getUserEmailMock = vi.mocked(getUserEmail);
const getUserIdMock = vi.mocked(getUserId);

const usuarioDePrueba = {
  id: 1,
  email: 'cliente@turnolibre.com',
  tipoUsuarioId: 3,
  tipoUsuario: { descripcion: 'Cliente' },
};

describe('API de autenticación (integración)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('POST /api/login devuelve access y refresh token con credenciales válidas', async () => {
    const passwordHash = await bcrypt.hash('password123', 10);
    getUserEmailMock.mockResolvedValue({
      ...usuarioDePrueba,
      password: passwordHash,
    } as never);

    const res = await request(app)
      .post('/api/login')
      .send({ email: 'cliente@turnolibre.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toMatchObject({
      token: expect.any(String),
      refreshToken: expect.any(String),
    });
    expect(res.body.message).toMatch(/login exitoso/i);
  });

  it('POST /api/refresh renueva el par de tokens con un refresh válido', async () => {
    const passwordHash = await bcrypt.hash('password123', 10);
    getUserEmailMock.mockResolvedValue({
      ...usuarioDePrueba,
      password: passwordHash,
    } as never);
    getUserIdMock.mockResolvedValue(usuarioDePrueba as never);

    const login = await request(app)
      .post('/api/login')
      .send({ email: 'cliente@turnolibre.com', password: 'password123' });

    const res = await request(app)
      .post('/api/refresh')
      .send({ refreshToken: login.body.token.refreshToken });

    expect(res.status).toBe(200);
    expect(res.body.token).toMatchObject({
      token: expect.any(String),
      refreshToken: expect.any(String),
    });
  });

  it('POST /api/refresh responde 401 con un refresh inválido', async () => {
    const res = await request(app)
      .post('/api/refresh')
      .send({ refreshToken: 'token-invalido' });

    expect(res.status).toBe(401);
  });
});
