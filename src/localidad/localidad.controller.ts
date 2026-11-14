import { type Request, type Response } from 'express'
import { getAllLocalidades, getLocalidad } from './localidad.service.js'
import { asegurarEncontrado } from '../shared/errors.js'

async function obtenerLocalidades(req: Request, res: Response) {
    const localidades = await getAllLocalidades()
    return res.status(200).json(localidades)
}

async function obtenerLocalidad(req: Request, res: Response){
    const {id} = req.params
    const localidad = asegurarEncontrado(await getLocalidad(Number(id)), "la localidad")
    return res.status(200).json(localidad)
}

export {
    obtenerLocalidad,
    obtenerLocalidades
}
