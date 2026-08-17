import { z } from 'zod';


export const personaJuridicaSchema = z.object({
  cuit: z.string().min(11, "El cuit es un campo obligatorio"),
  razonSocial: z.string().min(1, "La razon social es un campo obligatorio")
});

export type PersonaJuridica = z.infer<typeof personaJuridicaSchema>;