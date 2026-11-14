import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { canchaSchema } from '../cancha/cancha.schema.js';

export function registrarCanchas(registry: OpenAPIRegistry): void {
  registry.registerPath({
    "method": "get",
    "path": "/api/complejos/{id_complejo}/canchas",
    "tags": [
      "Canchas"
    ],
    "summary": "Listar canchas de un complejo",
    "parameters": [
      {
        "in": "path",
        "name": "id_complejo",
        "required": true,
        "schema": {
          "type": "integer"
        }
      }
    ],
    "responses": {
      "200": {
        "description": "Canchas (puede ser vacío)",
        "content": {
          "application/json": {
            "schema": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/Cancha"
              }
            }
          }
        }
      }
    }
  });

  registry.registerPath({
    "method": "post",
    "path": "/api/complejos/{id_complejo}/canchas",
    "tags": [
      "Canchas"
    ],
    "summary": "Crear una cancha",
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
      }
    ],
    "responses": {
      "201": {
        "description": "Cancha creada",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "message": {
                  "type": "string"
                },
                "cancha": {
                  "$ref": "#/components/schemas/Cancha"
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
            "schema": canchaSchema
          }
        }
      }
    }
  });

  registry.registerPath({
    "method": "get",
    "path": "/api/complejos/{id_complejo}/canchas/{nro}",
    "tags": [
      "Canchas"
    ],
    "summary": "Obtener una cancha",
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
        "name": "nro",
        "required": true,
        "schema": {
          "type": "integer"
        }
      }
    ],
    "responses": {
      "200": {
        "description": "Cancha encontrada",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Cancha"
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
    "method": "put",
    "path": "/api/complejos/{id_complejo}/canchas/{nro}",
    "tags": [
      "Canchas"
    ],
    "summary": "Modificar una cancha",
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
        "name": "nro",
        "required": true,
        "schema": {
          "type": "integer"
        }
      }
    ],
    "responses": {
      "200": {
        "description": "Cancha modificada",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "message": {
                  "type": "string"
                },
                "cancha": {
                  "$ref": "#/components/schemas/CanchaInput"
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
      "404": {
        "$ref": "#/components/responses/Error404"
      }
    },
    "request": {
      "body": {
        "required": true,
        "content": {
          "application/json": {
            "schema": canchaSchema.partial()
          }
        }
      }
    }
  });

  registry.registerPath({
    "method": "delete",
    "path": "/api/complejos/{id_complejo}/canchas/{nro}",
    "tags": [
      "Canchas"
    ],
    "summary": "Eliminar una cancha",
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
        "name": "nro",
        "required": true,
        "schema": {
          "type": "integer"
        }
      }
    ],
    "responses": {
      "200": {
        "description": "Cancha eliminada",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Mensaje"
            }
          }
        }
      },
      "401": {
        "$ref": "#/components/responses/Error401"
      },
      "403": {
        "$ref": "#/components/responses/Error403"
      },
      "404": {
        "$ref": "#/components/responses/Error404"
      }
    }
  });

}
