import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextFunction, Request, Response } from 'express';

// Mockeamos Prisma antes de importar el middleware que lo usa.
vi.mock('../shared/prisma.js', () => ({
  prisma: {
    complejo: {
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from '../shared/prisma.js';
import {
  autorizarDuenoDeComplejo,
  autorizarDuenoOEncargadoDeComplejo,
} from './propiedad.js';
import type { TokenPayload } from '../shared/jwt.js';

const prismaMock = prisma as unknown as {
  complejo: {
    findUnique: ReturnType<typeof vi.fn>;
  };
};

const res = {} as Response;

function crearReq(params: Record<string, string>, usuario?: TokenPayload): Request {
  return { params, usuario } as unknown as Request;
}

function ejecutarMiddleware(
  middleware: ReturnType<typeof autorizarDuenoDeComplejo>,
  req: Request
) {
  const next = vi.fn();
  return middleware(req, res, next as unknown as NextFunction).then(() => next);
}

const dueno: TokenPayload = {
  userId: 10,
  email: 'dueno@test.com',
  rol: 'Dueño',
};

const encargado: TokenPayload = {
  userId: 20,
  email: 'encargado@test.com',
  rol: 'Encargado',
};

describe('middleware de propiedad de complejos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('autorizarDuenoDeComplejo', () => {
    it('deja pasar al Dueño del complejo', async () => {
      prismaMock.complejo.findUnique.mockResolvedValue({ duenoId: dueno.userId });

      const next = await ejecutarMiddleware(
        autorizarDuenoDeComplejo('id_complejo'),
        crearReq({ id_complejo: '5' }, dueno)
      );

      expect(prismaMock.complejo.findUnique).toHaveBeenCalledWith({
        where: { id: 5 },
        select: { duenoId: true },
      });
      expect(next).toHaveBeenCalledWith();
    });

    it('rechaza con 403 al Dueño de otro complejo', async () => {
      prismaMock.complejo.findUnique.mockResolvedValue({ duenoId: 999 });

      const next = await ejecutarMiddleware(
        autorizarDuenoDeComplejo(),
        crearReq({ id: '5' }, dueno)
      );

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ status: 403, code: 'PROHIBIDO' })
      );
    });

    it('devuelve 404 si el complejo no existe', async () => {
      prismaMock.complejo.findUnique.mockResolvedValue(null);

      const next = await ejecutarMiddleware(
        autorizarDuenoDeComplejo(),
        crearReq({ id: '404' }, dueno)
      );

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ status: 404, code: 'NO_ENCONTRADO' })
      );
    });

    it('rechaza con 401 si no hay usuario autenticado', async () => {
      const next = await ejecutarMiddleware(
        autorizarDuenoDeComplejo(),
        crearReq({ id: '5' })
      );

      expect(prismaMock.complejo.findUnique).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ status: 401, code: 'NO_AUTORIZADO' })
      );
    });
  });

  describe('autorizarDuenoOEncargadoDeComplejo', () => {
    it('deja pasar al Dueño del complejo', async () => {
      prismaMock.complejo.findUnique.mockResolvedValue({
        duenoId: dueno.userId,
        encargadoId: encargado.userId,
      });

      const next = await ejecutarMiddleware(
        autorizarDuenoOEncargadoDeComplejo(),
        crearReq({ id: '5' }, dueno)
      );

      expect(next).toHaveBeenCalledWith();
    });

    it('deja pasar al Encargado del complejo', async () => {
      prismaMock.complejo.findUnique.mockResolvedValue({
        duenoId: dueno.userId,
        encargadoId: encargado.userId,
      });

      const next = await ejecutarMiddleware(
        autorizarDuenoOEncargadoDeComplejo(),
        crearReq({ id: '5' }, encargado)
      );

      expect(next).toHaveBeenCalledWith();
    });

    it('rechaza con 403 al Dueño o Encargado de otro complejo', async () => {
      prismaMock.complejo.findUnique.mockResolvedValue({
        duenoId: 999,
        encargadoId: 998,
      });

      const next = await ejecutarMiddleware(
        autorizarDuenoOEncargadoDeComplejo(),
        crearReq({ id: '5' }, dueno)
      );

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ status: 403, code: 'PROHIBIDO' })
      );
    });
  });
});
