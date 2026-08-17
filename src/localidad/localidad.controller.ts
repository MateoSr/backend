import {getLocalidades,getLocalidad} from './localidad.service.js'
import {type Request,type Response} from 'express'

async function obtenerLocalidades(req: Request, res: Response){
    try {
        const localidades = await getLocalidades()
        if(!localidades){
            return res.status(404).json({message: "No se encontraron localidades"})
        }
        return res.status(200).json(localidades)
    } catch (error:any) {
        return res.status(500).json({message: error.message})
    }
}

async function obtenerLocalidad(req: Request, res: Response){
    try {
        const {id} = req.params
        const localidad = await getLocalidad(Number(id))
        if(!localidad){
            return res.status(404).json({message: "No se encontro la localidad"})
        }
        return res.status(200).json(localidad)
    } catch (error:any) {
        return res.status(500).json({message: error.message})
    }
}



export {
    obtenerLocalidad,
    obtenerLocalidades
}