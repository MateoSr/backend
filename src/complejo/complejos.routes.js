import { Router } from "express";
import {obtenerComplejo,obtenerComplejos,crearComplejo,modificarComplejo,borrarComplejo} from "./complejos.controller.js"

const complejoRouter = Router()

complejoRouter.get("/",obtenerComplejos)

complejoRouter.get("/:id",obtenerComplejo)

complejoRouter.post("/",crearComplejo)

complejoRouter.put("/:id",modificarComplejo)

complejoRouter.delete("/:id",borrarComplejo)

export default complejoRouter


