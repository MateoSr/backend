import {getLocalidades,getLocalidad} from './localidad.service.js'

async function obtenerLocalidades(req,res){
    try {
        const localidades = await getLocalidades()
        if(!localidades){
            return res.status(404).json({message: "No se encontraron localidades"})
        }
        return res.status(200).json(localidades)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

async function obtenerLocalidad(req,res){
    try {
        const {id} = req.params
        const localidad = await getLocalidad(id)
        if(!localidad){
            return res.status(404).json({message: "No se encontro la localidad"})
        }
        return res.status(200).json(localidad)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}



export {
    obtenerLocalidad,
    obtenerLocalidades
}