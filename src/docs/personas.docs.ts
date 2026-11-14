import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { personaFisicaSchema } from '../personaFisica/personaFisica.schema.js';
import { personaJuridicaSchema } from '../personaJuridica/personaJuridica.schema.js';

export function registrarPersonas(registry: OpenAPIRegistry): void {
  registry.registerPath({
    "method": "get",
    "path": "/api/personaJuridica",
    "tags": [
      "Personas"
    ],
    "summary": "Listar personas jurídicas",
    "description": "Solo Administrador.",
    "security": [
      {
        "bearerAuth": []
      }
    ],
    "responses": {
      "200": {
        "description": "Empresas (puede ser vacío)",
        "content": {
          "application/json": {
            "schema": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/PersonaJuridica"
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
    "path": "/api/personaJuridica",
    "tags": [
      "Personas"
    ],
    "summary": "Crear una persona jurídica",
    "description": "Solo Administrador.",
    "security": [
      {
        "bearerAuth": []
      }
    ],
    "responses": {
      "201": {
        "description": "Empresa creada",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "message": {
                  "type": "string"
                },
                "personaJuridica": {
                  "$ref": "#/components/schemas/PersonaJuridica"
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
            "schema": personaJuridicaSchema
          }
        }
      }
    }
  });

  registry.registerPath({
    "method": "get",
    "path": "/api/personaJuridica/{cuit}",
    "tags": [
      "Personas"
    ],
    "summary": "Obtener una persona jurídica por CUIT",
    "description": "Solo Administrador.",
    "security": [
      {
        "bearerAuth": []
      }
    ],
    "parameters": [
      {
        "in": "path",
        "name": "cuit",
        "required": true,
        "schema": {
          "type": "string"
        }
      }
    ],
    "responses": {
      "200": {
        "description": "Empresa encontrada",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/PersonaJuridica"
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
    "method": "put",
    "path": "/api/personaJuridica/{cuit}",
    "tags": [
      "Personas"
    ],
    "summary": "Modificar una persona jurídica",
    "description": "Solo Administrador.",
    "security": [
      {
        "bearerAuth": []
      }
    ],
    "parameters": [
      {
        "in": "path",
        "name": "cuit",
        "required": true,
        "schema": {
          "type": "string"
        }
      }
    ],
    "responses": {
      "200": {
        "description": "Empresa modificada",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "message": {
                  "type": "string"
                },
                "personaJuridica": {
                  "$ref": "#/components/schemas/PersonaJuridica"
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
            "schema": personaJuridicaSchema.partial()
          }
        }
      }
    }
  });

  registry.registerPath({
    "method": "delete",
    "path": "/api/personaJuridica/{cuit}",
    "tags": [
      "Personas"
    ],
    "summary": "Eliminar una persona jurídica",
    "description": "Solo Administrador.",
    "security": [
      {
        "bearerAuth": []
      }
    ],
    "parameters": [
      {
        "in": "path",
        "name": "cuit",
        "required": true,
        "schema": {
          "type": "string"
        }
      }
    ],
    "responses": {
      "200": {
        "description": "Empresa eliminada",
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
    "method": "get",
    "path": "/api/personaFisica",
    "tags": [
      "Personas"
    ],
    "summary": "Listar personas físicas",
    "description": "Solo Administrador.",
    "security": [
      {
        "bearerAuth": []
      }
    ],
    "responses": {
      "200": {
        "description": "Personas físicas (puede ser vacío)",
        "content": {
          "application/json": {
            "schema": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/PersonaFisica"
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
    "path": "/api/personaFisica",
    "tags": [
      "Personas"
    ],
    "summary": "Crear una persona física",
    "description": "Solo Administrador.",
    "security": [
      {
        "bearerAuth": []
      }
    ],
    "responses": {
      "201": {
        "description": "Persona creada",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "message": {
                  "type": "string"
                },
                "personaFisica": {
                  "$ref": "#/components/schemas/PersonaFisica"
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
            "schema": personaFisicaSchema
          }
        }
      }
    }
  });

  registry.registerPath({
    "method": "get",
    "path": "/api/personaFisica/{dni}",
    "tags": [
      "Personas"
    ],
    "summary": "Obtener una persona física por DNI",
    "description": "Solo Administrador.",
    "security": [
      {
        "bearerAuth": []
      }
    ],
    "parameters": [
      {
        "in": "path",
        "name": "dni",
        "required": true,
        "schema": {
          "type": "string"
        }
      }
    ],
    "responses": {
      "200": {
        "description": "Persona encontrada",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/PersonaFisica"
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
    "method": "put",
    "path": "/api/personaFisica/{dni}",
    "tags": [
      "Personas"
    ],
    "summary": "Modificar una persona física",
    "description": "Solo Administrador.",
    "security": [
      {
        "bearerAuth": []
      }
    ],
    "parameters": [
      {
        "in": "path",
        "name": "dni",
        "required": true,
        "schema": {
          "type": "string"
        }
      }
    ],
    "responses": {
      "200": {
        "description": "Persona modificada",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "message": {
                  "type": "string"
                },
                "personaFisica": {
                  "$ref": "#/components/schemas/PersonaFisica"
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
            "schema": personaFisicaSchema.partial()
          }
        }
      }
    }
  });

  registry.registerPath({
    "method": "delete",
    "path": "/api/personaFisica/{dni}",
    "tags": [
      "Personas"
    ],
    "summary": "Eliminar una persona física",
    "description": "Solo Administrador.",
    "security": [
      {
        "bearerAuth": []
      }
    ],
    "parameters": [
      {
        "in": "path",
        "name": "dni",
        "required": true,
        "schema": {
          "type": "string"
        }
      }
    ],
    "responses": {
      "200": {
        "description": "Persona eliminada",
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
