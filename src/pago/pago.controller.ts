import type { Request, Response } from "express";
import { crearOrdenPago, procesarWebhook, obtenerEstadoOrden } from "./pago.service.js";
import { errores } from "../shared/errors.js";

export async function crearOrden(req: Request, res: Response) {
  const clienteId = req.usuario?.userId;
  if (!clienteId) throw errores.noAutorizado("No autorizado");
  const resultado = await crearOrdenPago(req.body, clienteId);
  return res.status(201).json(resultado);
}

export async function webhook(req: Request, res: Response) {
  const resultado = await procesarWebhook(req);
  return res.status(200).json(resultado);
}

export async function estadoOrden(req: Request, res: Response) {
  const clienteId = req.usuario?.userId;
  if (!clienteId) throw errores.noAutorizado("No autorizado");
  const externalReference = Array.isArray(req.params.externalReference)
    ? req.params.externalReference[0]
    : req.params.externalReference;
  const resultado = await obtenerEstadoOrden(externalReference, clienteId);
  return res.status(200).json(resultado);
}
