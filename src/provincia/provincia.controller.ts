import { getLocalidadPorProvincia } from '../localidad/localidad.service.js'
import {getProvincia,getProvincias} from './provincia.service.js'
import {type Request,type Response} from 'express'

async function obtenerProvincias(req: Request, res: Response){
    try {
        const provincias = await getProvincias()
        if(!provincias){
            return res.status(404).json({message: "No se encontraron provincias"})
        }
        return res.status(200).json(provincias)
    } catch (error:any) {
        return res.status(500).json({message: error.message})
    }
}

async function obtenerProvincia(req: Request, res: Response){
    try {
        const {id} = req.params
        const provincia = await getProvincia(Number(id))
        if(!provincia){
            return res.status(404).json({message: "No se encontro la provincia"})
        }
        return res.status(200).json(provincia)
    } catch (error:any) {
        return res.status(500).json({message: error.message})
    }
}
async function obtenerLocalidadPorProvincia(req: Request, res: Response) {
    try {
        const {id} = req.params
        const localidades = await getLocalidadPorProvincia(Number(id))
        if(!localidades){
            return res.status(404).json({message: "No se encontro localidades para esa provincia"})
        }
        return res.status(200).json(localidades)
    } catch (error:any) {
        return res.status(500).json({message: error.message})
    }
    
}
export {
    obtenerProvincias,
    obtenerProvincia,
    obtenerLocalidadPorProvincia
}