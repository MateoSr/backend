import { Router } from "express";
import {obtenerComplejo,obtenerComplejos,crearComplejo,modificarComplejo,borrarComplejo} from "./complejos.controller.js"
import {obtenerHorario,obtenerHorarios,crearHorario,modificarHorario,borrarHorario} from "../horario/horario.controller.js"
import {obtenerCancha,crearCancha,modificarCancha,borrarCancha} from "../cancha/cancha.controller.js"
import {obtenerPrecio,obtenerPrecios,crearPrecio} from "../precio/precio.controller.js"

const complejoRouter = Router()


//rutas propias de complejo
complejoRouter.get("/",obtenerComplejos)
complejoRouter.get("/:id",obtenerComplejo)
complejoRouter.post("/",crearComplejo)
complejoRouter.put("/:id",modificarComplejo)
complejoRouter.delete("/:id",borrarComplejo)

//rutas para obtener los horarios de un complejo
//horario es debil de complejo
//ademas nunca vamos a buscar un horario suelto, siempre se buscaran a la hora de mostrar un complejo
//entonces busco todo desde los mismos endpoints
complejoRouter.get('/:id_complejo/horarios', obtenerHorarios);
complejoRouter.get('/:id_complejo/horarios/:num_dia', obtenerHorario);
complejoRouter.post('/:id_complejo/horarios',crearHorario );
complejoRouter.put('/:id_complejo/horarios/:num_dia', modificarHorario);
complejoRouter.delete('/:id_complejo/horarios/:num_dia', borrarHorario);

//rutas para obtener las canchas de un complejo
//cancha es debil de complejo
//ademas nunca vamos a buscar una cancha suelta, siempre se buscaran a la hora de mostrar un complejo
//entonces busco todo desde los mismos endpoints
complejoRouter.get("/:id_complejo/canchas",obtenerCancha)
complejoRouter.get("/:id_complejo/canchas/:nro",obtenerCancha)
complejoRouter.post("/:id_complejo/canchas",crearCancha)
complejoRouter.put("/:id_complejo/canchas/:nro",modificarCancha)
complejoRouter.delete("/:id_complejo/canchas/:nro",borrarCancha)

//rutas para obtener los precios de un complejo
//precio es debil de complejo
//ademas nunca vamos a buscar un precio suelto, siempre se buscaran a la hora de mostrar un complejo
//entonces busco todo desde los mismos endpoints
precioRouter.get("/:id_complejo/canchas/nro/:nro_cancha/precios",obtenerPrecios)
precioRouter.get("/:id_complejo/canchas/nro/:nro_cancha/precios/:id_precio",obtenerPrecio)
precioRouter.post("/:id_complejo/canchas/nro/:nro_cancha/precios",crearPrecio)

export default complejoRouter


