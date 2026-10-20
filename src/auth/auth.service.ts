import {patchUserPassword,getUserEmail} from '../usuario/users.service.js'
import bcrypt from "bcryptjs";
import { emitirToken, verificarTokenReset } from '../shared/jwt.js';

export { enviarEmailResetPassword } from '../email/email.service.js';

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

export async function loginAdmin(email: string, password: string): Promise<{token: string} | null> {
  const user = await getUserEmail(email);
  if (!user) throw new Error("Credenciales inválidas");


  const coincide = await bcrypt.compare(password, user.password);
  if (!coincide && user.tipoUsuarioId !== 1) throw new Error("Credenciales inválidas");
  
  const token = emitirToken({ userId: user.id, email: user.email, rol: user.tipoUsuario.descripcion });
  return {
    token
  };
}