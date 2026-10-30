import { Router } from "express";
import {obtenerTipoCancha,obtenerTipoCanchas} from "./tipoCancha.controller.js"


const tipoCanchaRouter = Router()

tipoCanchaRouter.get("/",obtenerTipoCanchas)
tipoCanchaRouter.get("/:id",obtenerTipoCancha)

export default tipoCanchaRouter