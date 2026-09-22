import { Router } from "express";
import { autenticar } from "../middleware/autenticas.js";
import {obtenerDatosMenuDueno} from "./menu.controller.js"

const menuRouter = Router()

menuRouter.get("/dueno",autenticar,obtenerDatosMenuDueno)

export default menuRouter