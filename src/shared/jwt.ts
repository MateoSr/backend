import jwt from 'jsonwebtoken'

export interface TokenPayload {
  userId: number;
  email: string;
  rol: string;
}

export interface RefreshTokenPayload extends TokenPayload {
  tipo: 'refresh';
}

export function emitirToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.SECRET_KEY!, {

    expiresIn: process.env.JWT_EXPIRES_IN! as jwt.SignOptions['expiresIn'],
  });
}

/**
 * El refresh token vive más que el access token y se firma con un secreto
 * distinto. Se rota en cada /refresh, así que si el usuario pasa 60 minutos
 * sin renovarlo (inactividad) vence y la sesión no se puede recuperar.
 */
export function emitirRefreshToken(payload: TokenPayload): string {
  return jwt.sign({ ...payload, tipo: 'refresh' }, process.env.SECRET_KEY_REFRESH!, {

    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN! as jwt.SignOptions['expiresIn'],
  });
}

export function emitirTokenReset(userId: number): string {
  return jwt.sign({ userId }, process.env.SECRET_KEY_RESET!, {

    expiresIn: process.env.JWTRESET_EXPIRES_IN! as jwt.SignOptions['expiresIn'],
  });
}

export function verificarToken(token: string): TokenPayload {
  const payload = jwt.verify(token, process.env.SECRET_KEY!, { algorithms: ['HS256'] }) as TokenPayload & {
    tipo?: string;
  };
  // Un refresh token nunca debe servir como access token.
  if (payload.tipo === 'refresh') throw new Error('Token inválido');
  return payload;
}

export function verificarRefreshToken(token: string): RefreshTokenPayload {
  const payload = jwt.verify(token, process.env.SECRET_KEY_REFRESH!, {
    algorithms: ['HS256'],
  }) as RefreshTokenPayload;
  if (payload.tipo !== 'refresh') throw new Error('Refresh token inválido');
  return payload;
}

export function verificarTokenReset(token: string): { userId: number } {
  return jwt.verify(token, process.env.SECRET_KEY_RESET!, { algorithms: ['HS256'] }) as { userId: number };
}
