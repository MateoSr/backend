import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

export function registrarCatalogos(registry: OpenAPIRegistry): void {
  registry.registerPath({
    "method": "get",
    "path": "/api/tipoUsuario",
    "tags": [
      "Catálogos"
    ],
    "summary": "Listar tipos de usuario",
    "responses": {
      "200": {
        "description": "Tipos de usuario (puede ser vacío)",
        "content": {
          "application/json": {
            "schema": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/TipoUsuario"
              }
            }
          }
        }
      }
    }
  });

  registry.registerPath({
    "method": "get",
    "path": "/api/tipoUsuario/{id}",
    "tags": [
      "Catálogos"
    ],
    "summary": "Obtener un tipo de usuario",
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
        "description": "Tipo de usuario encontrado",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/TipoUsuario"
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
    "path": "/api/tipoTurno",
    "tags": [
      "Catálogos"
    ],
    "summary": "Listar tipos de turno",
    "responses": {
      "200": {
        "description": "Tipos de turno (puede ser vacío)",
        "content": {
          "application/json": {
            "schema": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/TipoTurno"
              }
            }
          }
        }
      }
    }
  });

  registry.registerPath({
    "method": "get",
    "path": "/api/tipoTurno/{id}",
    "tags": [
      "Catálogos"
    ],
    "summary": "Obtener un tipo de turno",
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
        "description": "Tipo de turno encontrado",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/TipoTurno"
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
    "path": "/api/tipoCancha",
    "tags": [
      "Catálogos"
    ],
    "summary": "Listar tipos de cancha",
    "responses": {
      "200": {
        "description": "Tipos de cancha (puede ser vacío)",
        "content": {
          "application/json": {
            "schema": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/TipoCancha"
              }
            }
          }
        }
      }
    }
  });

  registry.registerPath({
    "method": "get",
    "path": "/api/tipoCancha/{id}",
    "tags": [
      "Catálogos"
    ],
    "summary": "Obtener un tipo de cancha",
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
        "description": "Tipo de cancha encontrado",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/TipoCancha"
            }
          }
        }
      },
      "400": {
        "$ref": "#/components/responses/Error400"
      },
      "404": {
        "$ref": "#/components/responses/Error404"
      }
    }
  });

}
