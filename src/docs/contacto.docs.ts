import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

export function registrarContacto(registry: OpenAPIRegistry): void {
  registry.registerPath({
    "method": "post",
    "path": "/api/contacto",
    "tags": [
      "Contacto"
    ],
    "summary": "Enviar una solicitud de contacto",
    "responses": {
      "200": {
        "description": "Solicitud enviada",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Mensaje"
            }
          }
        }
      },
      "400": {
        "$ref": "#/components/responses/Error400"
      },
      "500": {
        "$ref": "#/components/responses/Error500"
      }
    },
    "request": {
      "body": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/ContactoRequest"
            }
          }
        }
      }
    }
  });

}
