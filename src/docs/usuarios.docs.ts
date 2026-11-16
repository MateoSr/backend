import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '../config/zod.js';
import { userSchema, userResponseSchema, userUpdateBodySchema } from '../usuario/users.schema.js';

export function registrarUsuarios(registry: OpenAPIRegistry): void {
  registry.registerPath({
    "method": "get",
    "path": "/api/users/perfil",
    "tags": [
      "Usuarios"
    ],
    "summary": "Obtener el perfil del usuario autenticado",
    "security": [
      {
        "bearerAuth": []
      }
    ],
    "responses": {
      "200": {
        "description": "Perfil del usuario",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Perfil"
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
    "path": "/api/users/perfil",
    "tags": [
      "Usuarios"
    ],
    "summary": "Modificar el perfil propio",
    "security": [
      {
        "bearerAuth": []
      }
    ],
    "responses": {
      "200": {
        "description": "Perfil modificado",
        "content": {
          "application/json": {
            "schema": z.object({ message: z.string(), user: userResponseSchema })
          }
        }
      },
      "400": {
        "$ref": "#/components/responses/ErrorValidacion"
      },
      "401": {
        "$ref": "#/components/responses/Error401"
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
            "schema": userUpdateBodySchema
          }
        }
      }
    }
  });

  registry.registerPath({
    "method": "get",
    "path": "/api/users/clientes",
    "tags": [
      "Usuarios"
    ],
    "summary": "Listar clientes",
    "description": "Solo disponible para el rol Encargado.",
    "security": [
      {
        "bearerAuth": []
      }
    ],
    "responses": {
      "200": {
        "description": "Lista de clientes (puede ser vacía)",
        "content": {
          "application/json": {
            "schema": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/ClienteResumen"
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
    "path": "/api/users",
    "tags": [
      "Usuarios"
    ],
    "summary": "Listar todos los usuarios",
    "description": "Solo Administrador.",
    "security": [
      {
        "bearerAuth": []
      }
    ],
    "responses": {
      "200": {
        "description": "Lista de usuarios (puede ser vacía)",
        "content": {
          "application/json": {
            "schema": z.array(userResponseSchema)
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
    "method": "post",
    "path": "/api/users",
    "tags": [
      "Usuarios"
    ],
    "summary": "Crear un usuario",
    "description": "Solo Administrador.",
    "security": [
      {
        "bearerAuth": []
      }
    ],
    "responses": {
      "201": {
        "description": "Usuario creado",
        "content": {
          "application/json": {
            "schema": z.object({ message: z.string(), user: userResponseSchema })
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
            "schema": userSchema
          }
        }
      }
    }
  });

  registry.registerPath({
    "method": "get",
    "path": "/api/users/{id}",
    "tags": [
      "Usuarios"
    ],
    "summary": "Obtener un usuario por id",
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
        "description": "Usuario encontrado",
        "content": {
          "application/json": {
            "schema": userResponseSchema
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
    "method": "put",
    "path": "/api/users/{id}",
    "tags": [
      "Usuarios"
    ],
    "summary": "Modificar un usuario",
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
        "description": "Usuario modificado",
        "content": {
          "application/json": {
            "schema": z.object({ message: z.string(), user: userResponseSchema })
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
            "schema": userUpdateBodySchema
          }
        }
      }
    }
  });

  registry.registerPath({
    "method": "delete",
    "path": "/api/users/{id}",
    "tags": [
      "Usuarios"
    ],
    "summary": "Eliminar un usuario",
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
        "description": "Usuario eliminado",
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
