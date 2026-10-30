import { Router } from "express";
import {obtenerPersonaFisica, obtenerPersonasFisicas, crearPersonaFisica, modificarPersonaFisica, borrarPersonaFisica} from "./personaFisica.controller.js"
import { autenticar } from "../middleware/autenticas.js";
import { autorizarPorNombre } from "../middleware/autorizar.js";

const personaFisicaRouter = Router()

personaFisicaRouter.get('/',autenticar,autorizarPorNombre("Administrador"),obtenerPersonasFisicas)
personaFisicaRouter.get('/:dni',autenticar,autorizarPorNombre("Administrador"),obtenerPersonaFisica)
personaFisicaRouter.post('/',autenticar,autorizarPorNombre("Administrador"),crearPersonaFisica)
personaFisicaRouter.put('/:dni',autenticar,autorizarPorNombre("Administrador"),modificarPersonaFisica)
personaFisicaRouter.delete('/:dni',autenticar,autorizarPorNombre("Administrador"),borrarPersonaFisica)


export default personaFisicaRouter