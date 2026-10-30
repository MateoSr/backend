import { Router } from "express";
import { obtenerPersonaJuridica, obtenerPersonasJuridicas, crearPersonaJuridica, modificarPersonaJuridica, borrarPersonaJuridica} from "./personaJuridica.controller.js";
import { autenticar } from "../middleware/autenticas.js";
import { autorizarPorNombre } from "../middleware/autorizar.js";

const personaJuridicaRouter = Router()

personaJuridicaRouter.get('/',autenticar,autorizarPorNombre("Administrador"),obtenerPersonasJuridicas)
personaJuridicaRouter.get('/:cuit',autenticar,autorizarPorNombre("Administrador"),obtenerPersonaJuridica)
personaJuridicaRouter.post('/',autenticar,autorizarPorNombre("Administrador"),crearPersonaJuridica)
personaJuridicaRouter.put('/:cuit',autenticar,autorizarPorNombre("Administrador"),modificarPersonaJuridica)
personaJuridicaRouter.delete('/:cuit',autenticar,autorizarPorNombre("Administrador"),borrarPersonaJuridica)


export default personaJuridicaRouter