import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { opinionSchema } from '../opinion/opinion.schema.js';

export function registrarOpiniones(registry: OpenAPIRegistry): void {
  registry.registerPath({
    "method": "post",
    "path": "/api/complejos/{id}/opiniones",
    "tags": [
      "Opiniones"
    ],
    "summary": "Publicar una opinión anónima",
    "description": "Endpoint público por regla de negocio: las opiniones son anónimas.\nNo requiere autenticación.\n",
    "parameters": [
      {
        "in": "path",
        "name": "id",
        "required": true,
        "schema": {
          "type": "integer"
        }
      }
    ],
    "responses": {
      "201": {
        "description": "Opinión creada",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Opinion"
            }
          }
        }
      },
      "400": {
        "$ref": "#/components/responses/ErrorValidacion"
      },
      "404": {
        "$ref": "#/components/responses/Error404"
      }
    },
    "request": {
      "body": {
        "required": true,
        "content": {
          "application/json": {
            "schema": opinionSchema
          }
        }
      }
    }
  });

}
