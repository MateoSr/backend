import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { complejoSchema } from '../complejo/complejos.schema.js';

export function registrarComplejos(registry: OpenAPIRegistry): void {
  registry.registerPath({
    "method": "get",
    "path": "/api/complejos/busqueda",
    "tags": [
      "Complejos"
    ],
    "summary": "Buscar complejos disponibles",
    "description": "Filtra por ciudad, deporte, fecha, hora y rango de precio. Resultado paginado.",
    "parameters": [
      {
        "in": "query",
        "name": "ciudad",
        "schema": {
          "type": "string"
        }
      },
      {
        "in": "query",
        "name": "deporte",
        "schema": {
          "type": "string"
        }
      },
      {
        "in": "query",
        "name": "fecha",
        "schema": {
          "type": "string",
          "format": "date"
        }
      },
      {
        "in": "query",
        "name": "hora",
        "schema": {
          "type": "string",
          "example": "20:00"
        }
      },
      {
        "in": "query",
        "name": "sort",
        "schema": {
          "type": "string",
          "enum": [
            "relevantes",
            "precio_asc",
            "precio_desc"
          ],
          "default": "relevantes"
        }
      },
      {
        "in": "query",
        "name": "min",
        "schema": {
          "type": "number"
        }
      },
      {
        "in": "query",
        "name": "max",
        "schema": {
          "type": "number"
        }
      },
      {
        "in": "query",
        "name": "page",
        "schema": {
          "type": "integer",
          "minimum": 1,
          "default": 1
        }
      },
      {
        "in": "query",
        "name": "limit",
        "schema": {
          "type": "integer",
          "minimum": 1,
          "maximum": 50,
          "default": 12
        }
      }
    ],
    "responses": {
      "200": {
        "description": "Resultado de la búsqueda",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "total": {
                  "type": "integer"
                },
                "page": {
                  "type": "integer"
                },
                "limit": {
                  "type": "integer"
                },
                "totalPages": {
                  "type": "integer"
                },
                "data": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/ComplejoBusqueda"
                  }
                }
              }
            }
          }
        }
      },
      "400": {
        "$ref": "#/components/responses/Error400"
      }
    }
  });

  registry.registerPath({
    "method": "get",
    "path": "/api/complejos/encargado",
    "tags": [
      "Complejos"
    ],
    "summary": "Obtener el complejo del encargado autenticado",
    "description": "Solo Encargado.",
    "security": [
      {
        "bearerAuth": []
      }
    ],
    "responses": {
      "200": {
        "description": "Complejo asignado",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Complejo"
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
    "method": "get",
    "path": "/api/complejos/dueno",
    "tags": [
      "Complejos"
    ],
    "summary": "Obtener el complejo del dueño autenticado",
    "description": "Solo Dueño.",
    "security": [
      {
        "bearerAuth": []
      }
    ],
    "responses": {
      "200": {
        "description": "Complejo asignado",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Complejo"
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
    "method": "get",
    "path": "/api/complejos",
    "tags": [
      "Complejos"
    ],
    "summary": "Listar todos los complejos",
    "description": "Solo Administrador.",
    "security": [
      {
        "bearerAuth": []
      }
    ],
    "responses": {
      "200": {
        "description": "Complejos (puede ser vacío)",
        "content": {
          "application/json": {
            "schema": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/Complejo"
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
    "method": "post",
    "path": "/api/complejos",
    "tags": [
      "Complejos"
    ],
    "summary": "Crear un complejo",
    "description": "Solo Administrador. Admite imagen en base64 (JPG/PNG/WEBP hasta 2MB).",
    "security": [
      {
        "bearerAuth": []
      }
    ],
    "responses": {
      "201": {
        "description": "Complejo creado",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "message": {
                  "type": "string"
                },
                "complejo": {
                  "$ref": "#/components/schemas/Complejo"
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
      },
      "502": {
        "$ref": "#/components/responses/Error502"
      }
    },
    "request": {
      "body": {
        "required": true,
        "content": {
          "application/json": {
            "schema": complejoSchema
          }
        }
      }
    }
  });

  registry.registerPath({
    "method": "get",
    "path": "/api/complejos/{id}/disponibilidad",
    "tags": [
      "Complejos"
    ],
    "summary": "Consultar disponibilidad de un complejo",
    "parameters": [
      {
        "in": "path",
        "name": "id",
        "required": true,
        "schema": {
          "type": "integer"
        }
      },
      {
        "in": "query",
        "name": "fecha",
        "schema": {
          "type": "string",
          "format": "date"
        },
        "description": "Por defecto, la fecha actual en Argentina."
      }
    ],
    "responses": {
      "200": {
        "description": "Disponibilidad",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Disponibilidad"
            }
          }
        }
      },
      "400": {
        "$ref": "#/components/responses/Error400"
      }
    }
  });

  registry.registerPath({
    "method": "get",
    "path": "/api/complejos/{id}",
    "tags": [
      "Complejos"
    ],
    "summary": "Obtener un complejo por id",
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
        "description": "Complejo encontrado",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Complejo"
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
    "path": "/api/complejos/{id}",
    "tags": [
      "Complejos"
    ],
    "summary": "Modificar un complejo",
    "description": "Solo Dueño.",
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
        "description": "Complejo modificado",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "message": {
                  "type": "string"
                },
                "complejo": {
                  "$ref": "#/components/schemas/ComplejoInput"
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
            "schema": complejoSchema.partial()
          }
        }
      }
    }
  });

  registry.registerPath({
    "method": "delete",
    "path": "/api/complejos/{id}",
    "tags": [
      "Complejos"
    ],
    "summary": "Eliminar un complejo",
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
        "description": "Complejo eliminado",
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
      },
      "409": {
        "$ref": "#/components/responses/Error409"
      }
    }
  });

  registry.registerPath({
    "method": "patch",
    "path": "/api/complejos/{id}/baja",
    "tags": [
      "Complejos"
    ],
    "summary": "Dar de baja un complejo",
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
        "description": "Complejo dado de baja",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "message": {
                  "type": "string"
                },
                "complejo": {
                  "$ref": "#/components/schemas/Complejo"
                }
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
      },
      "404": {
        "$ref": "#/components/responses/Error404"
      }
    }
  });

}
