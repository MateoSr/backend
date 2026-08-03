import { Router } from "express";
import {obtenerPersonaFisica, obtenerPersonasFisicas, crearPersonaFisica, modificarPersonaFisica, borrarPersonaFisica} from "./personaFisica.controller.js"

const personaFisicaRouter = Router()

personaFisicaRouter.get('/',obtenerPersonasFisicas)
personaFisicaRouter.get('/:dni',obtenerPersonaFisica)
personaFisicaRouter.post('/',crearPersonaFisica)
personaFisicaRouter.put('/:dni',modificarPersonaFisica)
personaFisicaRouter.delete('/:dni',borrarPersonaFisica)


export default personaFisicaRouter