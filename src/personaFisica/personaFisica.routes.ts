import { Router } from "express";
import {obtenerPersonaFisica, obtenerPersonasFisicas, crearPersonaFisica, modificarPersonaFisica, borrarPersonaFisica} from "./personaFisica.controller.js"
import { autenticar } from "../middleware/autenticas.js";
import { autorizarPorNombre } from "../middleware/autorizar.js";
import { validarCuerpo } from "../middleware/validar.js";
import { personaFisicaSchema } from "./personaFisica.schema.js";

const personaFisicaRouter = Router()

personaFisicaRouter.get('/',autenticar,autorizarPorNombre("Administrador"),obtenerPersonasFisicas)

personaFisicaRouter.get('/:dni',autenticar,autorizarPorNombre("Administrador"),obtenerPersonaFisica)

personaFisicaRouter.post('/',autenticar,autorizarPorNombre("Administrador"),validarCuerpo(personaFisicaSchema),crearPersonaFisica)

personaFisicaRouter.put('/:dni',autenticar,autorizarPorNombre("Administrador"),validarCuerpo(personaFisicaSchema.partial()),modificarPersonaFisica)

personaFisicaRouter.delete('/:dni',autenticar,autorizarPorNombre("Administrador"),borrarPersonaFisica)

export default personaFisicaRouter
