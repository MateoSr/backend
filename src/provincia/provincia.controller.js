import { getLocalidadPorProvincia } from '../localidad/localidad.service.js'
import {getProvincia,getProvincias} from './provincia.service.js'

async function obtenerProvincias(req,res){
    try {
        const provincias = await getProvincias()
        if(!provincias){
            return res.status(404).json({message: "No se encontraron provincias"})
        }
        return res.status(200).json(provincias)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

async function obtenerProvincia(req,res){
    try {
        const {id} = req.params
        const provincia = await getProvincia(id)
        if(!provincia){
            return res.status(404).json({message: "No se encontro la provincia"})
        }
        return res.status(200).json(provincia)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}
async function obtenerLocalidadPorProvincia(req,res) {
    try {
        const {id} = req.params
        const localidades = await getLocalidadPorProvincia(id)
        if(!localidades){
            return res.status(404).json({message: "No se encontro localidades para esa provincia"})
        }
        return res.status(200).json(localidades)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
    
}
export {
    obtenerProvincias,
    obtenerProvincia,
    obtenerLocalidadPorProvincia
}