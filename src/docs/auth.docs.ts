import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '../config/zod.js';
import { userSchema, userResponseSchema } from '../usuario/users.schema.js';
import { personaFisicaSchema } from '../personaFisica/personaFisica.schema.js';

// El controller arma este body a partir de userSchema + personaFisicaSchema.
const registroBody = userSchema
  .pick({ email: true, password: true, telefono: true })
  .extend({
    dni: personaFisicaSchema.shape.dni,
    nombre: personaFisicaSchema.shape.nombre,
    apellido: personaFisicaSchema.shape.apellido,
    fechaNacimiento: personaFisicaSchema.shape.fechaNacimiento,
  });

export function registrarAuth(registry: OpenAPIRegistry): void {
  registry.registerPath({
    "method": "post",
    "path": "/api/login",
    "tags": [
      "Auth"
    ],
    "summary": "Iniciar sesión",
    "description": "Devuelve un access token y un refresh token. El refresh vence tras 60 minutos de inactividad.",
    "responses": {
      "200": {
        "description": "Login exitoso",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/LoginResponse"
            }
          }
        }
      },
      "400": {
        "$ref": "#/components/responses/Error400"
      },
      "401": {
        "$ref": "#/components/responses/Error401"
      }
    },
    "request": {
      "body": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/LoginRequest"
            }
          }
        }
      }
    }
  });

  registry.registerPath({
    "method": "post",
    "path": "/api/refresh",
    "tags": [
      "Auth"
    ],
    "summary": "Renovar tokens",
    "description": "Rota el par de tokens. Si el refresh venció por inactividad responde 401.",
    "responses": {
      "200": {
        "description": "Sesión renovada",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "message": {
                  "type": "string",
                  "example": "Sesión renovada"
                },
                "token": {
                  "$ref": "#/components/schemas/TokensSesion"
                }
              }
            }
          }
        }
      },
      "401": {
        "$ref": "#/components/responses/Error401"
      }
    },
    "request": {
      "body": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/RefreshRequest"
            }
          }
        }
      }
    }
  });

  registry.registerPath({
    "method": "post",
    "path": "/api/register",
    "tags": [
      "Auth"
    ],
    "summary": "Registrar un cliente",
    "description": "Crea la persona física (si no existe) y el usuario con rol Cliente.",
    "responses": {
      "201": {
        "description": "Usuario registrado",
        "content": {
          "application/json": {
            "schema": z.object({ message: z.string(), user: userResponseSchema })
          }
        }
      },
      "400": {
        "$ref": "#/components/responses/ErrorValidacion"
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
            "schema": registroBody
          }
        }
      }
    }
  });

  registry.registerPath({
    "method": "post",
    "path": "/api/forgot",
    "tags": [
      "Auth"
    ],
    "summary": "Solicitar recuperación de contraseña",
    "responses": {
      "200": {
        "description": "Correo enviado",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Mensaje"
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
    },
    "request": {
      "body": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "required": [
                "email"
              ],
              "properties": {
                "email": {
                  "type": "string",
                  "format": "email"
                }
              }
            }
          }
        }
      }
    }
  });

  registry.registerPath({
    "method": "patch",
    "path": "/api/reset-password",
    "tags": [
      "Auth"
    ],
    "summary": "Restablecer contraseña con token",
    "responses": {
      "200": {
        "description": "Contraseña actualizada",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Mensaje"
            }
          }
        }
      },
      "400": {
        "$ref": "#/components/responses/Error400"
      }
    },
    "request": {
      "body": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "required": [
                "token",
                "password"
              ],
              "properties": {
                "token": {
                  "type": "string"
                },
                "password": {
                  "type": "string",
                  "minLength": 8
                }
              }
            }
          }
        }
      }
    }
  });

}
