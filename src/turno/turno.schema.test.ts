import { describe, it, expect } from 'vitest';
import { turnoUpdateBodySchema } from './turno.schema.js';

describe('turnoUpdateBodySchema', () => {
  it('acepta la actualización de datos editables del turno', () => {
    const resultado = turnoUpdateBodySchema.parse({
      estado: 'Confirmado',
      motivoCancelacion: 'Se reprogramó',
    });

    expect(resultado).toEqual({
      estado: 'Confirmado',
      motivoCancelacion: 'Se reprogramó',
    });
  });

  it('descarta clienteId y complejoId para que no se puedan cambiar', () => {
    const resultado = turnoUpdateBodySchema.parse({
      estado: 'Confirmado',
      clienteId: 999,
      complejoId: 999,
    });

    expect(resultado).toEqual({ estado: 'Confirmado' });
    expect(resultado).not.toHaveProperty('clienteId');
    expect(resultado).not.toHaveProperty('complejoId');
  });
});
