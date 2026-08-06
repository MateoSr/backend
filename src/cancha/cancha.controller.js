import {getCanchaNro,getAllCanchas,postCancha,putCancha,deleteCancha} from './cancha.service.js'
import { ZodError } from 'zod'; //modulo que permimte mostrar los errores de tipos de datos
async function obtenerCanchas(req,res) {
    try{
        const canchas = await getAllCanchas()
        if(canchas == 0){
            return res.status(404).json({message:"No hay canchas"})
        }
        return res.status(200).json(canchas)
        }catch(error)
        {
        return res.status(400).json({error:error.message})
        }
}

async function obtenerCancha(req,res) {
    try{
        const {nro} = req.params
        const cancha = await getCanchaNro(nro)
        if(!cancha){
            return res.status(404).json({message:"No se encontro la cancha"})
        }
        return res.status(200).json(cancha)
        }catch(error)
        {
        return res.status(400).json({error:error.message})
        }
}

async function crearCancha(req,res) {
    try{
        const cancha = req.body
        const resultado = await postCancha(cancha)
        return res.status(201).json({
            message: 'Cancha creada correctamente',
            cancha: resultado
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

async function modificarCancha(req,res) {
    try{
        const {nro} = req.params
        const canchaModificada = req.body
        const resultado = await putCancha(nro,canchaModificada)
        if(!resultado){
            return res.status(404).json({message:"No se encontro la cancha"})
        }
        return res.status(200).json({
            message: 'Cancha modificada correctamente',
            cancha: canchaModificada
        })
        }catch(error)
        {
        return res.status(400).json({error:error.message})
        }
}

async function borrarCancha(req,res) {
    try{
        const {nro} = req.params
        const response = await deleteCancha(nro)
        if(!response){
            return res.status(404).json({message:"No se encontro la cancha"})
        }
        return res.status(200).json({
            message: 'Cancha eliminado correctamente',
        })
        }catch(error)
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