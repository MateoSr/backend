import { getAllPersonasFisicas, getPersonaFisicaDni, postPersonaFisica, deletePersonaFisica, putPersonaFisica} from "./personaFisica.service.js"
import { ZodError } from 'zod';
import { type Request, type Response } from "express";

async function obtenerPersonasFisicas(req: Request, res: Response) {
    try{
        const personasFisicas = await getAllPersonasFisicas()

        return res.status(200).json(personasFisicas)
        }catch(error:any){
        return res.status(400).json({error:error.message})
    }
}

async function obtenerPersonaFisica(req: Request, res: Response) {
    try{
        const {dni} = req.params
        const personaFisica = await getPersonaFisicaDni(String(dni))
        if(!personaFisica){
            return res.status(404).json({message:"No se encontro la persona"})
        }
        return res.status(200).json(personaFisica)
        }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
}

async function crearPersonaFisica(req: Request, res: Response) {
    try{
        const personaFisica = req.body
        const resultado = await postPersonaFisica(personaFisica)
        return res.status(201).json({
            message: 'Persona creada correctamente',
            personaFisica: resultado
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

async function modificarPersonaFisica(req: Request, res: Response) {
    try{
        const {dni} = req.params
        const personaFisicaModificada = req.body
        const resultado = await putPersonaFisica(String(dni),personaFisicaModificada)
        if(!resultado){
            return res.status(404).json({message:"No se encontro la persona"})
        }
        return res.status(200).json({
            message: 'Persona modificada correctamente',
            personaFisica: personaFisicaModificada
        })
        }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
}

async function borrarPersonaFisica(req: Request, res: Response) {
    try{
        const {dni} = req.params
        const response = await deletePersonaFisica(String(dni))
        if(!response){
            return res.status(404).json({message:"No se encontro la persona"})
        }
        return res.status(200).json({
            message: 'Persona eliminada correctamente',
        })
        }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
}

export {
  obtenerPersonasFisicas,
  obtenerPersonaFisica,
  crearPersonaFisica,
  borrarPersonaFisica,
  modificarPersonaFisica
};