import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// No usamos una base real: mockeamos la capa de datos que consultan los
// middlewares, controllers y services durante estos tests de integración.
vi.mock('./shared/prisma.js', () => ({
  prisma: {
    complejo: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    cancha: {
      delete: vi.fn(),
    },
    turno: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import app from './app.js';
import { prisma } from './shared/prisma.js';
import { emitirToken } from './shared/jwt.js';

const prismaMock = prisma as any;

const duenoAId = 10;
const clienteAId = 30;
const encargadoAId = 40;

const tokenDuenoA = emitirToken({
  userId: duenoAId,
  email: 'dueno-a@test.com',
  rol: 'Dueño',
});

const tokenClienteA = emitirToken({
  userId: clienteAId,
  email: 'cliente-a@test.com',
  rol: 'Cliente',
});

const tokenEncargadoA = emitirToken({
  userId: encargadoAId,
  email: 'encargado-a@test.com',
  rol: 'Encargado',
});

const complejoDeOtroDueno = {
  duenoId: 20,
  encargadoId: 50,
};

const turnoDeOtroCliente = {
  id: 7,
  estado: 'Reservado',
  clienteId: 31,
  complejo: complejoDeOtroDueno,
};

const turnoDelClienteA = {
  id: 8,
  estado: 'Reservado',
  clienteId: clienteAId,
  complejo: {
    duenoId: duenoAId,
    encargadoId: encargadoAId,
  },
};

function autorizacion(token: string) {
  return { Authorization: `Bearer ${token}` };
}

describe('Autorización por propiedad de recursos (integración)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('complejos', () => {
    it('un Dueño no puede modificar el complejo de otro Dueño', async () => {
      prismaMock.complejo.findUnique.mockResolvedValue({
        duenoId: complejoDeOtroDueno.duenoId,
      });

      const res = await request(app)
        .put('/api/complejos/2')
        .set(autorizacion(tokenDuenoA))
        .send({ nombre: 'Intento de cambio' });

      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({ code: 'PROHIBIDO' });
      expect(prismaMock.complejo.update).not.toHaveBeenCalled();
    });

    it('un Dueño puede modificar su propio complejo', async () => {
      prismaMock.complejo.findUnique.mockResolvedValue({
        duenoId: duenoAId,
      });
      prismaMock.complejo.update.mockResolvedValue({
        id: 1,
        nombre: 'Complejo propio',
      });

      const res = await request(app)
        .put('/api/complejos/1')
        .set(autorizacion(tokenDuenoA))
        .send({ nombre: 'Complejo propio' });

      expect(res.status).toBe(200);
      expect(prismaMock.complejo.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { nombre: 'Complejo propio' },
      });
    });

    it('el body de actualización no puede incluir duenoId ni encargadoId', async () => {
      prismaMock.complejo.findUnique.mockResolvedValue({
        duenoId: duenoAId,
      });

      const res = await request(app)
        .put('/api/complejos/1')
        .set(autorizacion(tokenDuenoA))
        .send({ nombre: 'Complejo propio', duenoId: 999 });

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ code: 'DATOS_INVALIDOS' });
      expect(prismaMock.complejo.update).not.toHaveBeenCalled();
    });

    it('un Dueño no puede borrar canchas de otro complejo', async () => {
      prismaMock.complejo.findUnique.mockResolvedValue({
        duenoId: complejoDeOtroDueno.duenoId,
      });

      const res = await request(app)
        .delete('/api/complejos/2/canchas/1')
        .set(autorizacion(tokenDuenoA));

      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({ code: 'PROHIBIDO' });
      expect(prismaMock.cancha.delete).not.toHaveBeenCalled();
    });

    it('un Dueño no puede crear horarios en otro complejo', async () => {
      prismaMock.complejo.findUnique.mockResolvedValue({
        duenoId: complejoDeOtroDueno.duenoId,
      });

      const res = await request(app)
        .post('/api/complejos/2/horarios')
        .set(autorizacion(tokenDuenoA))
        .send({
          complejoId: 2,
          nroDia: 1,
          horaApertura: '08:00',
          horaCierre: '22:00',
        });

      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({ code: 'PROHIBIDO' });
    });

    it('un Dueño no puede crear precios en otro complejo', async () => {
      prismaMock.complejo.findUnique.mockResolvedValue({
        duenoId: complejoDeOtroDueno.duenoId,
      });

      const res = await request(app)
        .post('/api/complejos/2/canchas/1/precios')
        .set(autorizacion(tokenDuenoA))
        .send({
          precioBase: 1000,
          precioAdicional: 500,
          precioSena: 200,
          fecha: '2026-12-01',
        });

      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({ code: 'PROHIBIDO' });
    });
  });

  describe('turnos', () => {
    it('un Dueño no puede consultar los turnos de otro complejo', async () => {
      prismaMock.complejo.findUnique.mockResolvedValue(complejoDeOtroDueno);

      const res = await request(app)
        .get('/api/turnos/complejo/2')
        .set(autorizacion(tokenDuenoA));

      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({ code: 'PROHIBIDO' });
      expect(prismaMock.turno.findMany).not.toHaveBeenCalled();
    });

    it('un Cliente no puede leer el turno de otro Cliente', async () => {
      prismaMock.turno.findUnique.mockResolvedValue(turnoDeOtroCliente);

      const res = await request(app)
        .get('/api/turnos/7')
        .set(autorizacion(tokenClienteA));

      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({ code: 'PROHIBIDO' });
    });

    it('un Cliente puede leer su propio turno', async () => {
      prismaMock.turno.findUnique.mockResolvedValue(turnoDelClienteA);

      const res = await request(app)
        .get('/api/turnos/8')
        .set(autorizacion(tokenClienteA));

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ id: 8, clienteId: clienteAId });
    });

    it('un Cliente no puede cancelar el turno de otro Cliente', async () => {
      prismaMock.turno.findUnique.mockResolvedValue(turnoDeOtroCliente);

      const res = await request(app)
        .patch('/api/turnos/7/cancelar')
        .set(autorizacion(tokenClienteA));

      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({ code: 'PROHIBIDO' });
      expect(prismaMock.turno.update).not.toHaveBeenCalled();
    });

    it('un Cliente puede cancelar su propio turno', async () => {
      prismaMock.turno.findUnique.mockResolvedValue(turnoDelClienteA);
      prismaMock.turno.update.mockResolvedValue({ id: 8, estado: 'Cancelado' });

      const res = await request(app)
        .patch('/api/turnos/8/cancelar')
        .set(autorizacion(tokenClienteA));

      expect(res.status).toBe(200);
      expect(prismaMock.turno.update).toHaveBeenCalledWith({
        where: { id: 8 },
        data: { estado: 'Cancelado' },
      });
    });

    it('POST /turnos usa el cliente del token y no el clienteId del body', async () => {
      prismaMock.complejo.findUnique.mockResolvedValue({ estado: 'Activo' });
      prismaMock.turno.findFirst.mockResolvedValue(null);
      prismaMock.turno.create.mockResolvedValue({ id: 99 });
      prismaMock.turno.findUnique.mockResolvedValue(null);

      const inicio = new Date(Date.now() + 60 * 60 * 1000);
      const fin = new Date(inicio.getTime() + 60 * 60 * 1000);

      const res = await request(app)
        .post('/api/turnos')
        .set(autorizacion(tokenClienteA))
        .send({
          clienteId: 31,
          tipoTurnoId: 1,
          complejoId: 1,
          canchaNro: 1,
          fechaInicio: inicio.toISOString(),
          fechaFin: fin.toISOString(),
          estado: 'Reservado',
        });

      expect(res.status).toBe(201);
      expect(prismaMock.turno.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ clienteId: clienteAId }),
      });
    });

    it('un Encargado no puede agendar turnos en otro complejo', async () => {
      prismaMock.complejo.findUnique.mockResolvedValue({
        encargadoId: complejoDeOtroDueno.encargadoId,
      });

      const inicio = new Date(Date.now() + 60 * 60 * 1000);
      const fin = new Date(inicio.getTime() + 60 * 60 * 1000);

      const res = await request(app)
        .post('/api/turnos/encargado')
        .set(autorizacion(tokenEncargadoA))
        .send({
          cliente: { nombre: 'Juan', apellido: 'Pérez' },
          turno: {
            tipoTurnoId: 1,
            complejoId: 2,
            canchaNro: 1,
            fechaInicio: inicio.toISOString(),
            fechaFin: fin.toISOString(),
            estado: 'Reservado',
          },
        });

      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({ code: 'PROHIBIDO' });
      expect(prismaMock.turno.create).not.toHaveBeenCalled();
    });

    it('un Encargado puede agendar en su propio complejo sin asociar un cliente', async () => {
      prismaMock.complejo.findUnique
        .mockResolvedValueOnce({ encargadoId: encargadoAId })
        .mockResolvedValueOnce({ estado: 'Activo' });
      prismaMock.turno.create.mockResolvedValue({ id: 100 });

      const inicio = new Date(Date.now() + 60 * 60 * 1000);
      const fin = new Date(inicio.getTime() + 60 * 60 * 1000);

      const res = await request(app)
        .post('/api/turnos/encargado')
        .set(autorizacion(tokenEncargadoA))
        .send({
          cliente: { nombre: 'Juan', apellido: 'Pérez' },
          turno: {
            tipoTurnoId: 1,
            complejoId: 1,
            canchaNro: 1,
            fechaInicio: inicio.toISOString(),
            fechaFin: fin.toISOString(),
            estado: 'Reservado',
          },
        });

      expect(res.status).toBe(201);
      expect(prismaMock.turno.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          clienteId: undefined,
          nombreSolicitante: 'Juan',
          apellidoSolicitante: 'Pérez',
        }),
      });
    });

    it('un Encargado no puede modificar turnos de otro complejo', async () => {
      prismaMock.turno.findUnique.mockResolvedValue(turnoDeOtroCliente);

      const res = await request(app)
        .put('/api/turnos/7')
        .set(autorizacion(tokenEncargadoA))
        .send({ estado: 'Confirmado' });

      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({ code: 'PROHIBIDO' });
      expect(prismaMock.turno.update).not.toHaveBeenCalled();
    });

    it('PUT /turnos no permite cambiar clienteId ni complejoId', async () => {
      prismaMock.turno.findUnique.mockResolvedValue(turnoDelClienteA);
      prismaMock.turno.update.mockResolvedValue({ id: 8, estado: 'Confirmado' });

      const res = await request(app)
        .put('/api/turnos/8')
        .set(autorizacion(tokenEncargadoA))
        .send({ estado: 'Confirmado', clienteId: 999, complejoId: 999 });

      expect(res.status).toBe(200);
      expect(prismaMock.turno.update).toHaveBeenCalledWith({
        where: { id: 8 },
        data: { estado: 'Confirmado' },
      });
    });
  });
});
