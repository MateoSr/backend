import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

// Evitamos cualquier acceso real a la base de datos desde el flujo de auth.
vi.mock('../usuario/users.service.js', () => ({
  getUserEmail: vi.fn(),
  getUserId: vi.fn(),
  postUser: vi.fn(),
  patchUserPassword: vi.fn(),
}));

vi.mock('../localidad/localidad.service.js', () => ({
  getAllLocalidades: vi.fn(),
  getLocalidad: vi.fn(),
}));

import app from '../app.js';
import { errorHandler, noEncontrado } from './errorHandler.js';
import { errores } from '../shared/errors.js';
import { emitirToken } from '../shared/jwt.js';
import { getUserEmail } from '../usuario/users.service.js';
import { getAllLocalidades } from '../localidad/localidad.service.js';

const getUserEmailMock = vi.mocked(getUserEmail);
const getAllLocalidadesMock = vi.mocked(getAllLocalidades);

function crearAppDePrueba() {
  const appPrueba = express();

  appPrueba.get('/conflicto', () => {
    throw errores.conflicto('Ese horario ya está reservado');
  });

  appPrueba.get('/validacion', () => {
    z.object({ nombre: z.string() }).parse({});
  });

  appPrueba.get('/prisma', () => {
    throw new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
      code: 'P2002',
      clientVersion: 'test',
    });
  });

  appPrueba.get('/desconocido', () => {
    throw new Error('boom interno');
  });

  appPrueba.use(noEncontrado);
  appPrueba.use(errorHandler);
  return appPrueba;
}

describe('Contrato central de errores', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devuelve 401 con code NO_AUTORIZADO si falta el token', async () => {
    const res = await request(app).get('/api/complejos');

    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({ code: 'NO_AUTORIZADO', message: expect.any(String) });
  });

  it('devuelve 403 con code PROHIBIDO si el rol no está autorizado', async () => {
    const token = emitirToken({ userId: 1, email: 'cliente@test.com', rol: 'Cliente' });

    const res = await request(app)
      .get('/api/complejos')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body).toMatchObject({ code: 'PROHIBIDO', message: expect.any(String) });
  });

  it('devuelve 404 JSON para rutas inexistentes', async () => {
    const res = await request(app).get('/api/ruta-que-no-existe');

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ code: 'RUTA_NO_ENCONTRADA', message: expect.any(String) });
  });

  it('devuelve 401 con code NO_AUTORIZADO si las credenciales son inválidas', async () => {
    getUserEmailMock.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/login')
      .send({ email: 'nadie@test.com', password: 'password123' });

    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({ code: 'NO_AUTORIZADO', message: 'Credenciales inválidas' });
  });

  it('devuelve 400 DATOS_INVALIDOS con detalles cuando Zod falla', async () => {
    const res = await request(app).post('/api/register').send({});

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ code: 'DATOS_INVALIDOS', message: expect.any(String) });
    expect(Array.isArray(res.body.detalles)).toBe(true);
  });

  it('devuelve 200 con [] cuando la lista está vacía', async () => {
    getAllLocalidadesMock.mockResolvedValue([] as never);

    const res = await request(app).get('/api/localidad');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('devuelve 409 cuando se lanza un AppError de conflicto', async () => {
    const res = await request(crearAppDePrueba()).get('/conflicto');

    expect(res.status).toBe(409);
    expect(res.body).toMatchObject({ code: 'CONFLICTO', message: 'Ese horario ya está reservado' });
  });

  it('mapea P2002 de Prisma a 409', async () => {
    const res = await request(crearAppDePrueba()).get('/prisma');

    expect(res.status).toBe(409);
    expect(res.body).toMatchObject({ code: 'CONFLICTO' });
  });

  it('mapea errores desconocidos a 500 sin filtrar detalles en producción', async () => {
    const anterior = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    try {
      const res = await request(crearAppDePrueba()).get('/desconocido');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ code: 'ERROR_INTERNO', message: 'Error interno del servidor' });
    } finally {
      process.env.NODE_ENV = anterior;
    }
  });
});
