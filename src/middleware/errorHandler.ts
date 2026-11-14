import type { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { ZodError } from 'zod';
import { AppError } from '../shared/errors.js';

interface ErrorConStatus extends Error {
  status?: number;
  statusCode?: number;
  type?: string;
  expose?: boolean;
}

function tieneStatus(err: unknown): err is ErrorConStatus {
  if (!(err instanceof Error)) return false;
  const status = (err as ErrorConStatus).status ?? (err as ErrorConStatus).statusCode;
  return typeof status === 'number';
}

/**
 * Respuesta 404 para cualquier ruta que no haya matcheado.
 * Debe montarse después de todas las rutas y antes del errorHandler.
 */
export function noEncontrado(req: Request, res: Response): void {
  res.status(404).json({
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    code: 'RUTA_NO_ENCONTRADA',
  });
}

/**
 * Único punto que formatea errores. Los controllers/services solo lanzan.
 *
 * Formato:
 *   { "message": "...", "code": "...", "detalles": [...]? }
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Si ya se envió parte de la respuesta, no se puede formatear otra.
  if (res.headersSent) {
    next(err);
    return;
  }

  let status = 500;
  let code = 'ERROR_INTERNO';
  let message = 'Error interno del servidor';
  let detalles: unknown;

  if (err instanceof AppError) {
    status = err.status;
    code = err.code;
    message = err.message;
    detalles = err.detalles;
  } else if (err instanceof ZodError) {
    // Validaciones que todavía viven en los controllers (Zod se migrará
    // luego a un middleware de rutas). Mantiene el 400 con los issues.
    status = 400;
    code = 'DATOS_INVALIDOS';
    message = 'Error de validación en los datos ingresados';
    detalles = err.issues;
  } else if (err instanceof jwt.TokenExpiredError) {
    status = 401;
    code = 'TOKEN_EXPIRADO';
    message = 'El token expiró';
  } else if (err instanceof jwt.JsonWebTokenError) {
    status = 401;
    code = 'TOKEN_INVALIDO';
    message = 'Token inválido';
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      status = 409;
      code = 'CONFLICTO';
      message = 'El recurso ya existe';
    } else if (err.code === 'P2025') {
      status = 404;
      code = 'NO_ENCONTRADO';
      message = 'No se encontró el recurso';
    } else if (err.code === 'P2003') {
      status = 409;
      code = 'CONFLICTO';
      message = 'El recurso está relacionado con otros datos';
    } else {
      status = 500;
      code = 'ERROR_BASE_DATOS';
      message = 'Error al acceder a la base de datos';
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    status = 400;
    code = 'DATOS_INVALIDOS';
    message = 'Error de validación en los datos ingresados';
  } else if (err instanceof Error && err.message.startsWith('CORS bloqueado')) {
    status = 403;
    code = 'CORS_BLOQUEADO';
    message = 'Origen no permitido por CORS';
  } else if (tieneStatus(err)) {
    // Errores de body-parser (JSON inválido, body demasiado grande),
    // URIError por params mal codificados, o http-errors.
    status = err.status ?? err.statusCode ?? 500;

    if (err.type === 'entity.parse.failed') {
      status = 400;
      code = 'JSON_INVALIDO';
      message = 'El cuerpo de la petición no es un JSON válido';
    } else if (err.type === 'entity.too.large') {
      status = 413;
      code = 'CUERPO_DEMASIADO_GRANDE';
      message = 'El cuerpo de la petición es demasiado grande';
    } else {
      code = status < 500 ? 'ERROR_SOLICITUD' : 'ERROR_INTERNO';
      if (status < 500) message = err.message;
    }
  }

  if (status >= 500) {
    console.error(`[errorHandler] ${req.method} ${req.originalUrl}`, err);
    // En producción nunca exponemos detalles internos.
    if (process.env.NODE_ENV === 'production') {
      message = 'Error interno del servidor';
      detalles = undefined;
    } else if (!(err instanceof AppError) && err instanceof Error) {
      message = err.message;
    }
  }

  const body: Record<string, unknown> = { message, code };
  if (detalles !== undefined) body.detalles = detalles;

  res.status(status).json(body);
}
