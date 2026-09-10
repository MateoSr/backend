import jwt from 'jsonwebtoken'

export interface TokenPayload {
  userId: number;
  email: string;
  rol: string;
}

export function emitirToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.SECRET_KEY!, {

    expiresIn: process.env.JWT_EXPIRES_IN! as jwt.SignOptions['expiresIn'],
  });
}

export function verificarToken(token: string): TokenPayload {
  return jwt.verify(token, process.env.SECRET_KEY!, { algorithms: ['HS256'] }) as TokenPayload;
}