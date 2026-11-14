import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

export function registrarMenu(registry: OpenAPIRegistry): void {
  registry.registerPath({
    "method": "get",
    "path": "/api/menues/dueno",
    "tags": [
      "Menú"
    ],
    "summary": "Obtener los datos del panel del dueño",
    "description": "Solo Dueño. Devuelve métricas del día y cantidad de canchas.",
    "security": [
      {
        "bearerAuth": []
      }
    ],
    "responses": {
      "200": {
        "description": "Datos del panel",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/MenuDueno"
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
