import { BrevoClient } from '@getbrevo/brevo';

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY || '',
});

interface SolicitudContacto {
  razonSocial: string;
  nombreContacto: string;
  email: string;
  plan: string;
  comentario?: string;
}

export async function enviarNotificacionSolicitud(datos: SolicitudContacto) {
  const { razonSocial, nombreContacto, email, plan, comentario } = datos;

  await brevo.transactionalEmails.sendTransacEmail({
    subject: `🚀 Nueva solicitud de contratación: ${razonSocial}`,
    sender: {
      name: "Turno Libre System",
      email: "soporteturnolibre@gmail.com",
    },
    // 🟢 Email donde USTEDES reciben la notificación
    to: [
      {
        email: "soporteturnolibre@gmail.com",
        name: "Equipo Turno Libre",
      },
    ],
    // 🟢 replyTo para que si responden el correo, le responda directo al cliente
    replyTo: {
      email: email,
      name: nombreContacto,
    },
    htmlContent: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>¡Nueva petición de contratación recibida!</h2>
        <p>Un cliente completó el formulario para configurar su complejo:</p>
        <hr style="border: 0; border-top: 1px solid #ccc;" />
        <ul>
          <li><strong>Razón Social:</strong> ${razonSocial}</li>
          <li><strong>Nombre de contacto:</strong> ${nombreContacto}</li>
          <li><strong>Correo Electrónico:</strong> <a href="mailto:${email}">${email}</a></li>
          <li><strong>Plan de preferencia:</strong> ${plan}</li>
          <li><strong>Comentario:</strong> ${comentario || 'Sin comentario'}</li>
        </ul>
        <hr style="border: 0; border-top: 1px solid #ccc;" />
        <p style="font-size: 12px; color: #777;">Responde directamente a este correo para comunicarte con el cliente.</p>
      </div>
    `,
  });
}