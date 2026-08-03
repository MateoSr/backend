import { Router } from "express";
import { obtenerPersonaJuridica, obtenerPersonasJuridicas, crearPersonaJuridica, modificarPersonaJuridica, borrarPersonaJuridica} from "./personaJuridica.controller.js";

const personaJuridicaRouter = Router()

personaJuridicaRouter.get('/',obtenerPersonasJuridicas)
personaJuridicaRouter.get('/:cuit',obtenerPersonaJuridica)
personaJuridicaRouter.post('/',crearPersonaJuridica)
personaJuridicaRouter.put('/:cuit',modificarPersonaJuridica)
personaJuridicaRouter.delete('/:cuit',borrarPersonaJuridica)


export default personaJuridicaRouter