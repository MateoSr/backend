import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

export function registrarProvincias(registry: OpenAPIRegistry): void {
  registry.registerPath({
    "method": "get",
    "path": "/api/provincias",
    "tags": [
      "Provincias"
    ],
    "summary": "Listar provincias",
    "responses": {
      "200": {
        "description": "Provincias (puede ser vacío)",
        "content": {
          "application/json": {
            "schema": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/Provincia"
              }
            }
          }
        }
      }
    }
  });

  registry.registerPath({
    "method": "get",
    "path": "/api/provincias/{id}",
    "tags": [
      "Provincias"
    ],
    "summary": "Obtener una provincia",
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
        "description": "Provincia encontrada",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Provincia"
            }
          }
        }
      },
      "404": {
        "$ref": "#/components/responses/Error404"
      }
    }
  });

  registry.registerPath({
    "method": "get",
    "path": "/api/provincias/{id}/localidades",
    "tags": [
      "Provincias"
    ],
    "summary": "Listar localidades de una provincia",
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

}
