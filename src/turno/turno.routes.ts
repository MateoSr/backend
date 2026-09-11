import { Router } from "express";
import {obtenerTurno,obtenerTurnos,crearTurno,modificarTurno,borrarTurno} from "./turno.controller.js"
import { autenticar } from "../middleware/autenticas.js";


const turnoRouter = Router()

turnoRouter.get("/",obtenerTurnos)
turnoRouter.get("/:id",obtenerTurno)
turnoRouter.post("/",autenticar,crearTurno)
turnoRouter.put("/:id",modificarTurno)
turnoRouter.delete("/:id",borrarTurno)

export default turnoRouter