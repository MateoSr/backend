import type { Request, Response } from "express";
import { opinionSchema } from "./opinion.schema.js";
import { postOpinion } from "./opinion.service.js";
import { errores, asegurarEncontrado } from "../shared/errors.js";

export async function crearOpinion(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    throw errores.solicitudInvalida("El id del complejo no es válido.")
  }

  const { descripcion } = opinionSchema.parse(req.body);
  const opinion = asegurarEncontrado(await postOpinion(id, descripcion), "el complejo")

  return res.status(201).json(opinion);
}
