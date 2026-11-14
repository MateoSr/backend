import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

export function registrarPagos(registry: OpenAPIRegistry): void {
  registry.registerPath({
    "method": "post",
    "path": "/api/pagos/crear-orden",
    "tags": [
      "Pagos"
    ],
    "summary": "Crear una orden de pago (seña)",
    "description": "Valida disponibilidad y crea un turno pendiente + una orden en Mercado Pago.\nDevuelve la URL de checkout.\n",
    "security": [
      {
        "bearerAuth": []
      }
    ],
    "responses": {
      "201": {
        "description": "Orden creada",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/CrearOrdenResponse"
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
            "schema": {
              "$ref": "#/components/schemas/CrearOrdenRequest"
            }
          }
        }
      }
    }
  });

  registry.registerPath({
    "method": "post",
    "path": "/api/pagos/webhook",
    "tags": [
      "Pagos"
    ],
    "summary": "Webhook de Mercado Pago",
    "description": "Endpoint público llamado por Mercado Pago. Valida la firma `x-signature`\ny actualiza el estado de la orden.\n",
    "parameters": [
      {
        "in": "header",
        "name": "x-signature",
        "required": true,
        "schema": {
          "type": "string"
        }
      },
      {
        "in": "header",
        "name": "x-request-id",
        "required": true,
        "schema": {
          "type": "string"
        }
      },
      {
        "in": "query",
        "name": "data.id",
        "required": false,
        "schema": {
          "type": "string"
        }
      }
    ],
    "responses": {
      "200": {
        "description": "Estado procesado",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "status": {
                  "type": "string",
                  "example": "aprobada"
                }
              }
            }
          }
        }
      },
      "401": {
        "$ref": "#/components/responses/Error401"
      },
      "404": {
        "$ref": "#/components/responses/Error404"
      },
      "502": {
        "$ref": "#/components/responses/Error502"
      }
    },
    "request": {
      "body": {
        "required": false,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "data": {
                  "type": "object",
                  "additionalProperties": true
                }
              }
            }
          }
        }
      }
    }
  });

  registry.registerPath({
    "method": "get",
    "path": "/api/pagos/estado/{externalReference}",
    "tags": [
      "Pagos"
    ],
    "summary": "Consultar el estado de una orden",
    "description": "El usuario solo puede consultar sus propias órdenes.",
    "security": [
      {
        "bearerAuth": []
      }
    ],
    "parameters": [
      {
        "in": "path",
        "name": "externalReference",
        "required": true,
        "schema": {
          "type": "string"
        }
      }
    ],
    "responses": {
      "200": {
        "description": "Estado de la orden",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/EstadoOrden"
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
