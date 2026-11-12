import {patchUserPassword,getUserEmail,getUserId} from '../usuario/users.service.js'
import bcrypt from "bcryptjs";
import {
  emitirToken,
  emitirRefreshToken,
  verificarRefreshToken,
  verificarTokenReset,
} from '../shared/jwt.js';

export { enviarEmailResetPassword } from '../email/email.service.js';

export interface TokensSesion {
  token: string;
  refreshToken: string;
}

type UsuarioConRol = {
  id: number;
  email: string;
  tipoUsuario: { descripcion: string };
};

function emitirTokens(usuario: UsuarioConRol): TokensSesion {
  const payload = {
    userId: usuario.id,
    email: usuario.email,
    rol: usuario.tipoUsuario.descripcion,
  };

  return {
    token: emitirToken(payload),
    refreshToken: emitirRefreshToken(payload),
  };
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

export async function login(email: string, password: string): Promise<TokensSesion | null> {
  const user = await getUserEmail(email);
  if (!user) throw new Error("Credenciales inválidas");

  const coincide = await bcrypt.compare(password, user.password);
  if (!coincide) throw new Error("Credenciales inválidas");

  return emitirTokens(user);
}

/**
 * Renueva el par de tokens (rotación). Si el refresh token venció por
 * inactividad, jwt.verify lanza y el controller responde 401.
 */
export async function refrescarToken(refreshToken: string): Promise<TokensSesion> {
  if (!refreshToken) throw new Error("Refresh token requerido");

  const decoded = verificarRefreshToken(refreshToken);
  const user = await getUserId(decoded.userId);
  if (!user) throw new Error("Usuario no encontrado");

  return emitirTokens(user);
}
