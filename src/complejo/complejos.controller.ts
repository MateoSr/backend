import {getComplejoId,getAllComplejos,postComplejo,putComplejo,deleteComplejo} from './complejos.service.js'
import { ZodError } from 'zod'; //modulo que permimte mostrar los errores de tipos de datos
import {type Request, type Response} from 'express'
async function obtenerComplejos(req: Request, res: Response) {
    try{
        const complejos = await getAllComplejos()
        if(complejos.length === 0){
            return res.status(404).json({message:"No hay complejos"})
        }
        return res.status(200).json(complejos)
        }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
}

async function obtenerComplejo(req: Request, res: Response) {
    try{
        const {id} = req.params
        const complejo = await getComplejoId(Number(id))
        if(!complejo){
            return res.status(404).json({message:"No se encontro el complejo"})
        }
        return res.status(200).json(complejo)
        }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
}


async function crearComplejo(req: Request, res: Response) {
    try{
        const complejo = req.body
        const resultado = await postComplejo(complejo)
        return res.status(201).json({
            message: 'Complejo creado correctamente',
            complejo: resultado
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

async function modificarComplejo(req: Request, res: Response) {
    try{
        const {id} = req.params
        const complejoModificado = req.body
        const resultado = await putComplejo(Number(id),complejoModificado)
        if(!resultado){
            return res.status(404).json({message:"No se encontro el complejo"})
        }
        return res.status(200).json({
            message: 'Complejo modificado correctamente',
            complejo: complejoModificado
        })
        }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
}

async function borrarComplejo(req: Request, res: Response) {
    try{
        const {id} = req.params
        const response = await deleteComplejo(Number(id))
        if(!response){
            return res.status(404).json({message:"No se encontro el complejo"})
        }
        return res.status(200).json({
            message: 'Complejo eliminado correctamente',
        })
        }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
}

export {
  obtenerComplejo,
  obtenerComplejos,
  crearComplejo,
  modificarComplejo,
  borrarComplejo
};