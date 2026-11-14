import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

export function registrarLocalidades(registry: OpenAPIRegistry): void {
  registry.registerPath({
    "method": "get",
    "path": "/api/localidad",
    "tags": [
      "Localidades"
    ],
    "summary": "Listar localidades",
    "responses": {
      "200": {
        "description": "Localidades (puede ser vacío)",
        "content": {
          "application/json": {
            "schema": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/Localidad"
              }
            }
          }
        }
      }
    }
  });

  registry.registerPath({
    "method": "get",
    "path": "/api/localidad/{id}",
    "tags": [
      "Localidades"
    ],
    "summary": "Obtener una localidad",
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
      "200": {
        "description": "Localidad encontrada",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Localidad"
            }
          }
        }
      },
      "404": {
        "$ref": "#/components/responses/Error404"
      }
    }
  });

}
