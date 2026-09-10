import {BrevoClient} from '@getbrevo/brevo'
import {patchUserPassword,getUserEmail} from '../usuario/users.service.js'
import bcrypt from "bcryptjs";
import { emitirTokenReset,emitirToken, verificarTokenReset } from '../shared/jwt.js';

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY || '',
});

export async function enviarEmailResetPassword(email: string, userId: number){
  const resetToken = emitirTokenReset(userId);
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

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

export async function resetPassword(token: string, password: string): Promise<boolean> {
  try {
    // 1. Verificamos el token (si venció o fue manipulado, saltará al catch)
    const decoded = verificarTokenReset(token);

    // 2. Extraemos el userId de forma segura desde el payload decodificado
    const response = await patchUserPassword(decoded.userId, password);
    return response;
  } catch (error) {
    // El token expiró o es inválido
    return false;
  }
}

export async function login(email: string, password: string): Promise<{token: string} | null> {
  const user = await getUserEmail(email);
  if (!user) throw new Error("Credenciales inválidas");


  const coincide = await bcrypt.compare(password, user.password);
  if (!coincide) throw new Error("Credenciales inválidas");

  
  const token = emitirToken({ userId: user.id, email: user.email, rol: user.tipoUsuario.descripcion });
  return {
    token
  };
}