import {getTurnoId,getAllTurnos,postTurno,putTurno,deleteTurno} from './turno.service.js'
import { ZodError } from 'zod'; //modulo que permimte mostrar los errores de tipos de datos
async function obtenerTurnos(req,res) {
    try{
        const turnos = await getAllTurnos()
        if(turnos == 0){
            return res.status(404).json({message:"No hay turnos"})
        }
        return res.status(200).json(turnos)
        }catch(error)
        {
        return res.status(400).json({error:error.message})
        }
}

async function obtenerTurno(req,res) {
    try{
        const {id} = req.params
        const turno = await getTurnoId(id)
        if(!turno){
            return res.status(404).json({message:"No se encontro el turno"})
        }
        return res.status(200).json(turno)
        }catch(error)
        {
        return res.status(400).json({error:error.message})
        }
}

async function crearTurno(req,res) {
    try{
        const turno = req.body
        const resultado = await postTurno(turno)
        return res.status(201).json({
            message: 'Turno creado correctamente',
            turno: resultado
        })

        }catch(error)
        {
        if (error instanceof ZodError) {
        return res.status(400).json({
            message: "Error de validación en los datos ingresados",})
        }
        return res.status(400).json({error:error.message})
        }
}

async function modificarTurno(req,res) {
    try{
        const {id} = req.params
        const turnoModificado = req.body
        const resultado = await putTurno(id,turnoModificado)
        if(!resultado){
            return res.status(404).json({message:"No se encontro el turno"})
        }
        return res.status(200).json({
            message: 'Turno modificado correctamente',
            turno: turnoModificado
        })
        }catch(error)
        {
        return res.status(400).json({error:error.message})
        }
}

async function borrarTurno(req,res) {
    try{
        const {id} = req.params
        const response = await deleteTurno(id)
        if(!response){
            return res.status(404).json({message:"No se encontro el turno"})
        }
        return res.status(200).json({
            message: 'Turno eliminado correctamente',
        })
        }catch(error)
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