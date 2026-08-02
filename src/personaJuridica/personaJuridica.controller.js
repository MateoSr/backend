import { getAllPersonasJuridicas, getPersonaJuridicaCuit, postPersonaJuridica, deletePersonaJuridica, putPersonaJuridica} from "./personaJuridica.service.js"
import { ZodError } from 'zod';

async function obtenerPersonasJuridicas(req,res) {
    try{
        const personasJuridicas = await getAllPersonasJuridicas()

        return res.status(200).json(personasJuridicas)
        }catch(error){
        return res.status(400).json({error:error.message})
    }
}

async function obtenerPersonaJuridica(req,res) {
    try{
        const {cuit} = req.params
        const personaJuridica = await getPersonaJuridicaCuit(cuit)
        if(!personaJuridica){
            return res.status(404).json({message:"No se encontro la empresa"})
        }
        return res.status(200).json(personaJuridica)
        }catch(error)
        {
        return res.status(400).json({error:error.message})
        }
}

async function crearPersonaJuridica(req,res) {
    try{
        const personaJuridica = req.body
        const resultado = await postPersonaJuridica(personaJuridica)
        return res.status(201).json({
            message: 'Empresa creada correctamente',
            personaJuridica: personaJuridica
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

async function modificarPersonaJuridica(req,res) {
    try{
        const {cuit} = req.params
        const personaJuridicaModificada = req.body
        const resultado = await putUser(cuit,personaJuridicaModificada)
        if(!resultado){
            return res.status(404).json({message:"No se encontro la empresa"})
        }
        return res.status(200).json({
            message: 'Empresa modificada correctamente',
            personaJuridica: personaJuridicaModificada
        })
        }catch(error)
        {
        return res.status(400).json({error:error.message})
        }
}

async function borrarPersonaJuridica(req,res) {
    try{
        const {cuit} = req.params
        const response = await deleteUser(cuit)
        if(!response){
            return res.status(404).json({message:"No se encontro la empresa"})
        }
        return res.status(200).json({
            message: 'Empresa eliminada correctamente',
        })
        }catch(error)
        {
        return res.status(400).json({error:error.message})
        }
}

export {
  obtenerPersonasJuridicas,
  obtenerPersonaJuridica,
  crearPersonaJuridica,
  borrarPersonaJuridica,
  modificarPersonaJuridica
};