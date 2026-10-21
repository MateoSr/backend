import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';

// Test de integración: recorremos el flujo completo de una petición real
// (request -> controller -> service -> respuesta) sin depender de PostgreSQL,
// mockeando sólo la capa de acceso a datos.
vi.mock('./usuario/users.service.js', () => ({
  getUserEmail: vi.fn(),
  postUser: vi.fn(),
  patchUserPassword: vi.fn(),
}));

import app from './app.js';
import { getUserEmail } from './usuario/users.service.js';

const getUserEmailMock = vi.mocked(getUserEmail);

describe('API de autenticación (integración)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('POST /api/login devuelve un token con credenciales válidas', async () => {
    const passwordHash = await bcrypt.hash('password123', 10);
    getUserEmailMock.mockResolvedValue({
      id: 1,
      email: 'cliente@turnolibre.com',
      password: passwordHash,
      tipoUsuarioId: 3,
      tipoUsuario: { descripcion: 'Cliente' },
    } as never);

    const res = await request(app)
      .post('/api/login')
      .send({ email: 'cliente@turnolibre.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toMatchObject({ token: expect.any(String) });
    expect(res.body.message).toMatch(/login exitoso/i);
  });
});
