import type { Express, Request, Response } from 'express';
import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi';
import swaggerUi from 'swagger-ui-express';
import { registrarDocumentacion } from '../docs/index.js';

const apiPublica = process.env.BACKEND_PUBLIC_URL?.replace(/\/$/, '');

// Registro central: cada dominio se registra desde src/docs/*.docs.ts.
const registry = new OpenAPIRegistry();
registrarDocumentacion(registry);

const swaggerSpec = new OpenApiGeneratorV3(registry.definitions).generateDocument({
  openapi: '3.0.3',
  info: {
    title: 'API de Turno Libre',
    version: '1.0.0',
    description: [
      'Documentación de la API para la gestión de complejos, canchas, turnos y pagos.',
      '',
      'Todos los errores comparten el mismo contrato:',
      '```json',
      '{ "message": "No se encontró el complejo", "code": "NO_ENCONTRADO" }',
      '```',
      'En validaciones se agrega `detalles` con los issues correspondientes.',
      '',
      'Para los endpoints protegidos: iniciar sesión en `POST /api/login`, copiar el `token`',
      'y usar el botón **Authorize** con el esquema `bearerAuth`.',
    ].join('\n'),
  },
  servers: [
    ...(apiPublica
      ? [{ url: apiPublica, description: 'Servidor desplegado' }]
      : []),
    {
      url: `http://localhost:${process.env.PORT || 3000}`,
      description: 'Servidor de desarrollo',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Login, refresh y recuperación de contraseña' },
    { name: 'Usuarios', description: 'Usuarios y perfiles' },
    { name: 'Complejos', description: 'Complejos, disponibilidad y búsqueda' },
    { name: 'Horarios', description: 'Horarios de atención por complejo' },
    { name: 'Canchas', description: 'Canchas de cada complejo' },
    { name: 'Precios', description: 'Precios y señas por cancha' },
    { name: 'Opiniones', description: 'Opiniones anónimas de complejos' },
    { name: 'Turnos', description: 'Reservas y cancelaciones' },
    { name: 'Pagos', description: 'Órdenes de pago con Mercado Pago' },
    { name: 'Provincias', description: 'Provincias y localidades' },
    { name: 'Localidades', description: 'Localidades' },
    { name: 'Catálogos', description: 'Tipos de usuario, turno y cancha' },
    { name: 'Personas', description: 'Personas físicas y jurídicas' },
    { name: 'Contacto', description: 'Solicitudes de contacto' },
    { name: 'Menú', description: 'Datos del panel del dueño' },
  ],
});

export { swaggerSpec };

export const swaggerDocs = (app: Express): void => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: { persistAuthorization: true },
    })
  );

  app.get('/api-docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log(`📄 Documentación disponible en ${apiPublica || 'http://localhost:3000'}/api-docs`);
};
