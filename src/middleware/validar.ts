import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

/**
 * Valida y reemplaza req.body con el resultado del schema.
 * Los ZodError se dejan propagar: el errorHandler central los formatea
 * como 400 DATOS_INVALIDOS con el detalle de los issues.
 */
export function validarCuerpo<T>(schema: ZodType<T>): RequestHandler {
  return (req, _res, next) => {
    req.body = schema.parse(req.body);
    next();
  };
}

/**
 * Valida req.params (útil cuando el body depende de ids que vienen por path).
 * No reemplaza los params originales de Express.
 */
export function validarParams<T>(schema: ZodType<T>): RequestHandler {
  return (req, _res, next) => {
    schema.parse(req.params);
    next();
  };
}
