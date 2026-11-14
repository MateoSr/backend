import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { registrarComponentes } from './components.js';
import { registrarAuth } from './auth.docs.js';
import { registrarUsuarios } from './usuarios.docs.js';
import { registrarComplejos } from './complejos.docs.js';
import { registrarHorarios } from './horarios.docs.js';
import { registrarCanchas } from './canchas.docs.js';
import { registrarPrecios } from './precios.docs.js';
import { registrarOpiniones } from './opiniones.docs.js';
import { registrarTurnos } from './turnos.docs.js';
import { registrarPagos } from './pagos.docs.js';
import { registrarProvincias } from './provincias.docs.js';
import { registrarLocalidades } from './localidades.docs.js';
import { registrarCatalogos } from './catalogos.docs.js';
import { registrarPersonas } from './personas.docs.js';
import { registrarContacto } from './contacto.docs.js';
import { registrarMenu } from './menu.docs.js';

export function registrarDocumentacion(registry: OpenAPIRegistry): void {
  registrarComponentes(registry);
  registrarAuth(registry);
  registrarUsuarios(registry);
  registrarComplejos(registry);
  registrarHorarios(registry);
  registrarCanchas(registry);
  registrarPrecios(registry);
  registrarOpiniones(registry);
  registrarTurnos(registry);
  registrarPagos(registry);
  registrarProvincias(registry);
  registrarLocalidades(registry);
  registrarCatalogos(registry);
  registrarPersonas(registry);
  registrarContacto(registry);
  registrarMenu(registry);
}
