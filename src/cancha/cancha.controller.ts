import {getCanchaNro,getAllCanchas,postCancha,putCancha,deleteCancha} from './cancha.service.js'
import { ZodError } from 'zod'; //modulo que permimte mostrar los errores de tipos de datos
import {type Request, type Response} from 'express'

async function obtenerCanchas(req: Request, res: Response) {
    try{
        const {id_complejo} = req.params
        console.log("id_complejo", id_complejo)
        const canchas = await getAllCanchas(Number(id_complejo))
        if(canchas.length  === 0){
            return res.status(404).json({message:"No hay canchas"})
        }
        return res.status(200).json(canchas)
        }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
}

async function obtenerCancha(req: Request, res: Response) {
    try{
        const {nro} = req.params
        const {id_complejo} = req.params
        const cancha = await getCanchaNro(Number(nro), Number(id_complejo))
        if(!cancha){
            return res.status(404).json({message:"No se encontro la cancha"})
        }
        return res.status(200).json(cancha)
        }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
}

async function crearCancha(req: Request, res: Response) {
    try{
        const {id_complejo} = req.params
        const cancha = req.body
        const resultado = await postCancha(cancha, Number(id_complejo))
        return res.status(201).json({
            message: 'Cancha creada correctamente',
            cancha: resultado
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

async function modificarCancha(req: Request, res: Response) {
    try{
        const {id_complejo} = req.params
        const {nro} = req.params
        const canchaModificada = req.body
        const resultado = await putCancha(Number(nro), Number(id_complejo), canchaModificada)
        if(!resultado){
            return res.status(404).json({message:"No se encontro la cancha"})
        }
        return res.status(200).json({
            message: 'Cancha modificada correctamente',
            cancha: canchaModificada
        })
        }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
}

async function borrarCancha(req: Request, res: Response) {
    try{
        const {id_complejo} = req.params
        const {nro} = req.params
        const response = await deleteCancha(Number(nro), Number(id_complejo))
        if(!response){
            return res.status(404).json({message:"No se encontro la cancha"})
        }
        return res.status(200).json({
            message: 'Cancha eliminado correctamente',
        })
        }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
}

export {
  obtenerCancha,
  obtenerCanchas,
  crearCancha,
  modificarCancha,
  borrarCancha
};