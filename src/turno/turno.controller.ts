import {getTurnoId,getAllTurnos,postTurno,putTurno,deleteTurno} from './turno.service.js'
import {type Request,type Response} from 'express'
import { ZodError } from 'zod'; //modulo que permimte mostrar los errores de tipos de datos
async function obtenerTurnos(req:Request,res:Response) {
    const {id_cliente} = req.query;
    try{
        const idClienteNum = id_cliente ? Number(id_cliente) : undefined;
        const turnos = await getAllTurnos({id_cliente: idClienteNum })
        if(turnos.length === 0){
            return res.status(404).json({message:"No hay turnos"})
        }
        return res.status(200).json(turnos)
        }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
}

async function obtenerTurno(req:Request,res:Response) {
    try{
        const {id} = req.params
        const turno = await getTurnoId(Number(id))
        if(!turno){
            return res.status(404).json({message:"No se encontro el turno"})
        }
        return res.status(200).json(turno)
        }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
}

async function crearTurno(req:Request,res:Response) {
    try{
        const turno = req.body
        const resultado = await postTurno(turno)
        return res.status(201).json({
            message: 'Turno creado correctamente',
            turno: resultado
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

async function modificarTurno(req:Request,res:Response) {
    try{
        const {id} = req.params
        const turnoModificado = req.body
        const resultado = await putTurno(Number(id),turnoModificado)
        if(!resultado){
            return res.status(404).json({message:"No se encontro el turno"})
        }
        return res.status(200).json({
            message: 'Turno modificado correctamente',
            turno: turnoModificado
        })
        }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
}

async function borrarTurno(req:Request,res:Response) {
    try{
        const {id} = req.params
        const response = await deleteTurno(Number(id))
        if(!response){
            return res.status(404).json({message:"No se encontro el turno"})
        }
        return res.status(200).json({
            message: 'Turno eliminado correctamente',
        })
        }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
}

export {
  obtenerTurno,
  obtenerTurnos,
  crearTurno,
  modificarTurno,
  borrarTurno
};