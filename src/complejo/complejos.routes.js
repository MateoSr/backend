import { Router } from "express";
import {obtenerComplejo,obtenerComplejos,crearComplejo,modificarComplejo,borrarComplejo} from "./complejos.controller.js"
import {obtenerHorario,obtenerHorarios,crearHorario,modificarHorario,borrarHorario} from "../horario/horario.controller.js"

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
//entonces busco todo desde los mismo endpoints
complejoRouter.get('/:id_complejo/horarios', obtenerHorarios);
complejoRouter.get('/:id_complejo/horarios/:num_dia', obtenerHorario);
complejoRouter.post('/:id_complejo/horarios',crearHorario );
complejoRouter.put('/:id_complejo/horarios/:num_dia', modificarHorario);
complejoRouter.delete('/:id_complejo/horarios/:num_dia', borrarHorario);



export default complejoRouter


