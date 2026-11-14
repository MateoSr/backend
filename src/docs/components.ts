import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

// Componentes OpenAPI que ya existian y se conservan tal cual.
export function registrarComponentes(registry: OpenAPIRegistry): void {
  registry.registerComponent('securitySchemes', 'bearerAuth', {
      "type": "http",
      "scheme": "bearer",
      "bearerFormat": "JWT",
      "description": "Access token obtenido en `POST /api/login`."
    });
  registry.registerComponent('schemas', 'ErrorResponse', {
      "type": "object",
      "required": [
        "message",
        "code"
      ],
      "properties": {
        "message": {
          "type": "string",
          "example": "No se encontró el complejo"
        },
        "code": {
          "type": "string",
          "example": "NO_ENCONTRADO",
          "description": "Código estable: DATOS_INVALIDOS, NO_AUTORIZADO, PROHIBIDO, NO_ENCONTRADO, CONFLICTO, ERROR_EXTERNO, ERROR_INTERNO, etc."
        },
        "detalles": {
          "description": "Solo en errores de validación (issues de Zod).",
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": true
          }
        }
      }
    });
  registry.registerComponent('schemas', 'LoginRequest', {
      "type": "object",
      "required": [
        "email",
        "password"
      ],
      "properties": {
        "email": {
          "type": "string",
          "format": "email",
          "example": "cliente@turnolibre.com"
        },
        "password": {
          "type": "string",
          "minLength": 8,
          "example": "password123"
        }
      }
    });
  registry.registerComponent('schemas', 'TokensSesion', {
      "type": "object",
      "properties": {
        "token": {
          "type": "string",
          "description": "Access token (JWT)."
        },
        "refreshToken": {
          "type": "string",
          "description": "Refresh token; vence tras 60 minutos de inactividad."
        }
      }
    });
  registry.registerComponent('schemas', 'LoginResponse', {
      "type": "object",
      "properties": {
        "message": {
          "type": "string",
          "example": "Login exitoso"
        },
        "token": {
          "$ref": "#/components/schemas/TokensSesion"
        }
      }
    });
  registry.registerComponent('schemas', 'RefreshRequest', {
      "type": "object",
      "required": [
        "refreshToken"
      ],
      "properties": {
        "refreshToken": {
          "type": "string"
        }
      }
    });
  registry.registerComponent('schemas', 'RegisterRequest', {
      "type": "object",
      "required": [
        "email",
        "password",
        "telefono",
        "dni",
        "nombre",
        "apellido",
        "fechaNacimiento"
      ],
      "properties": {
        "email": {
          "type": "string",
          "format": "email"
        },
        "password": {
          "type": "string",
          "minLength": 8
        },
        "telefono": {
          "type": "string"
        },
        "dni": {
          "type": "string",
          "minLength": 7
        },
        "nombre": {
          "type": "string"
        },
        "apellido": {
          "type": "string"
        },
        "fechaNacimiento": {
          "type": "string",
          "format": "date"
        }
      }
    });
  registry.registerComponent('schemas', 'Usuario', {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer",
          "example": 1
        },
        "email": {
          "type": "string",
          "format": "email"
        },
        "telefono": {
          "type": "string",
          "nullable": true
        },
        "tipoUsuarioId": {
          "type": "integer",
          "example": 3
        },
        "personaFisicaDni": {
          "type": "string",
          "nullable": true
        },
        "personaJuridicaCuit": {
          "type": "string",
          "nullable": true
        },
        "tipoUsuario": {
          "$ref": "#/components/schemas/TipoUsuario"
        }
      }
    });
  registry.registerComponent('schemas', 'UsuarioCreate', {
      "type": "object",
      "required": [
        "email",
        "telefono",
        "password",
        "tipoUsuarioId"
      ],
      "properties": {
        "email": {
          "type": "string",
          "format": "email"
        },
        "telefono": {
          "type": "string"
        },
        "password": {
          "type": "string",
          "minLength": 8
        },
        "tipoUsuarioId": {
          "type": "integer"
        },
        "personaFisicaDni": {
          "type": "string",
          "nullable": true
        },
        "personaJuridicaCuit": {
          "type": "string",
          "nullable": true
        }
      }
    });
  registry.registerComponent('schemas', 'UsuarioUpdate', {
      "type": "object",
      "properties": {
        "email": {
          "type": "string",
          "format": "email"
        },
        "telefono": {
          "type": "string"
        },
        "nombre": {
          "type": "string"
        },
        "apellido": {
          "type": "string"
        },
        "fechaNacimiento": {
          "type": "string",
          "format": "date"
        }
      }
    });
  registry.registerComponent('schemas', 'Perfil', {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer"
        },
        "nombre": {
          "type": "string"
        },
        "apellido": {
          "type": "string"
        },
        "email": {
          "type": "string",
          "format": "email"
        },
        "telefono": {
          "type": "string",
          "nullable": true
        },
        "fechaNacimiento": {
          "type": "string",
          "example": "1990-05-20"
        }
      }
    });
  registry.registerComponent('schemas', 'ClienteResumen', {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer"
        },
        "email": {
          "type": "string",
          "format": "email"
        },
        "telefono": {
          "type": "string",
          "nullable": true
        },
        "personaFisica": {
          "type": "object",
          "nullable": true,
          "properties": {
            "nombre": {
              "type": "string"
            },
            "apellido": {
              "type": "string"
            }
          }
        },
        "personaJuridica": {
          "type": "object",
          "nullable": true,
          "properties": {
            "razonSocial": {
              "type": "string"
            }
          }
        }
      }
    });
  registry.registerComponent('schemas', 'Complejo', {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer"
        },
        "nombre": {
          "type": "string"
        },
        "direccion": {
          "type": "string"
        },
        "telefono": {
          "type": "string",
          "nullable": true
        },
        "instagram": {
          "type": "string",
          "nullable": true
        },
        "imagenUrl": {
          "type": "string",
          "nullable": true
        },
        "estado": {
          "type": "string",
          "example": "Activo"
        },
        "duenoId": {
          "type": "integer"
        },
        "localidadId": {
          "type": "integer"
        },
        "encargadoId": {
          "type": "integer"
        }
      }
    });
  registry.registerComponent('schemas', 'ComplejoInput', {
      "type": "object",
      "required": [
        "nombre",
        "direccion",
        "duenoId",
        "localidadId",
        "encargadoId"
      ],
      "properties": {
        "nombre": {
          "type": "string"
        },
        "direccion": {
          "type": "string"
        },
        "telefono": {
          "type": "string",
          "nullable": true
        },
        "instagram": {
          "type": "string",
          "nullable": true
        },
        "imagenUrl": {
          "type": "string",
          "nullable": true
        },
        "imagenBase64": {
          "type": "string",
          "description": "Data URI de imagen JPG/PNG/WEBP de hasta 2MB."
        },
        "duenoId": {
          "type": "integer"
        },
        "localidadId": {
          "type": "integer"
        },
        "encargadoId": {
          "type": "integer"
        }
      }
    });
  registry.registerComponent('schemas', 'ComplejoBusqueda', {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer"
        },
        "nombre": {
          "type": "string"
        },
        "direccion": {
          "type": "string"
        },
        "imagenUrl": {
          "type": "string",
          "nullable": true
        },
        "localidad": {
          "type": "object",
          "additionalProperties": true
        }
      }
    });
  registry.registerComponent('schemas', 'Disponibilidad', {
      "type": "object",
      "description": "Disponibilidad del complejo para la fecha consultada.",
      "additionalProperties": true,
      "example": {
        "fecha": "2026-11-14",
        "canchas": [
          {
            "nro": 1,
            "tipoCancha": "Fútbol 5",
            "turnos": [
              {
                "horaInicio": "20:00",
                "horaFin": "21:00",
                "disponible": true
              }
            ]
          }
        ]
      }
    });
  registry.registerComponent('schemas', 'Horario', {
      "type": "object",
      "properties": {
        "complejoId": {
          "type": "integer"
        },
        "nroDia": {
          "type": "integer",
          "minimum": 1,
          "maximum": 7,
          "example": 1
        },
        "horaApertura": {
          "type": "string",
          "example": "08:00"
        },
        "horaCierre": {
          "type": "string",
          "example": "23:00"
        }
      }
    });
  registry.registerComponent('schemas', 'Cancha', {
      "type": "object",
      "properties": {
        "nro": {
          "type": "integer"
        },
        "tipoCanchaId": {
          "type": "integer"
        },
        "estado": {
          "type": "string",
          "example": "Activa"
        },
        "tipoCancha": {
          "$ref": "#/components/schemas/TipoCancha"
        }
      }
    });
  registry.registerComponent('schemas', 'CanchaInput', {
      "type": "object",
      "required": [
        "nro",
        "tipoCanchaId",
        "estado"
      ],
      "properties": {
        "nro": {
          "type": "integer",
          "minimum": 1
        },
        "tipoCanchaId": {
          "type": "integer"
        },
        "estado": {
          "type": "string",
          "example": "Activa"
        }
      }
    });
  registry.registerComponent('schemas', 'Precio', {
      "type": "object",
      "properties": {
        "id_complejo": {
          "type": "integer"
        },
        "nro_cancha": {
          "type": "integer"
        },
        "precioBase": {
          "type": "number",
          "example": 15000
        },
        "precioAdicional": {
          "type": "number",
          "example": 2000
        },
        "precioSena": {
          "type": "number",
          "example": 5000
        },
        "fechaDesde": {
          "type": "string",
          "format": "date"
        }
      }
    });
  registry.registerComponent('schemas', 'PrecioInput', {
      "type": "object",
      "required": [
        "precioBase",
        "precioAdicional",
        "precioSena",
        "fecha"
      ],
      "properties": {
        "precioBase": {
          "type": "number",
          "minimum": 1
        },
        "precioAdicional": {
          "type": "number",
          "minimum": 1
        },
        "precioSena": {
          "type": "number",
          "minimum": 1
        },
        "fecha": {
          "type": "string",
          "format": "date"
        }
      }
    });
  registry.registerComponent('schemas', 'OpinionInput', {
      "type": "object",
      "required": [
        "descripcion"
      ],
      "properties": {
        "descripcion": {
          "type": "string",
          "minLength": 1,
          "maxLength": 500
        }
      }
    });
  registry.registerComponent('schemas', 'Opinion', {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer"
        },
        "descripcion": {
          "type": "string"
        },
        "complejoId": {
          "type": "integer"
        },
        "fecha": {
          "type": "string",
          "format": "date-time"
        }
      }
    });
  registry.registerComponent('schemas', 'Turno', {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer"
        },
        "fechaInicio": {
          "type": "string",
          "format": "date-time"
        },
        "fechaFin": {
          "type": "string",
          "format": "date-time"
        },
        "estado": {
          "type": "string",
          "example": "Reservado"
        },
        "clienteId": {
          "type": "integer",
          "nullable": true
        },
        "tipoTurnoId": {
          "type": "integer"
        },
        "complejoId": {
          "type": "integer"
        },
        "canchaNro": {
          "type": "integer"
        },
        "nombreSolicitante": {
          "type": "string",
          "nullable": true
        },
        "apellidoSolicitante": {
          "type": "string",
          "nullable": true
        },
        "motivoCancelacion": {
          "type": "string",
          "nullable": true
        }
      }
    });
  registry.registerComponent('schemas', 'TurnoInput', {
      "type": "object",
      "required": [
        "tipoTurnoId",
        "complejoId",
        "canchaNro",
        "fechaInicio",
        "fechaFin",
        "estado"
      ],
      "properties": {
        "clienteId": {
          "type": "integer",
          "nullable": true
        },
        "tipoTurnoId": {
          "type": "integer"
        },
        "complejoId": {
          "type": "integer"
        },
        "canchaNro": {
          "type": "integer"
        },
        "fechaInicio": {
          "type": "string",
          "format": "date-time"
        },
        "fechaFin": {
          "type": "string",
          "format": "date-time"
        },
        "estado": {
          "type": "string",
          "example": "Reservado"
        },
        "motivoCancelacion": {
          "type": "string",
          "nullable": true
        },
        "nombreSolicitante": {
          "type": "string",
          "nullable": true
        },
        "apellidoSolicitante": {
          "type": "string",
          "nullable": true
        }
      }
    });
  registry.registerComponent('schemas', 'TurnoEncargadoInput', {
      "type": "object",
      "required": [
        "cliente",
        "turno"
      ],
      "properties": {
        "cliente": {
          "type": "object",
          "required": [
            "nombre",
            "apellido"
          ],
          "properties": {
            "nombre": {
              "type": "string"
            },
            "apellido": {
              "type": "string"
            },
            "telefono": {
              "type": "string"
            },
            "email": {
              "type": "string",
              "format": "email"
            }
          }
        },
        "turno": {
          "$ref": "#/components/schemas/TurnoInput"
        }
      }
    });
  registry.registerComponent('schemas', 'CrearOrdenRequest', {
      "type": "object",
      "description": "Se puede enviar `fechaInicio` ISO, o bien `fecha` + `horaInicio` en hora de Argentina.",
      "required": [
        "complejoId",
        "canchaNro"
      ],
      "properties": {
        "complejoId": {
          "type": "integer"
        },
        "canchaNro": {
          "type": "integer"
        },
        "fechaInicio": {
          "type": "string",
          "format": "date-time"
        },
        "fecha": {
          "type": "string",
          "format": "date"
        },
        "horaInicio": {
          "type": "string",
          "example": "20:00"
        },
        "duracion": {
          "type": "integer",
          "default": 60,
          "description": "Duración en minutos."
        }
      }
    });
  registry.registerComponent('schemas', 'CrearOrdenResponse', {
      "type": "object",
      "properties": {
        "checkoutUrl": {
          "type": "string",
          "format": "uri"
        },
        "externalReference": {
          "type": "string"
        },
        "ordenId": {
          "type": "integer"
        }
      }
    });
  registry.registerComponent('schemas', 'EstadoOrden', {
      "type": "object",
      "properties": {
        "estado": {
          "type": "string",
          "example": "aprobada"
        },
        "monto": {
          "type": "number",
          "example": 5000
        },
        "turnoId": {
          "type": "integer",
          "nullable": true
        },
        "motivoRechazo": {
          "type": "string",
          "nullable": true
        }
      }
    });
  registry.registerComponent('schemas', 'Provincia', {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer"
        },
        "nombre": {
          "type": "string",
          "example": "Córdoba"
        }
      }
    });
  registry.registerComponent('schemas', 'Localidad', {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer"
        },
        "nombre": {
          "type": "string",
          "example": "Villa Carlos Paz"
        },
        "provinciaId": {
          "type": "integer"
        }
      }
    });
  registry.registerComponent('schemas', 'TipoUsuario', {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer"
        },
        "descripcion": {
          "type": "string",
          "example": "Cliente"
        }
      }
    });
  registry.registerComponent('schemas', 'TipoTurno', {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer"
        },
        "descripcion": {
          "type": "string",
          "example": "Reserva"
        }
      }
    });
  registry.registerComponent('schemas', 'TipoCancha', {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer"
        },
        "deporte": {
          "type": "string",
          "example": "Fútbol"
        },
        "descripcion": {
          "type": "string",
          "example": "Fútbol 5"
        }
      }
    });
  registry.registerComponent('schemas', 'PersonaFisica', {
      "type": "object",
      "properties": {
        "dni": {
          "type": "string",
          "example": "30123456"
        },
        "nombre": {
          "type": "string"
        },
        "apellido": {
          "type": "string"
        },
        "fechaNacimiento": {
          "type": "string",
          "format": "date"
        }
      }
    });
  registry.registerComponent('schemas', 'PersonaJuridica', {
      "type": "object",
      "properties": {
        "cuit": {
          "type": "string",
          "example": "20123456789"
        },
        "razonSocial": {
          "type": "string"
        }
      }
    });
  registry.registerComponent('schemas', 'ContactoRequest', {
      "type": "object",
      "required": [
        "razonSocial",
        "nombreContacto",
        "email",
        "plan"
      ],
      "properties": {
        "razonSocial": {
          "type": "string"
        },
        "nombreContacto": {
          "type": "string"
        },
        "email": {
          "type": "string",
          "format": "email"
        },
        "plan": {
          "type": "string"
        },
        "comentario": {
          "type": "string"
        }
      }
    });
  registry.registerComponent('schemas', 'MenuDueno', {
      "type": "object",
      "properties": {
        "cantidadTurnos": {
          "type": "integer"
        },
        "ingresosEstimados": {
          "type": "number"
        },
        "capacidadTotal": {
          "type": "integer"
        },
        "ocupacionPorcentaje": {
          "type": "integer",
          "minimum": 0,
          "maximum": 100
        },
        "deporteEstrella": {
          "type": "object",
          "properties": {
            "nombre": {
              "type": "string"
            },
            "reservas": {
              "type": "integer"
            }
          }
        },
        "cantidadCanchas": {
          "type": "integer"
        }
      }
    });
  registry.registerComponent('schemas', 'Mensaje', {
      "type": "object",
      "properties": {
        "message": {
          "type": "string"
        }
      }
    });
  registry.registerComponent('responses', 'Error400', {
      "description": "Solicitud inválida",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/ErrorResponse"
          },
          "example": {
            "message": "El id del complejo es inválido.",
            "code": "SOLICITUD_INVALIDA"
          }
        }
      }
    });
  registry.registerComponent('responses', 'ErrorValidacion', {
      "description": "Datos inválidos (incluye `detalles` con los issues)",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/ErrorResponse"
          },
          "example": {
            "message": "Error de validación en los datos ingresados",
            "code": "DATOS_INVALIDOS",
            "detalles": [
              {
                "path": [
                  "email"
                ],
                "message": "El formato del email no es válido"
              }
            ]
          }
        }
      }
    });
  registry.registerComponent('responses', 'Error401', {
      "description": "No autenticado o token inválido/expirado",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/ErrorResponse"
          },
          "example": {
            "message": "Token inválido o expirado",
            "code": "NO_AUTORIZADO"
          }
        }
      }
    });
  registry.registerComponent('responses', 'Error403', {
      "description": "Rol no autorizado",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/ErrorResponse"
          },
          "example": {
            "message": "Acceso denegado: rol no autorizado",
            "code": "PROHIBIDO"
          }
        }
      }
    });
  registry.registerComponent('responses', 'Error404', {
      "description": "Recurso no encontrado",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/ErrorResponse"
          },
          "example": {
            "message": "No se encontró el complejo",
            "code": "NO_ENCONTRADO"
          }
        }
      }
    });
  registry.registerComponent('responses', 'Error409', {
      "description": "Conflicto con el estado actual del recurso",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/ErrorResponse"
          },
          "example": {
            "message": "Ese horario ya está reservado",
            "code": "CONFLICTO"
          }
        }
      }
    });
  registry.registerComponent('responses', 'Error502', {
      "description": "Falla de un servicio externo (Mercado Pago, Cloudinary)",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/ErrorResponse"
          },
          "example": {
            "message": "Error al crear la orden en Mercado Pago",
            "code": "ERROR_EXTERNO"
          }
        }
      }
    });
  registry.registerComponent('responses', 'Error500', {
      "description": "Error interno del servidor",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/ErrorResponse"
          },
          "example": {
            "message": "Error interno del servidor",
            "code": "ERROR_INTERNO"
          }
        }
      }
    });
}
