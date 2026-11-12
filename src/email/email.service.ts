import { BrevoClient } from '@getbrevo/brevo';

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY || '',
});

export async function enviarEmailResetPassword(email: string, userId: number) {
  const resetToken = (await import('../shared/jwt.js')).emitirTokenReset(userId);
  const resetUrl = `${process.env.FRONTEND_PUBLIC_URL}/reset-password?token=${resetToken}`;

  await brevo.transactionalEmails.sendTransacEmail({
    subject: "Restablece tu contraseña - Turno Libre",
    sender: {
      name: "Turno Libre",
      email: "soporteturnolibre@gmail.com",
    },
    to: [
      {
        email: email,
      },
    ],
    htmlContent: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>TurnoLibre</h1>
        <h2>Restablecimiento de contraseña</h2>
        <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
        <a href="${resetUrl}" 
          style="background-color: #eb6e25; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Restablecer Contraseña
        </a>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">
          Si no solicitaste este cambio, puedes ignorar este correo.
        </p>
      </div>
    `,
  });
}

export async function enviarEmailComprobanteReserva(turnoCompleto: any) {
  try {
    const cliente = turnoCompleto.cliente;
    const email = cliente?.email;
    if (!email) return;

    const nombreCliente = cliente.personaFisica
      ? `${cliente.personaFisica.nombre} ${cliente.personaFisica.apellido}`
      : cliente.personaJuridica?.razonSocial || 'Cliente';

    const aAR = (d: Date) => new Date(new Date(d).getTime() - 3 * 60 * 60 * 1000);
    const fi = aAR(turnoCompleto.fechaInicio);
    const ff = aAR(turnoCompleto.fechaFin);
    const fecha = fi.toISOString().slice(0, 10).split('-').reverse().join('/');
    const horaIni = fi.toISOString().slice(11, 16);
    const horaFin = ff.toISOString().slice(11, 16);

    await brevo.transactionalEmails.sendTransacEmail({
      subject: `Comprobante de reserva - Turno #${turnoCompleto.id}`,
      sender: {
        name: "Turno Libre",
        email: "soporteturnolibre@gmail.com",
      },
      to: [
        {
          email: email,
        },
      ],
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #eb6e25;">TurnoLibre</h1>
          <h2>Comprobante de Reserva</h2>
          <p>Hola <strong>${nombreCliente}</strong>, tu turno fue reservado correctamente.</p>
          <div style="background:#f9f9f9; padding:20px; border-radius:8px; margin:20px 0;">
            <p><strong>N° de Turno:</strong> ${turnoCompleto.id}</p>
            <p><strong>Complejo:</strong> ${turnoCompleto.complejo?.nombre || ''}</p>
            <p><strong>Dirección:</strong> ${turnoCompleto.complejo?.direccion || ''}</p>
            <p><strong>Cancha:</strong> N° ${turnoCompleto.canchaNro} - ${turnoCompleto.cancha?.tipoCancha?.deporte || ''}</p>
            <p><strong>Fecha:</strong> ${fecha}</p>
            <p><strong>Horario:</strong> ${horaIni} hs a ${horaFin} hs</p>
            <p><strong>Estado:</strong> ${turnoCompleto.estado}</p>
          </div>
          <p style="color:#666; font-size:12px;">Este es un comprobante automático, no es necesario responder.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Error enviando comprobante de reserva:", err);
  }
}
