import { describe, it, expect } from 'vitest';
import { complejoUpdateSchema } from './complejos.schema.js';

describe('complejoUpdateSchema', () => {
  it('acepta una actualización parcial de los datos editables', () => {
    const resultado = complejoUpdateSchema.parse({
      nombre: 'Complejo actualizado',
      telefono: '1122334455',
    });

    expect(resultado).toEqual({
      nombre: 'Complejo actualizado',
      telefono: '1122334455',
    });
  });

  it('no permite cambiar el dueño ni el encargado del complejo', () => {
    const resultado = complejoUpdateSchema.safeParse({
      nombre: 'Complejo actualizado',
      duenoId: 999,
      encargadoId: 999,
    });

    expect(resultado.success).toBe(false);
  });
});
