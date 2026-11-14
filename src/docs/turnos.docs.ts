import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '../config/zod.js';
import { turnoSchema } from '../turno/turno.schema.js';

// turnoSchema tiene un refine() que impide .partial(); se reconstruye desde el shape.
const turnoUpdateBody = z.object(turnoSchema.shape).partial();

const turnoEncargadoBody = z.object({
  cliente: z.object({
    nombre: z.string().min(1),
    apellido: z.string().min(1),
    telefono: z.string().optional(),
    email: z.string().email().optional(),
  }),
  turno: turnoSchema,
});

export function registrarTurnos(registry: OpenAPIRegistry): void {
  registry.registerPath({
    "method": "get",
    "path": "/api/turnos/complejo/{id}",
    "tags": [
      "Turnos"
    ],
    "summary": "Listar turnos de un complejo",
    "description": "Solo Dueño o Encargado.",
    "security": [
      {
        "bearerAuth": []
      }
    ],
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
        "description": "Turnos del complejo (puede ser vacío)",
        "content": {
          "application/json": {
            "schema": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/Turno"
              }
            }
          }
        }
      },
      "401": {
        "$ref": "#/components/responses/Error401"
      },
      "403": {
        "$ref": "#/components/responses/Error403"
      }
    }
  });

  registry.registerPath({
    "method": "get",
    "path": "/api/turnos",
    "tags": [
      "Turnos"
    ],
    "summary": "Listar turnos",
    "description": "Devuelve los turnos del usuario autenticado (según su clienteId).",
    "security": [
      {
        "bearerAuth": []
      }
    ],
    "responses": {
      "200": {
        "description": "Turnos del usuario (puede ser vacío)",
        "content": {
          "application/json": {
            "schema": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/Turno"
              }
            }
          }
        }
      },
      "401": {
        "$ref": "#/components/responses/Error401"
      }
    }
  });

  registry.registerPath({
    "method": "post",
    "path": "/api/turnos",
    "tags": [
      "Turnos"
    ],
    "summary": "Crear un turno",
    "description": "Solo Cliente. Valida complejo activo, fecha futura y ausencia de solapamientos.",
    "security": [
      {
        "bearerAuth": []
      }
    ],
    "responses": {
      "201": {
        "description": "Turno creado",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "message": {
                  "type": "string"
                },
                "turno": {
                  "$ref": "#/components/schemas/Turno"
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
            "schema": turnoSchema
          }
        }
      }
    }
  });

  registry.registerPath({
    "method": "get",
    "path": "/api/turnos/{id}",
    "tags": [
      "Turnos"
    ],
    "summary": "Obtener un turno por id",
    "security": [
      {
        "bearerAuth": []
      }
    ],
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
        "description": "Turno encontrado",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Turno"
            }
          }
        }
      },
      "401": {
        "$ref": "#/components/responses/Error401"
      },
      "404": {
        "$ref": "#/components/responses/Error404"
      }
    }
  });

  registry.registerPath({
    "method": "put",
    "path": "/api/turnos/{id}",
    "tags": [
      "Turnos"
    ],
    "summary": "Modificar un turno",
    "description": "Solo Administrador o Encargado.",
    "security": [
      {
        "bearerAuth": []
      }
    ],
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
        "description": "Turno modificado",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "message": {
                  "type": "string"
                },
                "turno": {
                  "$ref": "#/components/schemas/Turno"
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
            "schema": turnoUpdateBody
          }
        }
      }
    }
  });

  registry.registerPath({
    "method": "delete",
    "path": "/api/turnos/{id}",
    "tags": [
      "Turnos"
    ],
    "summary": "Eliminar un turno",
    "description": "Solo Administrador.",
    "security": [
      {
        "bearerAuth": []
      }
    ],
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
        "description": "Turno eliminado",
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

  registry.registerPath({
    "method": "post",
    "path": "/api/turnos/encargado",
    "tags": [
      "Turnos"
    ],
    "summary": "Agendar un turno como encargado",
    "description": "Permite reservar para un solicitante sin cuenta. El turno queda con\n`clienteId` nulo y los datos de `nombreSolicitante`/`apellidoSolicitante`.\n",
    "security": [
      {
        "bearerAuth": []
      }
    ],
    "responses": {
      "201": {
        "description": "Turno agendado",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "message": {
                  "type": "string"
                },
                "turno": {
                  "$ref": "#/components/schemas/Turno"
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
            "schema": turnoEncargadoBody
          }
        }
      }
    }
  });

  registry.registerPath({
    "method": "patch",
    "path": "/api/turnos/{id}/cancelar",
    "tags": [
      "Turnos"
    ],
    "summary": "Cancelar un turno",
    "description": "Solo Cliente. El turno debe estar en estado `Reservado`.",
    "security": [
      {
        "bearerAuth": []
      }
    ],
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
        "description": "Turno cancelado",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "message": {
                  "type": "string"
                },
                "turno": {
                  "$ref": "#/components/schemas/Turno"
                }
              }
            }
          }
        }
      },
      "400": {
        "$ref": "#/components/responses/Error400"
      },
      "401": {
        "$ref": "#/components/responses/Error401"
      },
      "403": {
        "$ref": "#/components/responses/Error403"
      },
      "404": {
        "$ref": "#/components/responses/Error404"
      },
      "409": {
        "$ref": "#/components/responses/Error409"
      }
    }
  });

}
