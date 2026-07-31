import {getComplejoId,} from './complejos.service.js'

async function obtenerComplejos(req,res) {
    try{
        const complejos = await getAllComplejos()
        if(users == 0){
            return res.status(404).json({message:"No hay complejos"})
        }
        return res.status(200).json(complejos)
        }catch(error)
        {
        return res.status(400).json({error:error.message})
        }
}

async function obtenerComplejo(req,res) {
    try{
        const {id} = req.params
        const complejo = await getComplejoId(id)
        if(!complejo){
            return res.status(404).json({message:"No se encontro el complejo"})
        }
        return res.status(200).json(complejo)
        }catch(error)
        {
        return res.status(400).json({error:error.message})
        }
}

async function crearComplejo(req,res) {
    try{
        const complejo = req.body
        const resultado = await postComplejo(complejo)
        return res.status(201).json({
            message: 'Complejo creado correctamente',
            complejo: complejo
        })

        }catch(error)
        {
        return res.status(400).json({error:error.message})
        }
}

async function modificarComplejo(req,res) {
    try{
        const id = req.params
        const complejoModificado = req.body
        const resultado = await putComplejo(id,complejoModificado)
        return res.status(200).json({
            message: 'Complejo modificado correctamente',
            complejo: complejoModificado
        })
        }catch(error)
        {
        return res.status(400).json({error:error.message})
        }
}

async function borrarComplejo(req,res) {
    try{
        const id = req.params
        const response = await deleteComplejo(id)
        return res.status(200).json({
            message: 'Complejo eliminado correctamente',
        })
        }catch(error)
        {
        return res.status(400).json({error:error.message})
        }
}




export {
  obtenerComplejo,
  obtenerComplejos,
  crearComplejo,
  modificarComplejo,
  borrarComplejo
};