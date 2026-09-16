import { Router } from "express";
import {obtenerTurno,obtenerTurnos,crearTurno,crearTurnoComoEncargado,modificarTurno,borrarTurno,obtenerTurnoPorComplejo} from "./turno.controller.js"
import { autenticar } from "../middleware/autenticas.js";


const turnoRouter = Router()
turnoRouter.get("/complejo/:id",obtenerTurnoPorComplejo)
turnoRouter.get("/",obtenerTurnos)
turnoRouter.get("/:id",obtenerTurno)


turnoRouter.post("/",autenticar,crearTurno)
turnoRouter.post("/encargado",autenticar,crearTurnoComoEncargado)
turnoRouter.put("/:id",modificarTurno)
turnoRouter.delete("/:id",borrarTurno)



export default turnoRouter