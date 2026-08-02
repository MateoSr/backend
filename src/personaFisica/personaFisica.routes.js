import { Router } from "express";
import {obtenerPersonaFisica, obtenerPersonasFisicas, crearPersonaFisica, modificarPersonaFisica, borrarPersonaFisica} from "./personaFisica.controller.js"

const personaFisicaRouter = Router()

personaFisicaRouter.get('/',obtenerPersonasFisicas)
personaFisicaRouter.get('/:id',obtenerPersonaFisica)
personaFisicaRouter.post('/',crearPersonaFisica)
personaFisicaRouter.put('/:id',modificarPersonaFisica)
personaFisicaRouter.delete('/:id',borrarPersonaFisica)


export default personaFisicaRouter