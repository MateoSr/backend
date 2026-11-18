import type { NextFunction, Request, Response } from 'express';
import { prisma } from '../shared/prisma.js';
import { errores } from '../shared/errors.js';

function obtenerComplejoId(req: Request, param: string): number {
  const complejoId = Number(req.params[param]);

  if (!Number.isInteger(complejoId)) {
    throw errores.solicitudInvalida('El id del complejo es inválido.');
  }

  return complejoId;
}

/**
 * Verifica que el complejo indicado en `param` pertenezca al Dueño autenticado.
 * Se usa después de `autorizarPorNombre("Dueño")`.
 */
export function autorizarDuenoDeComplejo(param = 'id') {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.usuario) {
        throw errores.noAutorizado('Usuario no autenticado');
      }

      const complejoId = obtenerComplejoId(req, param);
      const complejo = await prisma.complejo.findUnique({
        where: { id: complejoId },
        select: { duenoId: true },
      });

      if (!complejo) {
        throw errores.noEncontrado('el complejo');
      }

      if (complejo.duenoId !== req.usuario.userId) {
        throw errores.prohibido('No tenés permiso para modificar un complejo ajeno');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Verifica que el complejo indicado en `param` pertenezca al Dueño o al
 * Encargado autenticado. Se usa después de autorizar esos roles.
 */
export function autorizarDuenoOEncargadoDeComplejo(param = 'id') {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.usuario) {
        throw errores.noAutorizado('Usuario no autenticado');
      }

      const complejoId = obtenerComplejoId(req, param);
      const complejo = await prisma.complejo.findUnique({
        where: { id: complejoId },
        select: { duenoId: true, encargadoId: true },
      });

      if (!complejo) {
        throw errores.noEncontrado('el complejo');
      }

      const esDueno =
        req.usuario.rol === 'Dueño' && complejo.duenoId === req.usuario.userId;
      const esEncargado =
        req.usuario.rol === 'Encargado' && complejo.encargadoId === req.usuario.userId;

      if (!esDueno && !esEncargado) {
        throw errores.prohibido('No tenés permiso para acceder a este complejo');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
