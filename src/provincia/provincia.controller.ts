import { getLocalidadPorProvincia } from '../localidad/localidad.service.js'
import {getProvincia,getProvincias} from './provincia.service.js'
import {type Request,type Response} from 'express'
import { asegurarEncontrado } from '../shared/errors.js'

async function obtenerProvincias(req: Request, res: Response){
    const provincias = await getProvincias()
    return res.status(200).json(provincias)
}

async function obtenerProvincia(req: Request, res: Response){
    const {id} = req.params
    const provincia = asegurarEncontrado(await getProvincia(Number(id)), "la provincia")
    return res.status(200).json(provincia)
}

async function obtenerLocalidadPorProvincia(req: Request, res: Response) {
    const {id} = req.params
    const localidades = await getLocalidadPorProvincia(Number(id))
    return res.status(200).json(localidades)
}

export {
    obtenerProvincias,
    obtenerProvincia,
    obtenerLocalidadPorProvincia
}
