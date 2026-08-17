import {getHorarios,getHorario,postHorario,putHorario,deleteHorario} from "./horario.service.js"
import { ZodError } from 'zod'; //modulo que permimte mostrar los errores de tipos de datos
import {type Request, type Response} from 'express'


async function obtenerHorarios(req: Request, res: Response) {
    try{
        const {id_complejo} = req.params
        const horarios = await getHorarios(Number(id_complejo))
        
        if(!horarios){
            return res.status(404).json({message: "NO hay horarios cargados para ese complejo"})
        }
        return res.status(200).json(horarios)
    }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
    
}

async function obtenerHorario(req: Request, res: Response) {
    try{
        const {id_complejo,num_dia} = req.params
        const horario = await getHorario(Number(id_complejo), Number(num_dia))
        if(!horario){
            return res.status(404).json({message: "NO hay horarios cargados para ese dia"})
        }
        return res.status(200).json(horario)  
    }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
    
    
}

async function crearHorario(req: Request, res: Response) {
    try{
        //ver
        const {id_complejo} = req.params
        const horario = req.body
        const resultado = await postHorario(horario)
        return res.status(201).json({
            message: 'Horario creado correctamente',
            horario: horario
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

async function modificarHorario(req: Request, res: Response) {
    try{
        const {id_complejo,num_dia} = req.params
        const horarioNuevo = req.body
        const resultado = await putHorario(Number(id_complejo), Number(num_dia), horarioNuevo)
        if(!resultado){
            return res.status(404).json({message:"No se encontro el horario"})
        }
        return res.status(200).json({
            message: 'Horario modificado correctamente',
            horario: horarioNuevo
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

async function borrarHorario(req: Request, res: Response) {
    try{
        const {id_complejo,num_dia} = req.params
        const resultado = await deleteHorario(Number(id_complejo), Number(num_dia))
        if(!resultado){
            return res.status(404).json({message:"No se encontro el horario"})
        }
        return res.status(200).json({message:"Horario borrado correctamente"})

    }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
    
    
}

export {
    obtenerHorario,
    obtenerHorarios,
    crearHorario,
    modificarHorario,
    borrarHorario
}