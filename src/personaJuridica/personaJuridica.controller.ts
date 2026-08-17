import { getAllPersonasJuridicas, getPersonaJuridicaCuit, postPersonaJuridica, deletePersonaJuridica, putPersonaJuridica} from "./personaJuridica.service.js"
import { ZodError } from 'zod';
import { type Request, type Response } from "express";

async function obtenerPersonasJuridicas(req: Request, res: Response) {
    try{
        const personasJuridicas = await getAllPersonasJuridicas()

        return res.status(200).json(personasJuridicas)
        }catch(error:any){
        return res.status(400).json({error:error.message})
    }
}

async function obtenerPersonaJuridica(req: Request, res: Response) {
    try{
        const {cuit} = req.params
        const personaJuridica = await getPersonaJuridicaCuit(String(cuit))
        if(!personaJuridica){
            return res.status(404).json({message:"No se encontro la empresa"})
        }
        return res.status(200).json(personaJuridica)
        }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
}

async function crearPersonaJuridica(req: Request, res: Response) {
    try{
        const personaJuridica = req.body
        const resultado = await postPersonaJuridica(personaJuridica)
        return res.status(201).json({
            message: 'Empresa creada correctamente',
            personaJuridica: resultado
        })

        }catch(error:any)
        {
        if (error instanceof ZodError) {
        return res.status(400).json({
            message: "Error de validación en los datos ingresados",})
        }
        return res.status(400).json({error:error.message})
        }
}

async function modificarPersonaJuridica(req: Request, res: Response) {
    try{
        const {cuit} = req.params
        const personaJuridicaModificada = req.body
        const resultado = await putPersonaJuridica(String(cuit),personaJuridicaModificada)
        if(!resultado){
            return res.status(404).json({message:"No se encontro la empresa"})
        }
        return res.status(200).json({
            message: 'Empresa modificada correctamente',
            personaJuridica: resultado
        })
        }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
}

async function borrarPersonaJuridica(req: Request, res: Response) {
    try{
        const {cuit} = req.params
        const response = await deletePersonaJuridica(String(cuit))
        if(!response){
            return res.status(404).json({message:"No se encontro la empresa"})
        }
        return res.status(200).json({
            message: 'Empresa eliminada correctamente',
        })
        }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
}

export {
  obtenerPersonasJuridicas,
  obtenerPersonaJuridica,
  crearPersonaJuridica,
  borrarPersonaJuridica,
  modificarPersonaJuridica
};