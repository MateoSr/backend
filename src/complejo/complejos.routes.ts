import { Router } from "express";
import {obtenerComplejo,obtenerComplejoDelEncargado,obtenerComplejos,crearComplejo,modificarComplejo,borrarComplejo,darDeBajaComplejo,obtenerComplejosDisponibles,obtenerComplejoDelDueno} from "./complejos.controller.js"
import { autenticar } from "../middleware/autenticas.js";
import {obtenerHorario,obtenerHorarios,crearHorario,modificarHorario,borrarHorario} from "../horario/horario.controller.js"
import {obtenerCancha,crearCancha,modificarCancha,borrarCancha, obtenerCanchas} from "../cancha/cancha.controller.js"
import {obtenerPrecio,obtenerPrecios,crearPrecio} from "../precio/precio.controller.js"
import { autorizarPorNombre } from "../middleware/autorizar.js";

const complejoRouter = Router()
//Busqueda de complejos de una ciudad de un deporte de una fecha y hora determinada
complejoRouter.get("/busqueda", obtenerComplejosDisponibles);
complejoRouter.get("/encargado", autenticar, autorizarPorNombre("Encargado"), obtenerComplejoDelEncargado);
complejoRouter.get("/dueno", autenticar, autorizarPorNombre("Dueño"), obtenerComplejoDelDueno);




//rutas propias de complejo
complejoRouter.get("/",autenticar,autorizarPorNombre("Administrador"),obtenerComplejos)
complejoRouter.get("/:id",obtenerComplejo)
complejoRouter.post("/",autenticar,autorizarPorNombre("Administrador"),crearComplejo)
complejoRouter.put("/:id",autenticar,autorizarPorNombre("Dueño"),modificarComplejo)
complejoRouter.patch("/:id/baja",autenticar,autorizarPorNombre("Administrador"),darDeBajaComplejo)
complejoRouter.delete("/:id",autenticar,autorizarPorNombre("Administrador"),borrarComplejo)

//rutas para obtener los horarios de un complejo
//horario es debil de complejo
//ademas nunca vamos a buscar un horario suelto, siempre se buscaran a la hora de mostrar un complejo
//entonces busco todo desde los mismos endpoints
complejoRouter.get('/:id_complejo/horarios', obtenerHorarios);
complejoRouter.get('/:id_complejo/horarios/:num_dia', obtenerHorario);
complejoRouter.post('/:id_complejo/horarios',autenticar,autorizarPorNombre("Dueño"),crearHorario );
complejoRouter.put('/:id_complejo/horarios/:num_dia',autenticar,autorizarPorNombre("Dueño"), modificarHorario);
complejoRouter.delete('/:id_complejo/horarios/:num_dia',autenticar,autorizarPorNombre("Dueño"), borrarHorario);

//rutas para obtener las canchas de un complejo
//cancha es debil de complejo
//ademas nunca vamos a buscar una cancha suelta, siempre se buscaran a la hora de mostrar un complejo
//entonces busco todo desde los mismos endpoints
complejoRouter.get("/:id_complejo/canchas",obtenerCanchas)
//IMPLEMENTAR QUE AL ACCEDER A UNA CANCHA TE TRAIGA TMB EL TIPOCANCHA Y EL ULTIMO PRECIO
complejoRouter.get("/:id_complejo/canchas/:nro",obtenerCancha)
complejoRouter.post("/:id_complejo/canchas",autenticar,autorizarPorNombre("Dueño"),crearCancha)
complejoRouter.put("/:id_complejo/canchas/:nro",autenticar,autorizarPorNombre("Dueño"),modificarCancha)
complejoRouter.delete("/:id_complejo/canchas/:nro",autenticar,autorizarPorNombre("Dueño"),borrarCancha)

//rutas para obtener los precios de un complejo
//precio es debil de complejo
//ademas nunca vamos a buscar un precio suelto, siempre se buscaran a la hora de mostrar un complejo
//entonces busco todo desde los mismos endpoints
complejoRouter.get("/:id_complejo/canchas/:nro_cancha/precios",obtenerPrecios)
complejoRouter.get("/:id_complejo/canchas/:nro_cancha/precios/:fechaDesde",obtenerPrecio)
complejoRouter.post("/:id_complejo/canchas/:nro_cancha/precios",autenticar,autorizarPorNombre("Dueño"),crearPrecio)

export default complejoRouter


