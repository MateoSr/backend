import type { Request, Response } from "express";
import { ZodError } from "zod";
import { opinionSchema } from "./opinion.schema.js";
import { postOpinion } from "./opinion.service.js";

export async function crearOpinion(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "El id del complejo no es válido." });
    }

    const { descripcion } = opinionSchema.parse(req.body);
    const opinion = await postOpinion(id, descripcion);

    if (!opinion) {
      return res.status(404).json({ message: "No se encontró el complejo." });
    }

    return res.status(201).json(opinion);
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ message: "La opinión debe tener entre 1 y 500 caracteres." });
    }

    return res.status(400).json({
      error: error instanceof Error ? error.message : "No se pudo crear la opinión.",
    });
  }
}
