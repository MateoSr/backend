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
import { cancelarTurnoServicio } from './turno.service.js';

const prismaMock = prisma as unknown as {
  turno: {
    findUnique: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
};

// Test unitario 3: regla de negocio de cancelación de turnos.
describe('turno.service - cancelarTurnoServicio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('cancela un turno reservado y actualiza su estado a "Cancelado"', async () => {
    prismaMock.turno.findUnique.mockResolvedValue({ id: 1, estado: 'Reservado' });
    prismaMock.turno.update.mockResolvedValue({ id: 1, estado: 'Cancelado' });

    const resultado = await cancelarTurnoServicio(1);

    expect(prismaMock.turno.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { estado: 'Cancelado' },
    });
    expect(resultado).toEqual({ id: 1, estado: 'Cancelado' });
  });
});
