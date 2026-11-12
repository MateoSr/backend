import type { PayloadToken } from '../shared/jwt.js';

declare global {
  namespace Express {
    interface Request {
      usuario?: TokenPayload;
    }
  }
}
export {};