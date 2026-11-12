import { Router } from "express";
import {obtenerTipoTurno,obtenerTipoTurnos} from "./tipoTurno.controller.js"


const tipoTurnoRouter = Router()

tipoTurnoRouter.get("/",obtenerTipoTurnos)
tipoTurnoRouter.get("/:id",obtenerTipoTurno)

export default tipoTurnoRouter