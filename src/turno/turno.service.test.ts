import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mockeamos Prisma antes de importar el servicio que lo usa.
vi.mock('../shared/prisma.js', () => ({
  prisma: {
    turno: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import { prisma } from '../shared/prisma.js';
import { cancelarTurnoServicio, verificarAccesoTurno } from './turno.service.js';
import type { TokenPayload } from '../shared/jwt.js';

const prismaMock = prisma as unknown as {
  turno: {
    findUnique: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
};

const complejoDelTurno = { duenoId: 20, encargadoId: 21 };

const clienteDuenoDelTurno: TokenPayload = {
  userId: 10,
  email: 'cliente1@test.com',
  rol: 'Cliente',
};

const otroCliente: TokenPayload = {
  userId: 11,
  email: 'cliente2@test.com',
  rol: 'Cliente',
};

const turnoReservado = {
  id: 1,
  estado: 'Reservado',
  clienteId: clienteDuenoDelTurno.userId,
  complejo: complejoDelTurno,
};

// Test unitario 3: regla de negocio de cancelación de turnos.
describe('turno.service - cancelarTurnoServicio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('cancela un turno reservado propio y actualiza su estado a "Cancelado"', async () => {
    prismaMock.turno.findUnique.mockResolvedValue(turnoReservado);
    prismaMock.turno.update.mockResolvedValue({ id: 1, estado: 'Cancelado' });

    const resultado = await cancelarTurnoServicio(1, clienteDuenoDelTurno);

    expect(prismaMock.turno.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { estado: 'Cancelado' },
    });
    expect(resultado).toEqual({ id: 1, estado: 'Cancelado' });
  });

  it('rechaza cancelar el turno de otro cliente sin actualizarlo', async () => {
    prismaMock.turno.findUnique.mockResolvedValue(turnoReservado);

    await expect(cancelarTurnoServicio(1, otroCliente)).rejects.toMatchObject({
      status: 403,
      code: 'PROHIBIDO',
    });
    expect(prismaMock.turno.update).not.toHaveBeenCalled();
  });

  it('rechaza cancelar un turno que no está reservado', async () => {
    prismaMock.turno.findUnique.mockResolvedValue({
      ...turnoReservado,
      estado: 'Confirmado',
    });

    await expect(cancelarTurnoServicio(1, clienteDuenoDelTurno)).rejects.toMatchObject({
      status: 409,
      code: 'CONFLICTO',
    });
    expect(prismaMock.turno.update).not.toHaveBeenCalled();
  });

  it('devuelve 404 si el turno no existe', async () => {
    prismaMock.turno.findUnique.mockResolvedValue(null);

    await expect(cancelarTurnoServicio(99, clienteDuenoDelTurno)).rejects.toMatchObject({
      status: 404,
      code: 'NO_ENCONTRADO',
    });
  });
});

describe('turno.service - verificarAccesoTurno', () => {
  const turno = turnoReservado;

  it('permite al Cliente dueño del turno y al Administrador', () => {
    expect(() => verificarAccesoTurno(turno, clienteDuenoDelTurno)).not.toThrow();
    expect(() =>
      verificarAccesoTurno(turno, {
        userId: 99,
        email: 'admin@test.com',
        rol: 'Administrador',
      })
    ).not.toThrow();
  });

  it('permite al Dueño y al Encargado del complejo del turno', () => {
    expect(() =>
      verificarAccesoTurno(turno, {
        userId: complejoDelTurno.duenoId,
        email: 'dueno@test.com',
        rol: 'Dueño',
      })
    ).not.toThrow();

    expect(() =>
      verificarAccesoTurno(turno, {
        userId: complejoDelTurno.encargadoId,
        email: 'encargado@test.com',
        rol: 'Encargado',
      })
    ).not.toThrow();
  });

  it('rechaza a un Cliente, Dueño o Encargado ajeno', () => {
    expect(() => verificarAccesoTurno(turno, otroCliente)).toThrow(/permiso/);

    expect(() =>
      verificarAccesoTurno(turno, {
        userId: 999,
        email: 'otro-dueno@test.com',
        rol: 'Dueño',
      })
    ).toThrow(/permiso/);

    expect(() =>
      verificarAccesoTurno(turno, {
        userId: 999,
        email: 'otro-encargado@test.com',
        rol: 'Encargado',
      })
    ).toThrow(/permiso/);
  });
});
