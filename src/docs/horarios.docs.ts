import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { horarioSchema } from '../horario/horario.schema.js';

export function registrarHorarios(registry: OpenAPIRegistry): void {
  registry.registerPath({
    "method": "get",
    "path": "/api/complejos/{id_complejo}/horarios",
    "tags": [
      "Horarios"
    ],
    "summary": "Listar horarios de un complejo",
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
        "description": "Horarios (puede ser vacío)",
        "content": {
          "application/json": {
            "schema": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/Horario"
              }
            }
          }
        }
      }
    }
  });

  registry.registerPath({
    "method": "post",
    "path": "/api/complejos/{id_complejo}/horarios",
    "tags": [
      "Horarios"
    ],
    "summary": "Crear un horario",
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
        "description": "Horario creado",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "message": {
                  "type": "string"
                },
                "horario": {
                  "$ref": "#/components/schemas/Horario"
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
            "schema": horarioSchema
          }
        }
      }
    }
  });

  registry.registerPath({
    "method": "get",
    "path": "/api/complejos/{id_complejo}/horarios/{num_dia}",
    "tags": [
      "Horarios"
    ],
    "summary": "Obtener el horario de un día",
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
        "name": "num_dia",
        "required": true,
        "schema": {
          "type": "integer",
          "minimum": 1,
          "maximum": 7
        }
      }
    ],
    "responses": {
      "200": {
        "description": "Horario encontrado",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Horario"
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
    "path": "/api/complejos/{id_complejo}/horarios/{num_dia}",
    "tags": [
      "Horarios"
    ],
    "summary": "Modificar un horario",
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
        "name": "num_dia",
        "required": true,
        "schema": {
          "type": "integer",
          "minimum": 1,
          "maximum": 7
        }
      }
    ],
    "responses": {
      "200": {
        "description": "Horario modificado",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "message": {
                  "type": "string"
                },
                "horario": {
                  "$ref": "#/components/schemas/Horario"
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
            "schema": horarioSchema.partial()
          }
        }
      }
    }
  });

  registry.registerPath({
    "method": "delete",
    "path": "/api/complejos/{id_complejo}/horarios/{num_dia}",
    "tags": [
      "Horarios"
    ],
    "summary": "Eliminar un horario",
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
        "name": "num_dia",
        "required": true,
        "schema": {
          "type": "integer",
          "minimum": 1,
          "maximum": 7
        }
      }
    ],
    "responses": {
      "200": {
        "description": "Horario eliminado",
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
