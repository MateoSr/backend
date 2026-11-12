import { z } from "zod";

export const opinionSchema = z.object({
  descripcion: z
    .string()
    .trim()
    .min(1, "La opinión no puede estar vacía.")
    .max(500, "La opinión no puede superar los 500 caracteres."),
});
