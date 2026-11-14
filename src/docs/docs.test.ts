import { describe, expect, it } from 'vitest';
import type { Router } from 'express';
import { swaggerSpec } from '../config/swagger.js';
import userRouter from '../usuario/users.route.js';
import complejoRouter from '../complejo/complejos.routes.js';
import provinciaRouter from '../provincia/provincia.routes.js';
import localidadRouter from '../localidad/localidad.routes.js';
import tipoUsuarioRouter from '../tipoUsuario/tipoUsuario.routes.js';
import personaJuridicaRouter from '../personaJuridica/personaJuridica.routes.js';
import personaFisicaRouter from '../personaFisica/personaFisica.routes.js';
import turnoRouter from '../turno/turno.routes.js';
import tipoTurnoRouter from '../tipoTurno/tipoTurno.routes.js';
import tipoCanchaRouter from '../tipoCancha/tipoCancha.routes.js';
import loginRouter from '../auth/auth.routes.js';
import contactoRouter from '../contacto/contacto.routes.js';
import menuRouter from '../menues/menu.routes.js';
import pagoRouter from '../pago/pago.routes.js';

const montajes: Array<[string, Router]> = [
  ['/api/users', userRouter],
  ['/api/complejos', complejoRouter],
  ['/api/provincias', provinciaRouter],
  ['/api/localidad', localidadRouter],
  ['/api/tipoUsuario', tipoUsuarioRouter],
  ['/api/personaJuridica', personaJuridicaRouter],
  ['/api/personaFisica', personaFisicaRouter],
  ['/api', loginRouter],
  ['/api/turnos', turnoRouter],
  ['/api/tipoTurno', tipoTurnoRouter],
  ['/api/tipoCancha', tipoCanchaRouter],
  ['/api/contacto', contactoRouter],
  ['/api/menues', menuRouter],
  ['/api/pagos', pagoRouter],
];

function normalizarRuta(ruta: string): string {
  const sinBarraFinal = ruta.length > 1 ? ruta.replace(/\/$/, '') : ruta;
  return sinBarraFinal.replace(/:([A-Za-z0-9_]+)/g, '{$1}');
}

function rutasDeExpress(): Set<string> {
  const rutas = new Set<string>();

  for (const [montaje, router] of montajes) {
    const stack = (router as unknown as { stack: Array<Record<string, any>> }).stack;
    for (const layer of stack) {
      if (!layer.route) continue;

      const metodos = Object.entries(layer.route.methods)
        .filter(([, habilitado]) => habilitado)
        .map(([metodo]) => metodo.toUpperCase());

      for (const metodo of metodos) {
        rutas.add(`${metodo} ${normalizarRuta(`${montaje}${layer.route.path}`)}`);
      }
    }
  }

  return rutas;
}

function operacionesDelSpec(): Set<string> {
  const operaciones = new Set<string>();
  for (const [ruta, item] of Object.entries(swaggerSpec.paths ?? {})) {
    for (const metodo of Object.keys(item)) {
      operaciones.add(`${metodo.toUpperCase()} ${ruta}`);
    }
  }
  return operaciones;
}

describe('documentación OpenAPI', () => {
  it('mantiene las 48 rutas y las 71 operaciones', () => {
    expect(Object.keys(swaggerSpec.paths ?? {})).toHaveLength(48);
    expect(operacionesDelSpec()).toHaveLength(71);
  });

  it('documenta todas las rutas de Express y no inventa rutas', () => {
    expect([...operacionesDelSpec()].sort()).toEqual([...rutasDeExpress()].sort());
  });

  it('publica UserResponse sin campos sensibles', () => {
    const userResponse = swaggerSpec.components?.schemas?.UserResponse as
      | { properties?: Record<string, unknown> }
      | undefined;

    expect(userResponse?.properties).toBeDefined();
    expect(Object.keys(userResponse?.properties ?? {})).not.toContain('password');

    const registro = swaggerSpec.paths?.['/api/register']?.post?.responses?.['201'];
    expect(JSON.stringify(registro)).toContain('#/components/schemas/UserResponse');
  });
});
