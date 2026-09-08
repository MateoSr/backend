import { type Request, type Response } from 'express'
import { getAllLocalidades, getLocalidad, getLocalidadPorProvincia } from './localidad.service.js'

async function obtenerLocalidades(req: Request, res: Response) {
    try {
        const localidades = await getAllLocalidades()
        if (localidades.length === 0) {
            return res.status(404).json({ message: "No se encontraron localidades" })
        }
        return res.status(200).json(localidades)
    } catch (error: any) {
        return res.status(500).json({ message: error.message })
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

async function obtenerLocalidadesPorProvincia(req: Request, res: Response) {
    try {
        const { idProvincia } = req.params
        const localidades = await getLocalidadPorProvincia(Number(idProvincia))
        if (localidades.length === 0) {
            return res.status(404).json({ message: "No se encontraron localidades para esta provincia" })
        }
        return res.status(200).json(localidades)
    } catch (error: any) {
        return res.status(500).json({ message: error.message })
    }
}

export {
    obtenerLocalidad,
    obtenerLocalidades,
    obtenerLocalidadesPorProvincia
}