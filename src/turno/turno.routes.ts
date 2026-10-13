import { Router } from "express";
import {obtenerTurno,obtenerTurnos,crearTurno,crearTurnoComoEncargado,modificarTurno,borrarTurno,obtenerTurnoPorComplejo,cancelarTurno} from "./turno.controller.js"
import { autenticar } from "../middleware/autenticas.js";


const turnoRouter = Router()
turnoRouter.get("/complejo/:id",obtenerTurnoPorComplejo)
turnoRouter.get("/",autenticar,obtenerTurnos)
turnoRouter.get("/:id",obtenerTurno)


turnoRouter.post("/",autenticar,crearTurno)
turnoRouter.post("/encargado",autenticar,crearTurnoComoEncargado)
turnoRouter.put("/:id",modificarTurno)
turnoRouter.delete("/:id",borrarTurno)
turnoRouter.patch('/:id/cancelar', cancelarTurno);


export default turnoRouter