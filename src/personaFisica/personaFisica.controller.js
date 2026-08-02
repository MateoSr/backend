import { getAllPersonasFisicas, getPersonaFisicaDni, postPersonaFisica, deletePersonaFisica, putPersonaFisica} from "./personaFisica.service.js"
import { ZodError } from 'zod';

async function obtenerPersonasFisicas(req,res) {
    try{
        const personasFisicas = await getAllPersonasFisicas()

        return res.status(200).json(personasFisicas)
        }catch(error){
        return res.status(400).json({error:error.message})
    }
}

async function obtenerPersonaFisica(req,res) {
    try{
        const {dni} = req.params
        const personaFisica = await getPersonaFisicaDni(dni)
        if(!personaFisica){
            return res.status(404).json({message:"No se encontro la persona"})
        }
        return res.status(200).json(personaFisica)
        }catch(error)
        {
        return res.status(400).json({error:error.message})
        }
}

async function crearPersonaFisica(req,res) {
    try{
        const personaFisica = req.body
        const resultado = await postPersonaFisica(personaFisica)
        return res.status(201).json({
            message: 'Persona creada correctamente',
            personaFisica: personaFisica
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

async function modificarPersonaFisica(req,res) {
    try{
        const {dni} = req.params
        const personaFisicaModificada = req.body
        const resultado = await putUser(dni,personaFisicaModificada)
        if(!resultado){
            return res.status(404).json({message:"No se encontro la persona"})
        }
        return res.status(200).json({
            message: 'Persona modificada correctamente',
            personaFisica: personaFisicaModificada
        })
        }catch(error)
        {
        return res.status(400).json({error:error.message})
        }
}

async function borrarPersonaFisica(req,res) {
    try{
        const {dni} = req.params
        const response = await deleteUser(dni)
        if(!response){
            return res.status(404).json({message:"No se encontro la persona"})
        }
        return res.status(200).json({
            message: 'Persona eliminada correctamente',
        })
        }catch(error)
        {
        return res.status(400).json({error:error.message})
        }
}

export {
  obtenerPersonasFisicas,
  obtenerPersonaFisica,
  crearPersonaFisica,
  borrarPersonaFisica,
  modificarPersonaFisica
};