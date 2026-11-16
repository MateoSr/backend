import { Router } from "express";
import {obtenerTurno,obtenerTurnos,crearTurno,crearTurnoComoEncargado,modificarTurno,borrarTurno,obtenerTurnoPorComplejo,cancelarTurno} from "./turno.controller.js"
import { autenticar } from "../middleware/autenticas.js";
import { autorizarPorNombre } from "../middleware/autorizar.js";
import { validarCuerpo } from "../middleware/validar.js";
import { turnoSchema, turnoUpdateBodySchema, turnoEncargadoSchema } from "./turno.schema.js";

const turnoRouter = Router()

turnoRouter.get("/complejo/:id",autenticar,autorizarPorNombre("Dueño","Encargado"),obtenerTurnoPorComplejo)

turnoRouter.get("/",autenticar,obtenerTurnos)

turnoRouter.get("/:id",autenticar,obtenerTurno)

turnoRouter.post("/",autenticar,autorizarPorNombre("Cliente"),validarCuerpo(turnoSchema),crearTurno)

turnoRouter.post("/encargado",autenticar,autorizarPorNombre("Encargado"),validarCuerpo(turnoEncargadoSchema),crearTurnoComoEncargado)

turnoRouter.put("/:id",autenticar,autorizarPorNombre("Administrador","Encargado"),validarCuerpo(turnoUpdateBodySchema),modificarTurno)

turnoRouter.delete("/:id",autenticar,autorizarPorNombre("Administrador"),borrarTurno)

turnoRouter.patch('/:id/cancelar', autenticar,autorizarPorNombre("Cliente"),cancelarTurno);

export default turnoRouter
