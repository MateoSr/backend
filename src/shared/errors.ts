/**
 * Error de aplicación con status HTTP y código estable.
 *
 * Los controllers y services lanzan estos errores; el middleware
 * `errorHandler` es el único que los convierte en respuesta JSON.
 */
export class AppError extends Error {
  readonly status: number;
  readonly code: string;
  readonly detalles?: unknown;

  constructor(message: string, status = 400, code = 'ERROR', detalles?: unknown) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.detalles = detalles;
  }
}

export const errores = {
  solicitudInvalida: (mensaje: string, code = 'SOLICITUD_INVALIDA') =>
    new AppError(mensaje, 400, code),

  datosInvalidos: (detalles?: unknown) =>
    new AppError('Error de validación en los datos ingresados', 400, 'DATOS_INVALIDOS', detalles),

  noAutorizado: (mensaje = 'No autorizado') =>
    new AppError(mensaje, 401, 'NO_AUTORIZADO'),

  prohibido: (mensaje = 'Acceso denegado') =>
    new AppError(mensaje, 403, 'PROHIBIDO'),

  noEncontrado: (recurso = 'el recurso') =>
    new AppError(`No se encontró ${recurso}`, 404, 'NO_ENCONTRADO'),

  conflicto: (mensaje: string) =>
    new AppError(mensaje, 409, 'CONFLICTO'),

  errorExterno: (mensaje = 'Error en un servicio externo') =>
    new AppError(mensaje, 502, 'ERROR_EXTERNO'),

  configuracionFaltante: (mensaje: string) =>
    new AppError(mensaje, 500, 'CONFIGURACION_FALTANTE'),

  errorInterno: (mensaje = 'Error interno del servidor') =>
    new AppError(mensaje, 500, 'ERROR_INTERNO'),
};

/**
 * Devuelve el valor o lanza un 404 con el nombre del recurso.
 * Evita repetir `if (!valor) throw ...` en los controllers.
 */
export function asegurarEncontrado<T>(valor: T | null | undefined, recurso: string): T {
  if (valor === null || valor === undefined) {
    throw errores.noEncontrado(recurso);
  }
  return valor;
}
