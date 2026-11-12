import type { Request, Response } from "express";
import { crearOrdenPago, procesarWebhook, obtenerEstadoOrden } from "./pago.service.js";

export async function crearOrden(req: Request, res: Response) {
  try {
    const clienteId = req.usuario?.userId;
    if (!clienteId) return res.status(401).json({ message: "No autorizado" });
    const resultado = await crearOrdenPago(req.body, clienteId);
    return res.status(201).json(resultado);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}

export async function webhook(req: Request, res: Response) {
  try {
    const resultado = await procesarWebhook(req);
    return res.status(200).json(resultado);
  } catch (error: any) {
    console.error("Error en webhook MP:", error.message);
    if (error.message === "Firma de webhook inválida" || error.message === "Headers de webhook incompletos") {
      return res.status(401).json({ ok: false });
    }
    return res.status(500).json({ ok: false });
  }
}

export async function estadoOrden(req: Request, res: Response) {
  try {
    const clienteId = req.usuario?.userId;
    if (!clienteId) return res.status(401).json({ message: "No autorizado" });
    const externalReference = Array.isArray(req.params.externalReference)
      ? req.params.externalReference[0]
      : req.params.externalReference;
    const resultado = await obtenerEstadoOrden(externalReference, clienteId);
    return res.status(200).json(resultado);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}
