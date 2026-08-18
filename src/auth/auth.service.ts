import {BrevoClient} from '@getbrevo/brevo'
import {patchUserPassword} from '../usuario/users.service.js'

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY || '',
});

export async function enviarEmailResetPassword(email: string, userId: number){
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?id=${userId}`;

  // Usamos la API de transactionalEmails directamente
await brevo.transactionalEmails.sendTransacEmail({
    subject: "Restablece tu contraseña - Turno Libre",
    sender: {
      name: "Turno Libre",
      email: "soporteturnolibre@gmail.com", // Reemplazar por tu mail verificado en Brevo
    },
    to: [
      {
        email: email,
      },
    ],
    htmlContent: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>LAUTI COME GATOS</h1>
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

export async function resetPassword(id:number, password:string):Promise<boolean>{
    //traBAJAR con el tokem cuando haya
    const response = await patchUserPassword(id,password)
    return response
}