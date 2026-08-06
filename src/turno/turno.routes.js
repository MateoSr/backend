import { Router } from "express";
import {obtenerTurno,obtenerTurnos} from "./turno.controller.js"


const turnoRouter = Router()

turnoRouter.get("/",obtenerTurnos)
turnoRouter.get("/:id",obtenerTurno)
turnoRouter.post("/",crearTurno)
turnoRouter.put("/:id",modificarTurno)
turnoRouter.delete("/:id",borrarTurno)

export default turnoRouter