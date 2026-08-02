import { Router } from "express";
import { obtenerPersonaJuridica, obtenerPersonasJuridicas, crearPersonaJuridica, modificarPersonaJuridica, borrarPersonaJuridica} from "./personaJuridica.controller";

const personaJuridicaRouter = Router()

personaJuridicaRouter.get('/',obtenerPersonasJuridicas)
personaJuridicaRouter.get('/:id',obtenerPersonaJuridica)
personaJuridicaRouter.post('/',crearPersonaJuridica)
personaJuridicaRouter.put('/:id',modificarPersonaJuridica)
personaJuridicaRouter.delete('/:id',borrarPersonaJuridica)


export default personaJuridicaRouter