import type { Request, Response, NextFunction } from 'express';
import { verificarToken } from '../shared/jwt.js';


//   1. Saca el token del header Authorization.
//   2. Lo verifica con el secret del servidor.
//   3. Deja el payload en req.usuario para que lo use lo que venga después.


export function autenticar(req: Request, res: Response, next: NextFunction): void {
  try {
    
    const header = req.headers.authorization;

    if (!header?.startsWith('Bearer ')) {
      throw new Error('Falta el token de autenticación');
    }

    const token = header.slice('Bearer '.length);

    req.usuario = verificarToken(token);

    next();
  } catch (error) {
    
    if (error instanceof Error) {
      next(error);
      return;
    }

    next(new Error('Token inválido o expirado'));
  }
}