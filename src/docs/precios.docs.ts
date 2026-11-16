import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { precioBodySchema } from '../precio/precio.schema.js';

export function registrarPrecios(registry: OpenAPIRegistry): void {
  registry.registerPath({
    "method": "get",
    "path": "/api/complejos/{id_complejo}/canchas/{nro_cancha}/precios",
    "tags": [
      "Precios"
    ],
    "summary": "Listar precios de una cancha",
    "parameters": [
      {
        "in": "path",
        "name": "id_complejo",
        "required": true,
        "schema": {
          "type": "integer"
        }
      },
      {
        "in": "path",
        "name": "nro_cancha",
        "required": true,
        "schema": {
          "type": "integer"
        }
      }
    ],
    "responses": {
      "200": {
        "description": "Precios (puede ser vacío)",
        "content": {
          "application/json": {
            "schema": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/Precio"
              }
            }
          }
        }
      }
    }
  });

  registry.registerPath({
    "method": "post",
    "path": "/api/complejos/{id_complejo}/canchas/{nro_cancha}/precios",
    "tags": [
      "Precios"
    ],
    "summary": "Crear un precio para una cancha",
    "description": "Solo Dueño.",
    "security": [
      {
        "bearerAuth": []
      }
    ],
    "parameters": [
      {
        "in": "path",
        "name": "id_complejo",
        "required": true,
        "schema": {
          "type": "integer"
        }
      },
      {
        "in": "path",
        "name": "nro_cancha",
        "required": true,
        "schema": {
          "type": "integer"
        }
      }
    ],
    "responses": {
      "201": {
        "description": "Precio creado",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "message": {
                  "type": "string"
                },
                "precio": {
                  "$ref": "#/components/schemas/Precio"
                }
              }
            }
          }
        }
      },
      "400": {
        "$ref": "#/components/responses/ErrorValidacion"
      },
      "401": {
        "$ref": "#/components/responses/Error401"
      },
      "403": {
        "$ref": "#/components/responses/Error403"
      },
      "409": {
        "$ref": "#/components/responses/Error409"
      }
    },
    "request": {
      "body": {
        "required": true,
        "content": {
          "application/json": {
            "schema": precioBodySchema
          }
        }
      }
    }
  });

  registry.registerPath({
    "method": "get",
    "path": "/api/complejos/{id_complejo}/canchas/{nro_cancha}/precios/{fechaDesde}",
    "tags": [
      "Precios"
    ],
    "summary": "Obtener un precio por fecha de vigencia",
    "parameters": [
      {
        "in": "path",
        "name": "id_complejo",
        "required": true,
        "schema": {
          "type": "integer"
        }
      },
      {
        "in": "path",
        "name": "nro_cancha",
        "required": true,
        "schema": {
          "type": "integer"
        }
      },
      {
        "in": "path",
        "name": "fechaDesde",
        "required": true,
        "schema": {
          "type": "string",
          "format": "date"
        }
      }
    ],
    "responses": {
      "200": {
        "description": "Precio encontrado",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Precio"
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
