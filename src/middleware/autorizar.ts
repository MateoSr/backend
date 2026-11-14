import type { NextFunction, Request, Response } from 'express';
import { errores } from '../shared/errors.js';

export function autorizarPorNombre(...rolesPermitidos: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.usuario) {
      next(errores.noAutorizado('Usuario no autenticado'));
      return;
    }

    const rol = req.usuario.rol;
    if (!rol || !rolesPermitidos.includes(rol)) {
      next(errores.prohibido('Acceso denegado: rol no autorizado'));
      return;
    }

    next();
  };
}
