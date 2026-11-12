import { Router } from "express";
import { autenticar } from "../middleware/autenticas.js";
import { autorizarPorNombre } from "../middleware/autorizar.js";
import {obtenerDatosMenuDueno} from "./menu.controller.js"

const menuRouter = Router()

menuRouter.get("/dueno",autenticar,autorizarPorNombre("Dueño"),obtenerDatosMenuDueno)

export default menuRouter