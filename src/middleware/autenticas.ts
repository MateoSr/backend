import type { Request, Response, NextFunction } from 'express';
import { verificarToken } from '../shared/jwt.js';
import { errores } from '../shared/errors.js';

//   1. Saca el token del header Authorization.
//   2. Lo verifica con el secret del servidor.
//   3. Deja el payload en req.usuario para que lo use lo que venga después.

export function autenticar(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    next(errores.noAutorizado('Falta el token de autenticación'));
    return;
  }

  try {
    const token = header.slice('Bearer '.length);
    req.usuario = verificarToken(token);
    next();
  } catch {
    // Token vencido, manipulado o un refresh usado como access.
    next(errores.noAutorizado('Token inválido o expirado'));
  }
}
