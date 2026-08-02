import {getAllUsers,getUserId,postUser,deleteUser,putUser} from "./users.service.js"
import { ZodError } from 'zod'; //modulo que permimte mostrar los errores de tipos de datos
async function obtenerUsers(req,res) {
    try{
        const users = await getAllUsers()
        // if(users == 0){
        //     return res.status(404).json({message:"No se encontraron usuarios"})
        return res.status(200).json(users)
        }catch(error){
        return res.status(400).json({error:error.message})
    }
}

async function obtenerUser(req,res) {
    try{
        const {id} = req.params
        const user = await getUserId(id)
        if(!user){
            return res.status(404).json({message:"No se encontro el usuario"})
        }
        return res.status(200).json(user)
        }catch(error)
        {
        return res.status(400).json({error:error.message})
        }
}

async function crearUser(req,res) {
    try{
        const user = req.body
        const resultado = await postUser(user)
        return res.status(201).json({
            message: 'Usuario creado correctamente',
            user: user
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

async function modificarUser(req,res) {
    try{
        const {id} = req.params
        const userModificado = req.body
        const resultado = await putUser(id,userModificado)
        if(!resultado){
            return res.status(404).json({message:"No se encontro el usuario"})
        }
        return res.status(200).json({
            message: 'Usuario modificado correctamente',
            user: userModificado
        })
        }catch(error)
        {
        return res.status(400).json({error:error.message})
        }
}

async function borrarUser(req,res) {
    try{
        const {id} = req.params
        const response = await deleteUser(id)
        if(!response){
            return res.status(404).json({message:"No se encontro el usuario"})
        }
        return res.status(200).json({
            message: 'Usuario eliminado correctamente',
        })
        }catch(error)
        {
        return res.status(400).json({error:error.message})
        }
}

export {
  obtenerUsers,
  obtenerUser,
  crearUser,
  borrarUser,
  modificarUser
};