import { vi } from 'vitest';

// Variables de entorno de prueba: no usamos los secretos reales del .env
process.env.NODE_ENV = 'test';
process.env.SECRET_KEY = 'secret-de-prueba';
process.env.SECRET_KEY_RESET = 'secret-reset-de-prueba';
process.env.JWT_EXPIRES_IN = '1h';
process.env.JWTRESET_EXPIRES_IN = '1h';
process.env.FRONTEND_URL = 'http://localhost:5173';

// Evita que el módulo de email (Brevo) intente hacer llamadas reales.
vi.mock('@getbrevo/brevo', () => ({
  BrevoClient: class {
    transactionalEmails = {
      sendTransacEmail: vi.fn().mockResolvedValue({ messageId: 'test' }),
    };
  },
}));
