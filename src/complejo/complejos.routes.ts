import { Router } from "express";
import {obtenerComplejo,obtenerDisponibilidad,obtenerComplejoDelEncargado,obtenerComplejos,crearComplejo,modificarComplejo,borrarComplejo,darDeBajaComplejo,obtenerComplejosDisponibles,obtenerComplejoDelDueno} from "./complejos.controller.js"
import { autenticar } from "../middleware/autenticas.js";
import { autorizarPorNombre } from "../middleware/autorizar.js";
import {
  obtenerHorario,
  obtenerHorarios,
  crearHorario,
  modificarHorario,
  borrarHorario
} from "../horario/horario.controller.js";
import {
  obtenerCancha,
  crearCancha,
  modificarCancha,
  borrarCancha,
  obtenerCanchas
} from "../cancha/cancha.controller.js";
import {
  obtenerPrecio,
  obtenerPrecios,
  crearPrecio
} from "../precio/precio.controller.js";
import { crearOpinion } from "../opinion/opinion.controller.js";
import { validarCuerpo, validarParams } from "../middleware/validar.js";
import { complejoSchema } from "./complejos.schema.js";
import { horarioSchema } from "../horario/horario.schema.js";
import { canchaSchema } from "../cancha/cancha.schema.js";
import { precioBodySchema, precioParamsSchema } from "../precio/precio.schema.js";
import { opinionSchema } from "../opinion/opinion.schema.js";

const complejoRouter = Router();

complejoRouter.get("/busqueda", obtenerComplejosDisponibles);

complejoRouter.get("/encargado", autenticar, autorizarPorNombre("Encargado"), obtenerComplejoDelEncargado);

complejoRouter.get("/dueno", autenticar, autorizarPorNombre("Dueño"), obtenerComplejoDelDueno);

// Rutas propias de complejo

complejoRouter.get("/", autenticar, autorizarPorNombre("Administrador"), obtenerComplejos);

complejoRouter.get("/:id/disponibilidad", obtenerDisponibilidad)

complejoRouter.get("/:id", obtenerComplejo);

complejoRouter.post("/", autenticar, autorizarPorNombre("Administrador"), validarCuerpo(complejoSchema), crearComplejo);

complejoRouter.put("/:id", autenticar, autorizarPorNombre("Dueño"), validarCuerpo(complejoSchema.partial()), modificarComplejo);

complejoRouter.patch("/:id/baja", autenticar, autorizarPorNombre("Administrador"), darDeBajaComplejo);

complejoRouter.delete("/:id", autenticar, autorizarPorNombre("Administrador"), borrarComplejo);

// Rutas para las opiniones de un complejo

complejoRouter.post("/:id/opiniones", validarCuerpo(opinionSchema), crearOpinion);

// Rutas para obtener los horarios de un complejo
// horario es débil de complejo
// además nunca vamos a buscar un horario suelto, siempre se buscarán a la hora de mostrar un complejo
// entonces busco todo desde los mismos endpoints

complejoRouter.get("/:id_complejo/horarios", obtenerHorarios);

complejoRouter.get("/:id_complejo/horarios/:num_dia", obtenerHorario);

complejoRouter.post("/:id_complejo/horarios", autenticar, autorizarPorNombre("Dueño"), validarCuerpo(horarioSchema), crearHorario);

complejoRouter.put("/:id_complejo/horarios/:num_dia", autenticar, autorizarPorNombre("Dueño"), validarCuerpo(horarioSchema.partial()), modificarHorario);

complejoRouter.delete("/:id_complejo/horarios/:num_dia", autenticar, autorizarPorNombre("Dueño"), borrarHorario);

// Rutas para obtener las canchas de un complejo
// cancha es débil de complejo
// además nunca vamos a buscar una cancha suelta, siempre se buscarán a la hora de mostrar un complejo
// entonces busco todo desde los mismos endpoints

complejoRouter.get("/:id_complejo/canchas", obtenerCanchas);

// IMPLEMENTAR QUE AL ACCEDER A UNA CANCHA TE TRAIGA TMB EL TIPOCANCHA Y EL ULTIMO PRECIO

complejoRouter.get("/:id_complejo/canchas/:nro", obtenerCancha);

complejoRouter.post("/:id_complejo/canchas", autenticar, autorizarPorNombre("Dueño"), validarCuerpo(canchaSchema), crearCancha);

complejoRouter.put("/:id_complejo/canchas/:nro", autenticar, autorizarPorNombre("Dueño"), validarCuerpo(canchaSchema.partial()), modificarCancha);

complejoRouter.delete("/:id_complejo/canchas/:nro", autenticar, autorizarPorNombre("Dueño"), borrarCancha);

// Rutas para obtener los precios de un complejo
// precio es débil de complejo
// además nunca vamos a buscar un precio suelto, siempre se buscarán a la hora de mostrar un complejo
// entonces busco todo desde los mismos endpoints

complejoRouter.get("/:id_complejo/canchas/:nro_cancha/precios", obtenerPrecios);

complejoRouter.get("/:id_complejo/canchas/:nro_cancha/precios/:fechaDesde", obtenerPrecio);

complejoRouter.post("/:id_complejo/canchas/:nro_cancha/precios", autenticar, autorizarPorNombre("Dueño"), validarParams(precioParamsSchema), validarCuerpo(precioBodySchema), crearPrecio);

export default complejoRouter;
