import { type Request, type Response } from 'express';
import { enviarNotificacionSolicitud } from './contacto.service.js';

export async function recibirSolicitud(req: Request, res: Response) {
  try {
    const { razonSocial, nombreContacto, email, plan, comentario } = req.body;

    if (!razonSocial || !nombreContacto || !email || !plan) {
      return res.status(400).json({ message: "Por favor completá los campos obligatorios." });
    }

    await enviarNotificacionSolicitud({ razonSocial, nombreContacto, email, plan, comentario });

    return res.status(200).json({ message: "Solicitud enviada con éxito. Nos pondremos en contacto pronto." });
  } catch (error: any) {
    console.error("Error al enviar solicitud:", error);
    return res.status(500).json({ message: "Ocurrió un error al enviar la solicitud." });
  }
}