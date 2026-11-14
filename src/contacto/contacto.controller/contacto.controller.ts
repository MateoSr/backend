import { type Request, type Response } from 'express';
import { enviarNotificacionSolicitud } from './contacto.service.js';
import { errores } from '../../shared/errors.js';

export async function recibirSolicitud(req: Request, res: Response) {
  const { razonSocial, nombreContacto, email, plan, comentario } = req.body;

  if (!razonSocial || !nombreContacto || !email || !plan) {
    throw errores.solicitudInvalida("Por favor completá los campos obligatorios.")
  }

  await enviarNotificacionSolicitud({ razonSocial, nombreContacto, email, plan, comentario });

  return res.status(200).json({ message: "Solicitud enviada con éxito. Nos pondremos en contacto pronto." });
}
